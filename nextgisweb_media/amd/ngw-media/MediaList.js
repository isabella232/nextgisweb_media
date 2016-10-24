define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/query',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/topic',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-media/MediaListItem',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/MediaList.hbs',
    'dijit/form/DateTextBox'
], function (declare, lang, array, on, query, domStyle, domClass, topic,
             _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin,
             MediaListItem, i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: hbsI18n(template, i18n),

        constructor: function (options) {
            declare.safeMixin(this, options);
        },

        _map: null,
        initialize: function (map) {
            this._map = map;
            this.loadMedia();
        },

        loadMedia: function () {
            this.ngwServiceFacade.getMediaList().then(lang.hitch(this, function (mediaItems) {
                this.renderMediaItems(mediaItems);
            }));
        },

        _mediaItems: [],
        renderMediaItems: function (mediaItems) {
            var mediaListItem;
            array.forEach(mediaItems, function (mediaItemInfo) {
                mediaListItem = new MediaListItem({
                    mediaItemInfo: mediaItemInfo,
                    map: this._map,
                    ngwServiceFacade: this.ngwServiceFacade
                });
                mediaListItem.placeAt(this.domNode, 'first');
                this.bindEvents(mediaListItem);
                this._mediaItems.push(mediaListItem);
            }, this);
        },

        bindEvents: function (mediaListItem) {
            on(mediaListItem, 'change', lang.hitch(this, function () {
                topic.publish('/media/layer/visibility/change', mediaListItem,
                    mediaListItem.checkbox.checked);
            }));
        },

        getTrackListItemsState: function () {
            return array.map(this._trackListItems, function (trackListItem) {
                return {
                    'layerId': trackListItem.id,
                    'visible': trackListItem.checkbox.get('checked'),
                    'showLastPoint': trackListItem.showLastPoint.get('checked')
                }
            });
        }
    });
});
