define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/ready',
    'dojo/topic',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojox/widget/Standby',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/Display.hbs',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/layout/TabContainer',
    'ngw-media/Map',
    'ngw-media/MediaPanel'
], function (declare, lang, array, ready, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             Standby, i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: hbsI18n(template, i18n),
        constructor: function (options) {
            declare.safeMixin(this, options);

            ready(lang.hitch(this, function () {
                this.map.initialize();
                this._buildStandBy();
                this.bindEvents();
            }));
        },

        _buildStandBy: function () {
            this._standby = new Standby({
                target: this.mapContainer.domNode
            });
            document.body.appendChild(this._standby.domNode);
            this._standby.startup();
        },

        bindEvents: function () {
            topic.subscribe('/media/layer/visibility/change', lang.hitch(this, function (mediaListItem, visibility) {
                this._layerVisibilityChangedHandler(mediaListItem, visibility);
            }));

            topic.subscribe('/tracker/filter/changed', lang.hitch(this, function (filter) {
                this._standby.show();
                this.map.rebuildTrackLayers(filter).then(lang.hitch(this, function () {
                    this.map.setLayersStyles(this.tracksPanel.tracksList.getTrackListItemsState());
                    this.updateTracksTable();
                    this._standby.hide();
                }));
            }));
        },

        _layerVisibilityChangedHandler: function (mediaListItem, visibility) {
            mediaListItem.toggleLayer(visibility);
        },

        updateTracksTable: function () {
            var tracksLayersData = this.map.getTrackLayersData();
            this.tracksTable.renderTracksData(tracksLayersData);
        }
    });
});
