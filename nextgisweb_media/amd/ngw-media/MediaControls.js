define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/request/xhr',
    'dojo/query',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'ngw-pyramid/i18n!webmap',
    'ngw-pyramid/hbs-i18n',
    'dojo/text!./template/MediaControls/MediaControls.hbs',
    'xstyle/css!' + ngwConfig.amdUrl + 'ngw-media/template/MediaControls/fontello/css/fontello.css',
    'xstyle/css!' + ngwConfig.amdUrl + 'ngw-media/template/MediaControls/MediaControls.css',
    'dijit/form/ToggleButton',
    'dijit/form/Button'
], function (declare, lang, xhr, query, on, topic, domAttr, domClass,
             _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             i18n, hbsI18n, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: hbsI18n(template, i18n),

        postMixInProperties: function () {
            this.inherited(arguments);
            this.mediaType = {};
            this.mediaType[this.mediaListItem.mediaItemInfo.type] = true;
        },

        postCreate: function () {
            this.inherited(arguments);
            this._bindEvents();
            this._setButtonsStyle();
        },

        _bindEvents: function () {
            on(this.mediaListItem, 'activated', lang.hitch(this, function (e) {
                this._activateEvents();
                this.saveButton.set('disabled', false);
                this.rotateButton.set('disabled', false);
                this.transparencyButton.set('disabled', false);
                this.resetButton.set('disabled', false);
                this.zoomToLayerButton.set('disabled', false);
                domClass.remove(this.domNode, 'disabled');
            }));

            on(this.mediaListItem, 'deactivated', lang.hitch(this, function (e) {
                this._deactivateEvents();
                domClass.add(this.domNode, 'disabled');
                this.saveButton.set('disabled', 'disabled');
                this.rotateButton.set('disabled', 'disabled');
                this.transparencyButton.set('disabled', 'disabled');
                this.resetButton.set('disabled', 'disabled');
                this.zoomToLayerButton.set('disabled', 'disabled');
            }));
        },

        _setButtonsStyle: function () {
            domClass.add(query('.dijitButtonNode', this.transparencyButton.domNode)[0], 'icon-adjust');
            domClass.add(query('.dijitButtonNode', this.rotateButton.domNode)[0], 'icon-ccw');
            domClass.add(query('.dijitButtonNode', this.saveButton.domNode)[0], 'icon-floppy');
            domClass.add(query('.dijitButtonNode', this.resetButton.domNode)[0], 'icon-undo');
            domClass.add(query('.dijitButtonNode', this.zoomToLayerButton.domNode)[0], 'icon-zoom-in')
        },

        _zoomToLayerButtonHandler: null,
        _rotateButtonHandler: null,
        _transparencyButtonHandler: null,
        _saveButtonHandler: null,
        _resetButtonHandler: null,

        _activateEvents: function () {
            this._zoomToLayerButtonHandler = on(this.zoomToLayerButton, 'click', lang.hitch(this, function () {
                var map = this.mediaListItem._layer._map,
                    bounds = this.mediaListItem._layer.getBounds();
                map.fitBounds(bounds);
            }));

            this._rotateButtonHandler = on(this.rotateButton, 'change', lang.hitch(this, function (state) {
                this.mediaListItem._layer.editing._toggleRotateDistort();
            }));

            this._transparencyButtonHandler = on(this.transparencyButton, 'change', lang.hitch(this, function () {
                this.mediaListItem._layer.editing._toggleTransparency();
            }));

            this._saveButtonHandler = on(this.saveButton, 'click', lang.hitch(this, function () {
                var layerChanges = confirm('Сохранить текущий слой?');
                if (layerChanges == true) {
                    this.mediaListItem.ngwServiceFacade.updateCorners(
                        this.mediaListItem.mediaItemInfo.name,
                        this.mediaListItem._layer.getCorners()
                    ).then(lang.hitch(this, function (value) {
                        console.log(value);
                    }));
                }
            }));

            this._resetButtonHandler = on(this.resetButton, 'click', lang.hitch(this, function () {
                this.mediaListItem._layer.resetTransformation();
            }));
        },

        _deactivateEvents: function () {
            if (this._zoomToLayerButtonHandler) {
                this._zoomToLayerButtonHandler.remove();
            }
            this._zoomToLayerButtonHandler = null;

            if (this._rotateButtonHandler) {
                this._rotateButtonHandler.remove();
            }
            this._rotateButtonHandler = null;

            if (this._transparencyButtonHandler) {
                this._transparencyButtonHandler.remove();
            }
            this._transparencyButtonHandler = null;

            if (this._saveButtonHandler) {
                this._saveButtonHandler.remove();
            }
            this._saveButtonHandler = null;

            if (this._resetButtonHandler) {
                this._resetButtonHandler.remove();
            }
            this._resetButtonHandler = null;
        }
    });
});
