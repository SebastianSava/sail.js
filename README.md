[![NPM Version](https://img.shields.io/npm/v/sail.js)](https://www.npmjs.com/package/sail.js)
[![NPM Downloads](https://img.shields.io/npm/dm/sail.js)](https://www.npmjs.com/package/sail.js)
[![](https://data.jsdelivr.com/v1/package/npm/sail.js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/sail.js)

# sail.js

_Sailing Through Scripts: Smooth Library Loading Ahead._

> Sail.js is a lightweight JavaScript library designed to streamline the loading of external JS and CSS files from various sources. Inspired by the Head.js library, Sail.js offers an easy-to-use API that allows developers to manage script and stylesheet dependencies dynamically and efficiently.

## Features

- **Asynchronous Loading**: Load JS and CSS files asynchronously without blocking the browser's rendering engine.
- **Easy Integration**: Seamlessly integrates with AMD, CommonJS and browser environments.
- **No Duplicates**: Automatically handles and prevents the loading of duplicate files.
- **Event Handling**: Supports custom events for asset load completion, enhancing flexibility in handling loaded resources.

## Getting Started

### Installation

You can include `sail.js` in your project by downloading the script directly or linking to a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/sail.js/dist/sail.min.js"></script>
```

---

### Usage

You can load your files using `sail.init` method as shown below:

```javascript
sail.init({
  name: 'example',
  files: [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.13.10/cdn.js?v=1'
  ],
  onComplete: function (files) {
    console.log('Loaded files:', files);
  }
});
```

To perform actions after the files have been loaded, use the `sail.ready` method with an optional group name and a required callback:

```javascript
sail.ready('example', function (files) {
  console.log('Example files are ready to be used:', files);
});
```

If you do not specify a group name, it will default to listening for all assets:

```javascript
sail.ready(function (files) {
  console.log('All files are ready to be used:', files);
});
```

---

### API Reference

### `sail.init(options)`

Initializes the loading process for the specified assets.

**Parameters**

- `options` (Object):
  - `name`: Identifier for the set of assets (optional).
  - `files`: Array of URLs for the files to load (required).
  - `onComplete`: Callback function executed once all files are loaded (optional).

### `sail.ready(name, callback)`

Adds a callback function that is executed once all specified assets are ready.

**Parameters**

- `name`: Name of the asset group (optional).
- `callback`: Function to execute once assets are ready.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

Sail.js is open source software [licensed as MIT](https://github.com/SebastianSava/sail.js/blob/main/LICENSE).
