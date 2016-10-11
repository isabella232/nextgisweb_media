define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/request/xhr',
    'dojo/topic',
    'dojo/Deferred',
    'dojo/promise/all',
    'dijit/_WidgetBase',
    'ngw-media/leaflet/dist/' + document.packages.leaflet.name + '-' + document.packages.leaflet.version,
    'xstyle/css!ngw-media/contrib/leaflet/leaflet.css',
    'xstyle/css!ngw-media/contrib/leaflet/plugins/leaflet.DistortableImage/leaflet.distortableimage.css',
    'xstyle/css!ngw-media/contrib/leaflet/plugins/leaflet.toolbar/leaflet.toolbar.css'
], function (declare, lang, array, xhr, topic, Deferred, all, _WidgetBase, leafletPackage) {
    return declare([_WidgetBase], {
        constructor: function (options) {
            declare.safeMixin(this, options);
        },

        initialize: function () {
            this._buildOsmLayer();
            this._bindEvents();
            return this;
        },

        _buildOsmLayer: function () {
            this._map = new L.Map(this.domNode);
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            var osm = new L.TileLayer(osmUrl, {maxZoom: 16, attribution: osmAttrib});
            this._map.setView(new L.LatLng(40.712216, -74.22655), 9);
            this._map.addLayer(osm);
        },

        _bindEvents: function () {

        }
    });
});
