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
            var layerId, filter;

            layerId = mediaListItem.id;
            if (visibility) {
                var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
                    imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
                var layer = new L.DistortableCanvasOverlay(imageUrl, imageBounds);
                layer.addTo(this.map._map);
                // this._standby.show();
                // filter = this.tracksPanel.getFilter();
                // this.map.addTrackLayer(layerId, filter, {
                //     displayName: mediaListItem.displayName,
                //     color: mediaListItem.color,
                //     zIndex: mediaListItem.zIndex
                // }).then(lang.hitch(this, function () {
                //     this.map.highlightLastPoint(layerId, mediaListItem.isShowLastPoint());
                //     this.updateTracksTable();
                //     topic.publish('/tracker/map/zoom/to/layer', mediaListItem.id);
                //     mediaListItem.enableShowLastPoint();
                //     this._standby.hide();
                // }));
            } else {
                // mediaListItem.disableShowLastPoint();
                // this.map.removeTrackLayer(layerId);
                // this.updateTracksTable();
            }
        },

        updateTracksTable: function () {
            var tracksLayersData = this.map.getTrackLayersData();
            this.tracksTable.renderTracksData(tracksLayersData);
        }
    });
});
