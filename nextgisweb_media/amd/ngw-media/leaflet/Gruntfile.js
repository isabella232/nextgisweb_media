var leafletFiles = [
    'node_modules/leaflet/dist/leaflet-src.js',
    'node_modules/leaflet-toolbar/dist/leaflet.toolbar-src.js',
    'node_modules/Leaflet.DistortableImage/dist/leaflet.distortableimage.js',
    'Leaflet.DistortableCanvas/util/*.js',
    'Leaflet.DistortableCanvas/edit/EditHandle.js',
    'Leaflet.DistortableCanvas/edit/LockHandle.js',
    'Leaflet.DistortableCanvas/edit/DistortHandle.js',
    'Leaflet.DistortableCanvas/edit/RotateHandle.js',
    'Leaflet.DistortableCanvas/L.CanvasOverlay.js',
    'Leaflet.DistortableCanvas/edit/DistortableCanvas.EditToolbar.js',
    'Leaflet.DistortableCanvas/edit/DistortableCanvas.Edit.js',
    'Leaflet.DistortableCanvas/L.DistortableVideo.js'
];

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                options: {
                    compress: false,
                    sourceMap: true,
                    sourceMapName: 'dist/<%= pkg.name %>-<%= pkg.version %>.map'
                },
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': leafletFiles
                }
            }
        },
        concat: {
            js: {
                options: {
                    // separator: ';'
                },
                src: leafletFiles,
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                sourceMap: true
            },
            target: {
                files: {
                    'dist/css/<%= pkg.name %>-<%= pkg.version %>.css': [
                        'node_modules/leaflet/dist/leaflet.css',
                        'node_modules/leaflet-toolbar/dist/leaflet.toolbar.css',
                        'node_modules/font-awesome/css/font-awesome.css',
                        'node_modules/Leaflet.DistortableImage/dist/leaflet.distortableimage.css'
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/leaflet/dist/images/*'],
                        dest: 'dist/images/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/font-awesome/fonts/*'],
                        dest: 'dist/fonts/',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['uglify', 'cssmin', 'copy', 'concat']);
};