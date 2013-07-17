module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            dev: {
                options: {
                    port: 1119,
                    base: 'src',
                    keepalive: true
                }
            },
            release: {
                options: {
                    port: 1119,
                    base: 'release',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

};
