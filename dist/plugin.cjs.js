'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

class CameraPreviewWeb extends core.WebPlugin {
    constructor() {
        super({
            name: "CameraPreview",
            platforms: ["web"],
        });
    }
    async start(options) {
        return new Promise(async (resolve, reject) => {
            await navigator.mediaDevices.getUserMedia({
                audio: !options.disableAudio,
                video: true
            }).then((stream) => {
                // Stop any existing stream so we can request media with different constraints based on user input
                stream.getTracks().forEach((track) => track.stop());
            }).catch(error => {
                reject(error);
            });
            const video = document.getElementById("video");
            const parent = document.getElementById(options.parent);
            if (!video) {
                const videoElement = document.createElement("video");
                videoElement.id = "video";
                videoElement.setAttribute("class", options.className || "");
                // Don't flip video feed if camera is rear facing
                if (options.position !== 'rear') {
                    videoElement.setAttribute("style", "-webkit-transform: scaleX(-1); transform: scaleX(-1);");
                }
                const userAgent = navigator.userAgent.toLowerCase();
                const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
                // Safari on iOS needs to have the autoplay, muted and playsinline attributes set for video.play() to be successful
                // Without these attributes videoElement.play() will throw a NotAllowedError
                // https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari
                if (isSafari) {
                    videoElement.setAttribute('autoplay', 'true');
                    videoElement.setAttribute('muted', 'true');
                    videoElement.setAttribute('playsinline', 'true');
                }
                parent.appendChild(videoElement);
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const constraints = {
                        video: true,
                    };
                    if (options.position === 'rear') {
                        constraints.video = { facingMode: 'environment' };
                        this.isBackCamera = true;
                    }
                    else {
                        this.isBackCamera = false;
                    }
                    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                        //video.src = window.URL.createObjectURL(stream);
                        videoElement.srcObject = stream;
                        videoElement.play();
                        resolve({});
                    }, (err) => {
                        reject(err);
                    });
                }
            }
            else {
                reject({ message: "camera already started" });
            }
        });
    }
    async stop() {
        const video = document.getElementById("video");
        if (video) {
            video.pause();
            const st = video.srcObject;
            const tracks = st.getTracks();
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                track.stop();
            }
            video.remove();
        }
    }
    async capture(_options) {
        return new Promise((resolve, _) => {
            const video = document.getElementById("video");
            const canvas = document.createElement("canvas");
            // video.width = video.offsetWidth;
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // flip horizontally back camera isn't used
            if (!this.isBackCamera) {
                context.translate(video.videoWidth, 0);
                context.scale(-1, 1);
            }
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            resolve({
                value: canvas
                    .toDataURL("image/png")
                    .replace("data:image/png;base64,", ""),
            });
        });
    }
    async captureSample(_options) {
        return this.capture(_options);
    }
    async getSupportedFlashModes() {
        throw new Error('getSupportedFlashModes not supported under the web platform');
    }
    async setFlashMode(_options) {
        throw new Error('setFlashMode not supported under the web platform');
    }
    async flip() {
        throw new Error('flip not supported under the web platform');
    }
}
const CameraPreview = new CameraPreviewWeb();
core.registerWebPlugin(CameraPreview);

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CameraPreviewWeb: CameraPreviewWeb,
    CameraPreview: CameraPreview
});

const Http = core.registerPlugin('CameraPere', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.CameraPreviewWeb()),
});

exports.CameraPreview = CameraPreview;
exports.CameraPreviewWeb = CameraPreviewWeb;
exports.Http = Http;
//# sourceMappingURL=plugin.cjs.js.map
