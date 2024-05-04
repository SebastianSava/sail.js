(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory(root));
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(root);
  } else {
    // Browser globals (root is window)
    root.sail = factory(root);
  }
})(
  typeof global !== 'undefined' ? global : this.window || this.global,
  function (root) {
    'use strict';

    const api = {};
    const globalAssets = [];
    const globalPromises = [];
    const window = root;
    const supports = !!document.querySelector && !!window.addEventListener;

    let globalCalls = 0;

    /**
     * A function to asynchronously load a file based on the provided URL and file extension.
     *
     * @private
     * @param {string} url - The URL of the file to load.
     * @param {string} fileExt - The extension of the file ('js' for JavaScript or 'css' for CSS).
     * @return {Promise} A Promise that resolves when the file is successfully loaded, and rejects if an error occurs.
     */
    const loadFile = function (url, fileExt) {
      return new Promise((resolve, reject) => {
        let file;

        if (fileExt === 'js') {
          file = document.createElement('script');

          file.async = false;
          file.defer = true;
          file.src = url;
          file.type = 'text/javascript';
        } else if (fileExt === 'css') {
          file = document.createElement('link');

          file.href = url;
          file.rel = 'stylesheet';
        } else {
          reject(new Error('Unsupported file type'));

          return;
        }

        file.onload = resolve;
        file.onerror = reject;

        document.head.appendChild(file);
      });
    };

    /**
     * A function to extract the label from a URL.
     *
     * @private
     * @param {string} url - The URL to extract the label from.
     * @return {string} The extracted label from the URL.
     */
    const toLabel = function (url) {
      const items = url.split('/');
      const name = items[items.length - 1];
      const i = name.indexOf('?');

      return i !== -1 ? name.substring(0, i) : name;
    };

    /**
     * A function to extract the extension from a given URL.
     *
     * @private
     * @param {string} url - The URL to extract the extension from.
     * @return {string} The extracted extension in lowercase.
     */
    const getExtension = function (url = '') {
      const items = url.split('?')[0].split('.');

      return items[items.length - 1].toLowerCase();
    };

    /**
     * Returns an object representing an asset based on the given item.
     *
     * @private
     * @param {Object|string} item - The item to be processed. If an object, it should have a single key-value pair where the key is the label and the value is the URL. If a string, it is treated as the URL.
     * @return {Object} An object with the following properties:
     *   - name: The label of the asset. If the input is a string, it is converted to a label using the toLabel function.
     *   - extension: The extension of the asset. It is extracted using the getExtension function.
     *   - url: The URL of the asset. If the input is an object, it is the value of the single key-value pair. If the input is a string, it is the input itself.
     */
    const getAsset = function (item) {
      let asset = {};

      if (typeof item === 'object') {
        for (const label in item) {
          if (!!item[label]) {
            asset = {
              name: label,
              extension: getExtension(item[label]),
              url: item[label]
            };
          }
        }
      } else {
        asset = {
          name: toLabel(item),
          extension: getExtension(item),
          url: item
        };
      }

      return asset;
    };

    /**
     * Executes a callback function when all specified assets are ready. If no arguments are provided,
     * waits for all global assets to be ready before executing the callback. If a callback is not
     * provided, does nothing.
     *
     * @public
     * @param {string} name - The name of the assets to load. If not provided, all assets are loaded.
     * @param {Function} callback - The callback function to execute when all assets are ready.
     * @return {void}
     */
    api.ready = function () {
      if (!supports) return;

      const args = arguments;
      const name = args[args.length - 2];
      const callback = args[args.length - 1];

      let localCalls = 0;

      if (typeof callback !== 'function') return;

      // Load specific set of files
      if (typeof name === 'string')
        window.addEventListener(`lib:${name}`, callback, false);

      // Load all files
      if (typeof name !== 'string')
        window.addEventListener(
          'lib:all',
          function () {
            localCalls++; // increase the number of local calls

            if (globalCalls === localCalls) callback.apply(api, [globalAssets]);
          },
          false
        );
    };

    /**
     * Initializes the assets by loading each file asynchronously and executes a callback function when all files have been loaded.
     *
     * @public
     * @param {Object} options - An object containing the following properties:
     *   - name: The name of the assets. If not provided, the assets are not named.
     *   - files: An array of URLs to the assets to be loaded.
     *   - onComplete: A callback function to be executed when all files have been loaded.
     * @return {void}
     */
    api.init = function ({ name, files, onComplete }) {
      if (!supports || !files.length) return;

      files = [...new Set(files)]; // remove duplicates

      globalCalls++; // increase the number of global calls

      const localAssets = [];
      const localPromises = [];

      for (const file of files) {
        const fileAsset = getAsset(file);

        if (
          globalAssets.some(
            (e) =>
              e.name === fileAsset.name && e.extension === fileAsset.extension
          )
        )
          continue;

        fileAsset.promise = loadFile(fileAsset.url, fileAsset.extension);

        // Add the asset to the global lists
        globalAssets.push(fileAsset);
        globalPromises.push(fileAsset.promise);

        // Add the asset to the local lists
        localAssets.push(fileAsset);
        localPromises.push(fileAsset.promise);
      }

      Promise.all(localPromises).then(function (values) {
        if (!values.length) return;

        // Execute the callback
        if (typeof onComplete === 'function')
          onComplete.apply(api, [localAssets]);

        // Execute the event
        if (typeof name === 'string')
          window.dispatchEvent(new Event(`lib:${name}`));

        window.dispatchEvent(new Event('lib:all'));
      });
    };

    return api;
  }
);
