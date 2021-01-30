const { app, BrowserWindow, Menu, Tray, Notification } = require('electron');
const path = require('path');
const globalUserInput = require("globaluserinput");
const express = require("express");
const expressApp = express();

expressApp.listen(8434);
expressApp.use(express.static(path.resolve(__dirname, "public")));

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {
  let isActive = true;

  function setIsActive(status) {
    isActive = status;
    mainWindow.webContents.send("isActive", status);
    return status;
  }

  const mainWindow = new BrowserWindow({
    width: 1,
    height: 1,
    x: 0,
    y: 0,
    title: "Osu Keyboard Sounds",
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      autoplayPolicy: "no-user-gesture-required"
    }
  });

  mainWindow.loadURL("http://127.0.0.1:8434");
  mainWindow.hide();

  const tray = new Tray(path.resolve(__dirname, "icon.ico"))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Osu Keyboard Sounds"
    },
    {
      type: "separator"
    },
    {
      label: "Is Active",
      click(menuItem) {
        setIsActive(menuItem.checked);
        showNotification(`Sounds are ${menuItem.checked ? "enabled" : "disabled"}!`, true);
      },
      type: "checkbox",
      checked: isActive
    },
    {
      type: "separator"
    },
    {
      label: "Exit",
      type: "normal",
      role: "quit"
    }
  ])
  tray.setToolTip("Osu Keyboard Sounds");
  tray.setContextMenu(contextMenu);

  globalUserInput.events.on("data", (eventData) => {
    if (eventData.event == "keyboardStateChange" && eventData.keyState == "Down") {
      mainWindow.webContents.send("keydown", eventData.keyCode);
    }

  })
  globalUserInput.listen();

  showNotification("Hey i am at application tray!");
});

app.on('window-all-closed', () => {
  app.quit();
});

function showNotification(body = "", silent = false, timeout = 3500) {
  let notification = new Notification({
    title: "Osu Keyboard Sounds",
    body,
    silent,
    timeoutType: "never"
  });

  notification.show();

  setTimeout(() => {
    notification.close()
    notification = 0;
  }, timeout);
}