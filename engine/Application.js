import { GLTFLoader } from "../helpers/GLTFLoader.js";
import { FirstPersonController } from '../helpers/FirstPersonController.js';
import { Renderer } from '../helpers/Renderer.js';

export class Application {

    constructor(canvas, glOptions) {
        this._update = this._update.bind(this);

        this.canvas = canvas;
        this._initGL(glOptions);
    }

    async init() {
        await this.start();
        requestAnimationFrame(this._update);
    }

    _initGL(glOptions) {
        this.gl = null;
        try {
            this.gl = this.canvas.getContext('webgl2', glOptions);
        } catch (error) {
        }

        if (!this.gl) {
            console.log('Cannot create WebGL 2.0 context');
        }
    }

    _update() {
        this._resize();
        this.update();
        this.render();
        requestAnimationFrame(this._update);
    }

    _resize() {
        const canvas = this.canvas;
        const gl = this.gl;

        const pixelRatio = window.devicePixelRatio;
        const width = pixelRatio * canvas.clientWidth;
        const height = pixelRatio * canvas.clientHeight;

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

            this.resize();
        }
    }

    async start() {
        // initialization code (including event handler binding)
		this.loader = new GLTFLoader();
        await this.loader.load('../models/gltf/source/scene.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera_Orientation');

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }
        
        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

		console.log(this.camera);

        this.controller = new FirstPersonController(this.camera, this.canvas);
        this.time = performance.now();
        this.startTime = this.time;
        
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
    }

    update() {
        // update code (input, animations, AI ...)
		this.time = performance.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        
        this.controller.update(dt);
    }

    render() {
        // render code (gl API calls)
		if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        // resize code (e.g. update projection matrix)
		const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        const aspectRatio = w / h;

        if (this.camera) {
            this.camera.camera.aspect = aspectRatio;
            this.camera.camera.updateMatrix();
        }
    }
}