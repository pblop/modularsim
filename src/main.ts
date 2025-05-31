import Controller from "./controller.js";

const controller = new Controller();
controller.initFromUrl();
// @ts-ignore
window.controller = controller;
