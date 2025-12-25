/* Not really need this, but I want to keep the code clean */
const { Log } = require("../utils/logger");

const { BrowserWindow } = require("electron/main");

function createWindow(windowOptions, webPreferences) {
  const {
    width,
    height,
    minWidth,
    minHeight,
    frame,
    show,
    alwaysOnTop,
    transparent,
    setResizable,
  } = windowOptions;

  const { plugins, nodeIntegration, enableRemoteModule, webviewTag } =
    webPreferences || {};

  const window = new BrowserWindow({
    width,
    height,
    minWidth,
    minHeight,
    frame,
    show,
    alwaysOnTop,
    transparent,
    setResizable,
    webPreferences: {
      nodeIntegration,
      enableRemoteModule,
      webviewTag,
    },
  });

  window.setResizable(setResizable);

  return window;
}

module.exports = { createWindow };
