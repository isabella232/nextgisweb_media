define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/request/xhr',
    'dojox/dtl',
    'dojox/dtl/Context'
], function (declare, lang, xhr, dtl, dtlContextCl) {

    return declare([], {
        constructor: function (ngwApplicationUrl) {
            this.ngwApplicationUrl = ngwApplicationUrl || '';
        },

        GET_FEATURES: new dtl.Template('/api/resource/{{resourceId}}/feature/{{featureId}}', true),
        EDIT_FEATURE: new dtl.Template('/api/resource/{{resourceId}}/feature/{{featureId}}', true),
        GET_ALL_FEATURES: new dtl.Template('/api/resource/{{resourceId}}/feature/', true),
        GET_RESOURCE: new dtl.Template('/api/resource/{{resourceId}}', true),
        GET_MEDIA_LIST: '/api/media/items',
        UPDATE_MEDIA_LAYER_CORNERS: '/api/media/layer/corners',

        ngwApplicationUrl: null,

        getAllFeatures: function (resourceId) {
            var dtlContext = new dtlContextCl({resourceId: resourceId}),
                url = this.ngwApplicationUrl + this.GET_ALL_FEATURES.render(dtlContext);
            return xhr.get(url, {
                handleAs: 'json'
            });
        },

        getFeature: function (resourceId, featureId) {
            var dtlContext = new dtlContextCl({resourceId: resourceId, featureId: featureId}),
                url = this.ngwApplicationUrl + this.GET_FEATURE.render(dtlContext);
            return xhr.get(url, {
                handleAs: 'json'
            });
        },

        getResourceInfo: function (resourceId) {
            var dtlContext = new dtlContextCl({resourceId: resourceId}),
                url = this.ngwApplicationUrl + this.GET_RESOURCE.render(dtlContext);
            return xhr.get(url, {
                handleAs: 'json'
            });
        },

        getMediaList: function () {
            return xhr.get(this.GET_MEDIA_LIST, {
                handleAs: 'json'
            });
        },

        updateCorners: function (layerName, corners) {
            return xhr.post(this.UPDATE_MEDIA_LAYER_CORNERS, {
                handleAs: 'json',
                data: {
                    name: layerName,
                    corners: JSON.stringify(corners)
                }
            });
        }
    });
});