module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'test/results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['modules/**/test/*.js', 'test/*.js']
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'lib/*.js', 'modules/**/*.js', 'helper/*.js', '*.js']
    }
  });

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('lint', 'jshint');

};