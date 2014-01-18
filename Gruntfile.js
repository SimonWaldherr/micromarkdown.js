module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "micromarkdown.js", "dist/micromarkdown.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip(contents, {}).length;
          }
        },
        cache: "dist/.sizecache.json"
      }
    },
    jshint: {
      files: ['./micromarkdown.js'],
      options: {
        globals: {}
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * * * * *\n' +
                ' *  micromarkdown .js  *\n' +
                ' *    Version <%= pkg.version %>    *\n' +
                ' *    License:  MIT    *\n' +
                ' *   Simon  Waldherr   *\n' +
                ' * * * * * * * * * * * */\n\n',
        footer: '\n\n/* /micromarkdown */\n'
      },
      dist: {
        files: {
          './dist/micromarkdown.min.js': ['./micromarkdown.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'dist/micromarkdown.min.js', dest: 'dist/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'uglify', 'compare_size']);
};
