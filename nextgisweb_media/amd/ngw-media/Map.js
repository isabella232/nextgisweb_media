define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/request/xhr',
    'dojo/topic',
    'dojo/Evented',
    'dojo/Deferred',
    'dojo/promise/all',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/Map.hbs',
    'ngw-media/leaflet/dist/' + document.packages.leaflet.name + '-' + document.packages.leaflet.version,
    'xstyle/css!ngw-media/leaflet/dist/css/' + document.packages.leaflet.name + '-' + document.packages.leaflet.version + '.css'
], function (declare, lang, array, xhr, topic, Evented, Deferred, all, _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin,
             i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        templateString: hbsI18n(template, i18n),

        constructor: function (options) {
            declare.safeMixin(this, options);
        },

        initialize: function () {
            this._buildMap();
            this._buildOsmLayer();
            this._bindEvents();

            return this;
        },

        _buildMap: function () {
            this._map = new L.Map('map');
        },

        _buildOsmLayer: function () {
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            var osm = new L.TileLayer(osmUrl, {maxZoom: 16, attribution: osmAttrib});
            this._map.setView(new L.LatLng(40.712216, -74.22655), 9);
            this._map.addLayer(osm);
        },

        _bindEvents: function () {
            topic.subscribe('media/map/distortable-layer/add', lang.hitch(this, function (layer) {
                layer.addTo(this._map);
                layer.editing.enable();
                this.emit('distortableLayerAdded', {
                    layer: layer
                });
            }));

            topic.subscribe('media/map/distortable-layer/remove', lang.hitch(this, function (layer) {
                this._map.removeLayer(layer);
                this.emit('distortableLayerRemoved', {
                    layer: layer
                });
            }));
        },

        addDistortableLayer: function (distortableLayer) {
            distortableLayer.addTo(this._map);
            distortableLayer.editing.enable();
        },

        removeDistortableLayer: function (distortableLayer) {
            this._map.removeLayer(distortableLayer);
            distortableLayer.editing.disable();
        }
    });
});
