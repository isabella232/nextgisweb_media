module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/<%= pkg.name %>-<%= pkg.version %>.map'
                },
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.js': [
                        'node_modules/leaflet/dist/leaflet-src.js',
                        'node_modules/leaflet-toolbar/dist/leaflet.toolbar-src.js',
                        'node_modules/Leaflet.DistortableImage/dist/leaflet.distortableimage.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};