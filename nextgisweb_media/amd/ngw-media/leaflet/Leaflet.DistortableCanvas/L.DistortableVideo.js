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

L.DistortableVideo = L.CanvasOverlay.extend({
    options: {},
    _video: null,

    initialize: function (url, width, height, fps, options) {
        this._url = url;
        this._fps = fps;
        L.CanvasOverlay.prototype.initialize.call(this, width, height, options);
    },

    onAdd: function (map) {
        L.CanvasOverlay.prototype.onAdd.call(this, map);

        if (!this._video) {
            this._initVideo();
        }
        document.body.appendChild(this._video);
        this._video.play();
        this._initRendering();
    },

    _initVideo: function () {
        var video = this._video = L.DomUtil.create('video', 'hide');
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        var source = this._source = L.DomUtil.create('source');
        source.src = this._url;
        video.appendChild(source);
    },

    _initRendering: function () {
        this._video.addEventListener('play', this._playHandler.bind(this), 0);
    },

    _playHandler: function () {
        var $this = this._video,
            canvas = this._canvas,
            ctx = canvas.getContext('2d');

        (function loop() {
            if (!$this.paused && !$this.ended) {
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000 / $this._fts); // drawing at 30fps
            }
        })();
    },

    onRemove: function () {
        this._video.removeEventListener('play', this._playHandler, 0);
        document.body.removeChild(this._video);
        L.CanvasOverlay.prototype.onRemove.call(this);
    }
});
