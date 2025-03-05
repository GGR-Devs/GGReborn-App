const { app, BrowserWindow } = require("electron");
const path = require("path");

const { Log } = require("./utils/logger");
const { createWindow } = require("./modules/windows");
const { sleep } = require("./utils/sleep");
const { initDiscordRichPresence } = require("./integrations/discord");

function init() {
  Log.Info("App started");
  Log.Debug(`Platform: ${process.platform}`);

  if (process.platform === "linux") {
    app.commandLine.appendSwitch("no-sandbox");
    app.commandLine.appendSwitch("disable-gpu");
  }

  if (!isAsar()) {
    const pluginPaths = {
      win32: path.join(path.dirname(__dirname), "../lib/pepflashplayer.dll"),
      darwin: path.join(
        path.dirname(__dirname),
        "../lib/PepperFlashPlayer.plugin",
      ),
      linux: path.join(path.dirname(__dirname), "../lib/libpepflashplayer.so"),
    };
    const pluginPath = pluginPaths[process.platform];
    app.commandLine.appendSwitch("ppapi-flash-path", pluginPath);
    Log.Debug(`Plugin path: ${pluginPath}`);
  }
}

function isAsar() {
  return __filename.includes(".asar");
}

init();

app.whenReady().then(() => {
  initDiscordRichPresence();

  Log.Info("App is ready!");
  Log.Info("Creating main window...");

  const mainWindow = createWindow(
    {
      width: 1280,
      height: 768,
      minWidth: 500,
      minHeight: 500,
      setResizable: true,
      show: false,
      frame: false,
    },
    {
      plugins: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
    },
  );

  Log.Info("Loading main window in the background...");

  mainWindow.loadURL(
    "file://" + path.join(path.dirname(__dirname), "app/views/main.html"),
  );

  Log.Info("Creating splash window...");

  const splashWindow = createWindow({
    width: 250,
    height: 250,
    minWidth: 250,
    minHeight: 250,
    alwaysOnTop: true,
    transparent: true,
    setResizable: false,
  });

  splashWindow.loadURL(
    "file://" + path.join(path.dirname(__dirname), "app/views/splash.html"),
  );

  Log.Info("Splash window created!");
  splashWindow.show();

  sleep(1500).then(() => {
    mainWindow.show();

    splashWindow.close();
  });
});
