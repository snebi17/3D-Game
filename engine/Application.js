import { Renderer } from "../helpers/Renderer.js";
import { Controller } from "../helpers/InputController.js";

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
			this.gl = this.canvas.getContext("webgl2", glOptions);
		} catch (error) {}

		if (!this.gl) {
			console.log("Cannot create WebGL 2.0 context");
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

		console.log(canvas.width, canvas.height);

		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;

			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

			this.resize();
		}
	}

	start() {
		// initialization code (including event handler binding)
		const gl = this.gl;
		this.renderer = new Renderer(gl);

		this.root = new Node();
		this.camera = new Node();

		this.camera.translation = [0, 1, 0];
		this.camera.projection = mat4.create();
		this.root.addChild(this.camera);

		this.floor = new Node();
		this.ceiling = new Node();
		this.walls = [];

		this.controller = new Controller(this.camera, this.canvas);
	}

	update() {
		// update code (input, animations, AI ...)
	}

	render() {
		// render code (gl API calls)
	}

	resize() {
		// resize code (e.g. update projection matrix)
	}
}

const canvas = document.querySelector("screen");
const app = new Application(canvas);
await app.init();
document.querySelector(".loader-container").remove();
