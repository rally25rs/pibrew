'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true
      }
    },

    mochaTest: {
    	src: ['test/**/*.js'],
    	options: {
    		// require: ['chai'],
    		reporter: 'spec'
    	}
    },

    koa: {
      serve: {
        options: {
          static: 'src/ui'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-koa');

  grunt.registerTask('default', ['jshint', 'mochaTest', 'koa:serve']);

};