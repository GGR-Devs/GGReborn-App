const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron');
const path = require("path");
const settings = require('../src/scripts/settings');

const childWindowState = {
  isClosed: true,
  fileUrl: ''
};

log('INFO', 'App started');
log('INFO', `Platform: ${process.platform}`)
settings.loadAppConfig();

appConfig = settings.appConfig

log('INFO', '----------APP CONFIG----------');
for (const key in appConfig) {
  if (Object.hasOwnProperty.call(appConfig, key)) {
    log('INFO',  `${key}: ${appConfig[key]}`);
  }
}
log('INFO', '----------APP CONFIG----------');
console.log('')

if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");
if (process.platform === "linux") app.commandLine.appendSwitch('disable-gpu');


if (!isAsar()) {
  const pluginPaths = {
      win32: path.join(path.dirname(__dirname), "../lib/pepflashplayer.dll"),
      darwin: path.join(path.dirname(__dirname), "../lib/PepperFlashPlayer.plugin"),
      linux: path.join(path.dirname(__dirname), "../lib/libpepflashplayer.so"),
  };
  const pluginName = pluginPaths[process.platform];
  app.commandLine.appendSwitch("ppapi-flash-path", pluginName);
  log('INFO', `pluginName: ${pluginName}`);
} else {
  const pluginPaths = {
      win32: path.join(path.dirname(__dirname), "../../lib/pepflashplayer.dll"),
      darwin: path.join(path.dirname(__dirname), "../../lib/PepperFlashPlayer.plugin"),
      linux: path.join(path.dirname(__dirname), "../../lib/libpepflashplayer.so"),
  };
  const pluginName = pluginPaths[process.platform];
  app.commandLine.appendSwitch("ppapi-flash-path", pluginName);
  log('INFO', `pluginName: ${pluginName}`);
}

app.commandLine.appendSwitch("ppapi-flash-version", "31.0.0.122");
app.commandLine.appendSwitch("ignore-certificate-errors");

let splashWin;
let mainWin;
let childWindow;

function isAsar() {
  return __filename.includes('.asar');
}

function createSplash() {
  log('INFO', 'Creating splash screen')
  splashWin = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      transparent: true,
      alwaysOnTop: true
  });

  splashWin.loadURL("file://" + path.join(path.dirname(__dirname), "src/views/splash.html"));
  log('INFO', 'Splash screen created!');
  if (!appConfig.fasterSplash) {
      log('INFO', 'Splash screen duration: 5000ms');
      setTimeout(() => {
          splashWin.close();
          log('INFO', 'Splash screen closed');
          mainWin.show();
          log('INFO', 'Main window show');
          mainWin.focus();
      }, 5000);
  } else {
    log('INFO', 'Splash screen duration: 2500ms');
      setTimeout(() => {
          splashWin.close();
          log('INFO', 'Splash screen closed');
          mainWin.show();
          log('INFO', 'Main window show');
          mainWin.focus();
      }, 2500);
  }
}

function isLatest() {
  /*newVersion = '1.2.0';

  if (appConfig.appVersion != newVersion) {
    log('INFO', 'App is not the latest!');
    return false;
  }
  log('INFO', 'App is the latest!');
  */
  return true;

}

function appUpdate() {
  /*
  createUpdate();
  const options = {
    type: 'question',
    buttons: ['Close', 'Continue'],
    defaultId: 2,
    title: 'App update',
    message: 'App updated!',
    detail: 'Please close the app, and launch it again to apply all new updates!'
  };

  log('INFO', 'Starting the update');
  log('INFO', 'Downloading the new version...');
  log('INFO', 'New version downloaded!');
  dialog.showMessageBox(null, options).then(data => {
    console.log(data.response)
    switch (data.response) {
      case 0:
        app.quit();
        break;
      case 1:
        createSplash();
        createMain();
        childWindow.close();
        break;
    }
    });
*/
}

function createMain() {
  log('INFO', 'Creating main window');
  mainWin = new BrowserWindow({
      width: parseInt(appConfig.customResolution.split('x')[0]),
      height: parseInt(appConfig.customResolution.split('x')[1]),
      minWidth: 400,
      minHeight: 400,
      frame: false,
      show: false,
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
        enableRemoteModule: true,
        webviewTag: true
      },
  });

  mainWin.loadURL("file://" + path.join(path.dirname(__dirname), "src/views/" + appConfig.defaultGame + ".html"));

  log('INFO', 'Main window loaded!');
}

function createUpdate() {
  /*log('INFO', 'Creating update window');
  childWindow = new BrowserWindow({
      width: 300,
      height: 350,
      minWidth: 300,
      minHeight: 350,
      frame: false,
      show: false
  });

  childWindow.loadURL("file://" + path.join(path.dirname(__dirname), "src/views/update.html"));

  childWindow.once('ready-to-show', () => {
    log('INFO', 'Update window ready to show')
    childWindow.show();
    });
    */
}

app.whenReady().then(() => {
  if (isLatest()) {
  if (appConfig.enableSplash) {
      log('INFO', 'Splash screen enabled!');
      createSplash();
  }
  createMain();
  if (!appConfig.enableSplash) {
      setTimeout(() => {
          mainWin.show();
          log('INFO', 'Main window show');
          mainWin.focus();
      }, 100);
  }

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
      }
  });
}
else {
  appUpdate();
}
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
      log('INFO', 'App closed');
  }
});

ipcMain.on('openWindow', (event, windowOptions) => {
  const { width, height, minWidth, minHeight, fileUrl } = windowOptions;
  const mainWinBounds = mainWin.getBounds();
  const display = screen.getDisplayNearestPoint({x: mainWinBounds.x, y: mainWinBounds.y})

  if (childWindowState.isClosed) {
    log('INFO', 'Openning a new window')
      childWindow = new BrowserWindow({
          width: width,
          height: height,
          minWidth: minWidth,
          minHeight: minHeight,
          // parent: mainWin,
          // modal: true, Window flicker when closing the child
          // https://github.com/electron/electron/issues/10616
          autoHideMenuBar: true,
          frame: false,
          show: false,
          webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true
          },
      });

      childWindow.loadFile(fileUrl);
      
      const winX = display.bounds.x + (display.bounds.width - width) / 2;
      const winY = display.bounds.y + (display.bounds.height - height) / 2;
      childWindow.setPosition(winX, winY);

      childWindowState.isClosed = false;
      childWindowState.fileUrl = fileUrl;
    }
    else {
      if (childWindowState.fileUrl != fileUrl) {
        childWindowState.fileUrl = fileUrl;

        childWindow.loadFile(fileUrl).then(() => {
          childWindow.setMinimumSize(minWidth, minHeight);
          childWindow.setSize(width, height);

          const primaryDisplay = screen.getPrimaryDisplay().workAreaSize;
          const x = (primaryDisplay.width - childWindow.getSize()[0]) / 2;
          const y = (primaryDisplay.height - childWindow.getSize()[1]) / 2;
          childWindow.setPosition(x, y);

          childWindow.focus();
      });
    
    }
      else {
        log('INFO', 'Showing the opened child window')
        childWindow.focus();
      }
    }

    childWindow.once('ready-to-show', () => {
      log('INFO', 'Child window ready to show')
      childWindow.show();
      });

    childWindow.on('close', () => {
      childWindow = null;
      childWindowState.isClosed = true;
      childWindowState.fileUrl = '';
      log('INFO', 'Child window closed')
    });
  }
);

ipcMain.on('log', (event, level, message) => {
  log(level, message)
});

function log(level, message) {
  console.log(`[${level}] ${message}`);
}