import { Application } from "./engine/Application.js";

const canvas = document.querySelector("screen");
const app = new Application(canvas);
await app.init();
document.querySelector(".loader-container").remove();
