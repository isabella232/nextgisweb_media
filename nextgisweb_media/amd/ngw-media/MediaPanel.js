define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/topic',
    'dojo/ready',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/MediaPanel/MediaPanel.hbs',
    'dijit/form/DateTextBox',
    'ngw-media/MediaList',
    'xstyle/css!' + ngwConfig.amdUrl + 'ngw-media/template/MediaPanel/style.css'
], function (declare, lang, on, topic, ready, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: hbsI18n(template, i18n),

        constructor: function (options) {
            declare.safeMixin(this, options);

            ready(lang.hitch(this, function () {
                this.mediaList.initialize(this.display.map);
                this._bindEvents();
            }));
        },

        _bindEvents: function () {
        }
    });
});
