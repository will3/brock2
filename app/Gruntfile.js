module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    serve: {
      options: {
        port: 9000
      }
    }
  });

  grunt.loadNpmTasks('grunt-serve');

  grunt.registerTask('default', ['serve']);

};