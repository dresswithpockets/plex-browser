#!/usr/bin/env node


const spawn = require('child_process').spawn;
const EventEmitter = require('events').EventEmitter;
const Parser = require('newline-json').Parser;
const { app, BrowserWindow } = require("electron");
const mediakeys = require("mediakeys");

let appWindow;

function createWindow() {
    appWindow = new BrowserWindow({ width: 800, height: 600, title: "Plex Player" });
    appWindow.loadURL("https://app.plex.tv");
    appWindow.webContents.openDevTools();
    appWindow.on("closed", () => { appWindow = null; });
}

function mediaPlayPausePressed() {
    appWindow.webContents.sendInputEvent({
        type: "keyDown",
        keyCode: "Space"
    });
}

function mediaNextPressed() {
    appWindow.webContents.sendInputEvent({
        type: "keyDown",
        modifiers: [ "shift" ],
        keyCode: "Right"
    });
}

function mediaBackPressed() {
    appWindow.webContents.sendInputEvent({
        type: "keyDown",
        modifiers: [ "shift" ],
        keyCode: "Left"
    });
}

function main() {

	var e = mediakeys.listen();
	e.on('connected', function () {
		console.log('connected');
	});
	e.on('play', mediaPlayPausePressed);
	e.on('next', mediaNextPressed);
	e.on('back', mediaBackPressed);

	app.on("ready", createWindow);
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});
	app.on("activate", () => {
		if (appWindow === null) {
			createWindow();
		}
	});
}

if (require.main == module) main();
