module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsBanner: grunt.file.read('./banner.js'),

    concat: {
      options: {
        banner: '<%= jsBanner %>'
      },
      sail: {
        files: {
          './dist/sail.js': './src/sail.js'
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= jsBanner %>',
        output: {
          ascii_only: true,
          comments: false,
          indent_level: 2
        },
        mangle: {},
        compress: { drop_console: true },
        beautify: false
      },
      sail: {
        files: {
          './dist/sail.min.js': './src/sail.js'
        }
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // register tasks
  grunt.registerTask('default', ['concat', 'uglify']);
};
