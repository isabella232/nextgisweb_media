/*
 * @class ImageOverlay
 * @aka L.ImageOverlay
 * @inherits Interactive layer
 *
 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 * L.imageOverlay(imageUrl, imageBounds).addTo(map);
 * ```
 */

L.CanvasOverlay = L.Class.extend({
    includes: L.Mixin.Events,

    // @section
    // @aka ImageOverlay options
    options: {
        // @option opacity: Number = 1.0
        // The opacity of the image overlay.
        opacity: 1,

        // @option alt: String = ''
        // Text for the `alt` attribute of the image (useful for accessibility).
        alt: '',

        // @option interactive: Boolean = false
        // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
        interactive: false,

        // @option attribution: String = null
        // An optional string containing HTML to be shown on the `Attribution control`
        attribution: null,

        // @option crossOrigin: Boolean = false
        // If true, the image will have its crossOrigin attribute set to ''. This is needed if you want to access image pixel data.
        crossOrigin: false
    },

    initialize: function (width, height, options) {
        this._canvasWidth = width;
        this._canvasHeight = height;
        L.setOptions(this, options);

        if (options.corners) {
            this._corners = options.corners;
        }
    },

    onAdd: function (map) {
        this._map = map;
        if (!this._canvas) {
            this._initCanvas();
            if (this.options.opacity < 1) {
                this._updateOpacity();
            }
        }

        if (!this._events) {
            this._initEvents();
        }

        map._panes.overlayPane.appendChild(this._canvas);

        map.on('viewreset', this._reset, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        if (!this._corners) {
            this._initCanvasDimensions(map);
        }

        this._reset();
        this.fire('add');
    },

    resetTransformation: function () {
        var map = this._map;
        if (map) {
            this._initCanvasDimensions(map);
            this._reset();
        }
    },

    _initCanvasDimensions: function (map) {
        var aspectRatio = parseInt(this._canvas.width) / parseInt(this._canvas.height);

        var canvasHeight = this._canvas.height;
        var canvasWidth = parseInt(aspectRatio * canvasHeight);

        var center = map.latLngToContainerPoint(map.getCenter());
        var offset = new L.Point(canvasWidth, canvasHeight).divideBy(2);

        this._corners = [
            map.containerPointToLatLng(center.subtract(offset)),
            map.containerPointToLatLng(center.add(new L.Point(offset.x, -offset.y))),
            map.containerPointToLatLng(center.add(new L.Point(-offset.x, offset.y))),
            map.containerPointToLatLng(center.add(offset))
        ];
    },

    _initEvents: function () {
        this._events = ['click'];

        for (var i = 0, l = this._events.length; i < l; i++) {
            L.DomEvent.on(this._canvas, this._events[i], this._fireMouseEvent, this);
        }
    },

    _fireMouseEvent: function (event) {
        if (!this.hasEventListeners(event.type)) {
            return;
        }

        var map = this._map,
            containerPoint = map.mouseEventToContainerPoint(event),
            layerPoint = map.containerPointToLayerPoint(containerPoint),
            latlng = map.layerPointToLatLng(layerPoint);

        this.fire(event.type, {
            latlng: latlng,
            layerPoint: layerPoint,
            containerPoint: containerPoint,
            originalEvent: event
        });
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    onRemove: function () {
        this._map._panes.overlayPane.removeChild(this._canvas);
        this.editing.removeHooks()
        if (this.options.interactive) {
            this.removeInteractiveTarget(this._canvas);
        }
    },

    // @method setOpacity(opacity: Number): this
    // Sets the opacity of the overlay.
    setOpacity: function (opacity) {
        this.options.opacity = opacity;

        if (this._canvas) {
            this._updateOpacity();
        }
        return this;
    },

    setStyle: function (styleOpts) {
        if (styleOpts.opacity) {
            this.setOpacity(styleOpts.opacity);
        }
        return this;
    },

    // @method bringToFront(): this
    // Brings the layer to the top of all overlays.
    bringToFront: function () {
        if (this._map) {
            L.DomUtil.toFront(this._canvas);
        }
        return this;
    },

    // @method bringToBack(): this
    // Brings the layer to the bottom of all overlays.
    bringToBack: function () {
        if (this._map) {
            L.DomUtil.toBack(this._canvas);
        }
        return this;
    },

    getAttribution: function () {
        return this.options.attribution;
    },

    getEvents: function () {
        var events = {
            zoom: this._reset,
            viewreset: this._reset
        };

        if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },

    getBounds: function () {
        var corners = this.getCorners(),
            southWest = corners[2],
            northEast = corners[1];
        return L.latLngBounds(southWest, northEast);
    },

    getElement: function () {
        return this._canvas;
    },

    _initCanvas: function () {
        var canvas = this._canvas = L.DomUtil.create('canvas',
            'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

        canvas.width = this._canvasWidth;
        canvas.height = this._canvasHeight;

        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');

        canvas.onselectstart = L.Util.falseFn;
        canvas.onmousemove = L.Util.falseFn;

        // canvas.onload = L.bind(this.fire, this, 'load');
        this.fire('load');
    },

    _updateCorner: function (corner, latlng) {
        this._corners[corner] = latlng;
        this._reset();
    },

    _reset: function () {
        var map = this._map,
            canvas = this._canvas,
            latLngToLayerPoint = L.bind(map.latLngToLayerPoint, map),

            transformMatrix = this._calculateProjectiveTransform(latLngToLayerPoint),
            topLeft = latLngToLayerPoint(this._corners[0]),

            warp = L.DomUtil.getMatrixString(transformMatrix),
            translation = L.DomUtil.getTranslateString(topLeft);

        /* See L.DomUtil.setPosition. Mainly for the purposes of L.Draggable. */
        canvas._leaflet_pos = topLeft;

        canvas.style[L.DomUtil.TRANSFORM] = [translation, warp].join(' ');

        /* Set origin to the upper-left corner rather than the center of the image, which is the default. */
        canvas.style[L.DomUtil.TRANSFORM + '-origin'] = "0 0 0";
    },

    _updateOpacity: function () {
        L.DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    /*
     * Calculates the transform string that will be correct *at the end* of zooming.
     * Leaflet then generates a CSS3 animation between the current transform and
     *		 future transform which makes the transition appear smooth.
     */
    _animateZoom: function (event) {
        var map = this._map,
            canvas = this._canvas,
            latLngToNewLayerPoint = function (latlng) {
                return map._latLngToNewLayerPoint(latlng, event.zoom, event.center);
            },

            transformMatrix = this._calculateProjectiveTransform(latLngToNewLayerPoint),
            topLeft = latLngToNewLayerPoint(this._corners[0]),

            warp = L.DomUtil.getMatrixString(transformMatrix),
            translation = L.DomUtil.getTranslateString(topLeft);

        /* See L.DomUtil.setPosition. Mainly for the purposes of L.Draggable. */
        canvas._leaflet_pos = topLeft;

        if (!L.Browser.gecko) {
            canvas.style[L.DomUtil.TRANSFORM] = [translation, warp].join(' ');
        }
    },

    getCorners: function () {
        return this._corners;
    },

    /*
     * Calculates the centroid of the image.
     *		 See http://stackoverflow.com/questions/6149175/logical-question-given-corners-find-center-of-quadrilateral
     */
    getCenter: function (ll2c, c2ll) {
        var map = this._map,
            latLngToCartesian = ll2c ? ll2c : map.latLngToLayerPoint,
            cartesianToLatLng = c2ll ? c2ll : map.layerPointToLatLng,
            nw = latLngToCartesian.call(map, this._corners[0]),
            ne = latLngToCartesian.call(map, this._corners[1]),
            se = latLngToCartesian.call(map, this._corners[2]),
            sw = latLngToCartesian.call(map, this._corners[3]),

            nmid = nw.add(ne.subtract(nw).divideBy(2)),
            smid = sw.add(se.subtract(sw).divideBy(2));

        return cartesianToLatLng.call(map, nmid.add(smid.subtract(nmid).divideBy(2)));
    },

    _calculateProjectiveTransform: function (latLngToCartesian) {
        /* Setting reasonable but made-up image defaults
         * allow us to place images on the map before
         * they've finished downloading. */
        var offset = latLngToCartesian(this._corners[0]),
            w = this._canvas.offsetWidth || 500,
            h = this._canvas.offsetHeight || 375,
            c = [],
            j;
        /* Convert corners to container points (i.e. cartesian coordinates). */
        for (j = 0; j < this._corners.length; j++) {
            c.push(latLngToCartesian(this._corners[j])._subtract(offset));
        }

        /*
         * This matrix describes the action of the CSS transform on each corner of the image.
         * It maps from the coordinate system centered at the upper left corner of the image
         *		 to the region bounded by the latlngs in this._corners.
         * For example:
         *		 0, 0, c[0].x, c[0].y
         *		 says that the upper-left corner of the image maps to the first latlng in this._corners.
         */
        return L.MatrixUtil.general2DProjection(
            0, 0, c[0].x, c[0].y,
            w, 0, c[1].x, c[1].y,
            0, h, c[2].x, c[2].y,
            w, h, c[3].x, c[3].y
        );
    }
});
