define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/ready',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/MediaListItem.hbs',
    'dijit/form/CheckBox',
    'dijit/form/DropDownButton',
    'dojox/widget/ColorPicker',
    'dijit/form/ToggleButton'
], function (declare, lang, ready, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: hbsI18n(template, i18n),

        constructor: function (options) {
            declare.safeMixin(this, options);
        },

        enableShowLastPoint: function () {
            this.showLastPoint.set('disabled', false);
        },

        disableShowLastPoint: function () {
            this.showLastPoint.set('disabled', true);
        },

        isShowLastPoint: function () {
            return this.showLastPoint.get('checked');
        }
    });
});
