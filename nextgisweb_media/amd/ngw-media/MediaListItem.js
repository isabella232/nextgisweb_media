define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/ready',
    'dojo/topic',
    'dojo/on',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'ngw/settings!media',
    'dojo/text!./template/MediaListItem.hbs',
    'dijit/form/CheckBox',
    'ngw-media/VideoControls',
    'ngw-media/MediaControls'
], function (declare, lang, ready, topic, on, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             i18n, hbsI18n, clientMediaSettings, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        templateString: hbsI18n(template, i18n),

        constructor: function (options) {
            declare.safeMixin(this, options);
            var layerOptions = {};
            if (this.mediaItemInfo.corners) {
                layerOptions.corners = JSON.parse(this.mediaItemInfo.corners);
            }
            this._layer = new L.DistortableVideo(clientMediaSettings.media_path + this.mediaItemInfo.name,
                this.mediaItemInfo.width, this.mediaItemInfo.height, this.mediaItemInfo.fps, layerOptions);
        },

        postCreate: function () {
            this._bindEvents();
        },

        _bindEvents: function () {
            on(this.checkbox, 'change', lang.hitch(this, function () {
                this.toggleLayer(this.checkbox.checked);
            }));
        },

        toggleLayer: function (value) {
            if (value) {
                this.map.addDistortableLayer(this._layer);
                this.emit('activated', {
                    mediaItemInfo: this.mediaItemInfo,
                    layer: this._layer
                });
            } else {
                this.map.removeDistortableLayer(this._layer);
                this.emit('deactivated', {
                    mediaItemInfo: this.mediaItemInfo,
                    layer: this._layer
                });
            }
        }
    });
});
