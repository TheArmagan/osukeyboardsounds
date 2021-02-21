const { app, BrowserWindow, Tray, Notification } = require('electron');
const path = require('path');
const globalUserInput = require("globaluserinput");
const express = require("express");
const expressApp = express();
const { ipcMain } = require("electron");
const AutoLaunch = require('auto-launch');

expressApp.listen(8434);
expressApp.use(express.static(path.resolve(__dirname, "public")));

if (require('electron-squirrel-startup')) {
  app.quit();
}


let autoStart = new AutoLaunch({
  name: "Osu! Keyboard Sounds",
  isHidden: true
});

/** @type {Tray} */
let tray = null;
/** @type {BrowserWindow} */
let audioWindow = null;
/** @type {BrowserWindow} */
let settingsWindow = null;
app.on('ready', () => {
  audioWindow = new BrowserWindow({
    width: 1,
    height: 1,
    x: 0,
    y: 0,
    title: "Osu! Keyboard Sounds - Audio",
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      autoplayPolicy: "no-user-gesture-required",
      contextIsolation: false
    }
  });

  audioWindow.loadURL("http://127.0.0.1:8434/audio.html");
  audioWindow.hide();

  settingsWindow = new BrowserWindow({
    width: 260,
    height: 360,
    x: 0,
    y: 0,
    title: "Osu! Keyboard Sounds - Settings",
    resizable: false,
    frame: false,
    darkTheme: true,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      autoplayPolicy: "no-user-gesture-required",
      contextIsolation: false
    }
  });

  ipcMain.on("settings", async (_, cfg) => {
    audioWindow.webContents.send("settings", cfg);

    if (cfg.hasOwnProperty("autoStart")) {
      let isEnabled = await autoStart.isEnabled();
      if (cfg.autoStart != isEnabled) {
        if (cfg.autoStart) {
          await autoStart.enable();
          showNotification("Auto start activated!", true);
        } else {
          await autoStart.disable();
          showNotification("Auto start deactivated!", true);
        }
      }
    }
  });

  ipcMain.on("quit", () => {
    app.quit();
  })

  settingsWindow.loadURL("http://127.0.0.1:8434/settings.html");
  settingsWindow.hide();

  tray = new Tray(path.resolve(__dirname, "icon.ico"))
  tray.setToolTip("Osu! Keyboard Sounds");
  tray.on("right-click", (event, bounds) => {
    settingsWindow.setPosition(bounds.x - settingsWindow.getSize()[0], bounds.y - settingsWindow.getSize()[1], false);
    if (settingsWindow.isVisible()) {
      settingsWindow.hide();
    } else {
      settingsWindow.show();
    }
  })
  settingsWindow.on("blur", () => {
    settingsWindow.hide();
  })

  globalUserInput.on("keyboard:keydown", ({ key }) => {
    audioWindow.webContents.send("keydown", key);
  })
  globalUserInput.listen();

  showNotification("Hey I am at application tray!", true);
});

function showNotification(body = "", silent = false, timeout = 3500) {
  let notification = new Notification({
    title: "Osu! Keyboard Sounds",
    body,
    silent,
    timeoutType: 'default'
  });

  notification.show();

  setTimeout(() => {
    notification.close()
    notification = 0;
  }, timeout);
}