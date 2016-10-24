define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/on',
    'dojo/topic',
    'dojo/html',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/VideoControls/VideoControls.hbs',
    'xstyle/css!' + ngwConfig.amdUrl + 'ngw-media/template/VideoControls/VideoControls.css'
], function (declare, lang, query, on, topic, html, domAttr, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: hbsI18n(template, i18n),

        constructor: function () {
        },

        _seekRangeElement: null,
        _durationElement: null,

        postCreate: function () {
            this._bindEvents();
        },

        _bindEvents: function () {
            var layer;

            on(this.mediaListItem, 'activated', lang.hitch(this, function (e) {
                layer = e.layer;
                domClass.remove(this.domNode, 'disabled');
                domAttr.remove(this.seekRangeElement, 'disabled');
                this._bindControlsHandlers(e.mediaItemInfo, e.layer._video);
            }));

            on(this.mediaListItem, 'deactivated', lang.hitch(this, function (e) {
                domClass.add(this.domNode, 'disabled');
                domAttr.set(this.seekRangeElement, 'value', 0);
                html.set(this.durationElement, '00:00');
                domAttr.set(this.seekRangeElement, 'disabled', 'disabled');
                this._unbindControlsHandlers();
            }));
        },

        _seekBarHandler: null,
        _videoHandler: null,
        _bindControlsHandlers: function (mediaItemInfo, videoElement) {
            this._seekBarHandler = on(this.seekRangeElement, 'change', lang.hitch(this, function () {
                videoElement.pause();
                videoElement.currentTime = mediaItemInfo.duration * (this.seekRangeElement.value / 100);
                this._updateDurationText(videoElement.currentTime);
                videoElement.play();
            }));
            this._videoHandler = on(videoElement, 'timeupdate', lang.hitch(this, function () {
                this.seekRangeElement.value = (100 / mediaItemInfo.duration) * videoElement.currentTime;
                this._updateDurationText(videoElement.currentTime);
            }));
        },

        _updateDurationText: function (durationInSeconds) {
            var minutes = Math.floor(durationInSeconds / 60);
            var seconds = Math.floor(durationInSeconds - (minutes * 60));

            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            this.durationElement.innerHTML = minutes + ':' + seconds;
        },

        _unbindControlsHandlers: function () {
            this._seekBarHandler.remove();
            this._seekBarHandler = null;
            this._videoHandler.remove();
            this._videoHandler = null;
        }
    });
});
