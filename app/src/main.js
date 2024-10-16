const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron');
const { autoUpdater } = require("electron-updater")
const path = require("path");

autoUpdater.autoDownload = false // If auto update set to true -> set to true
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoRunAppAfterInstall = true
autoUpdater.auto

const { appConfig } = require('../src/scripts/settings');

//const { updateStatus } = require('./scripts/updater')
const { initDiscordRichPresence, removeDiscordRichPresence } = require('../src/integrations/discord');
const { loadThemes } = require('../src/scripts/themer');

loadThemes();

const childWindowState = {
  isClosed: true,
  fileUrl: ''
};

let splashWin;
let mainWin;
let childWindow;
let updateWin;

log('INFO', 'App started');
log('INFO', `Platform: ${process.platform}`)

log('INFO', '----------APP CONFIG----------');
for (const key in appConfig) {
    if (Object.hasOwnProperty.call(appConfig, key)) {
        log('INFO', `${key}: ${appConfig[key]}`);
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
            if (appConfig.startMaximized) {
                mainWin.maximize();
            };
        }, 5000);
    } else {
        log('INFO', 'Splash screen duration: 2500ms');
        setTimeout(() => {
            splashWin.close();
            log('INFO', 'Splash screen closed');
            mainWin.show();
            log('INFO', 'Main window show');
            mainWin.focus();
            if (appConfig.startMaximized) {
                mainWin.maximize();
            };
        }, 2500);
    }
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

    mainWin.loadURL("file://" + path.join(path.dirname(__dirname), "src/views/game.html"));

    log('INFO', 'Main window loaded!');
}

function createUpdate() {
    log('INFO', 'Creating update window');
    updateWin = new BrowserWindow({
        width: 870,
        height: 600,
        minWidth: 870,
        minHeight: 600,
        fileUrl: 'app/src/views/update.html',
        frame: false,
        show: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true
        },
    });

    updateWin.loadURL("file://" + path.join(path.dirname(__dirname), "src/views/update.html"));

    log('INFO', 'Update window loaded!');

    updateWin.on('close', () => {
        updateWin.close;
        updateWin = null;
        log('INFO', 'Update window closed')
    });
}


app.whenReady().then(() => {
    if (appConfig.enableDiscordRichPresence) {
        initDiscordRichPresence();
    }

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
            if (appConfig.startMaximized) {
                mainWin.maximize();
            };
        }, 200);
    };

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    if (appConfig.checkUpdates) {
        log('INFO', 'Checking for updates');
        autoUpdater.checkForUpdates();

        autoUpdater.on('update-available', () => {
            createUpdate();
            updateWin.once('ready-to-show', () => {
                log('INFO', 'Update window ready to show')
                updateWin.show();
            });
        });

        if (appConfig.autoUpdate) {
            // autoUpdater.downloadUpdate();
            // NOT DONE YET
        }
}

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        log('INFO', 'App closed');
    }
});

ipcMain.on('downloadUpdate', (event) => {
    autoUpdater.downloadUpdate();

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox(
            null, {
                buttons: ['Install now', 'Later'],
                title: 'App update',
                message: 'Update downloaded!',
                detail: 'Close the app now, to apply the update?',
            }
        ).then(data => {
            switch (data.response) {
                case 0:
                    log('INFO', 'User choosed to install it now');
                    app.quit();
                    break;
                case 1:
                    log('INFO', 'User choosed to install it later');
                    updateWin.close();
                    break;
            };
        });
    });
});

function createChildWindow(windowOptions) {
    const {
        width,
        height,
        minWidth,
        minHeight,
        fileUrl
    } = windowOptions;
    const mainWinBounds = mainWin.getBounds();
    const display = screen.getDisplayNearestPoint({
        x: mainWinBounds.x,
        y: mainWinBounds.y
    });

    if (!childWindow) {
        log('INFO', 'Creating a new child window to load: ' + fileUrl)

        childWindow = new BrowserWindow({
            width: width,
            height: height,
            minWidth: minWidth,
            minHeight: minHeight,
            parent: mainWin,
            // modal: true, Window flicker when closing the child
            // https://github.com/electron/electron/issues/10616
            autoHideMenuBar: false,
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

        childWindowState.fileUrl = fileUrl

        childWindow.once('ready-to-show', () => {
            log('INFO', 'Child window ready to show')
            childWindow.show();
        });

        childWindow.on('close', () => {
            childWindowState.isClosed = true;
            childWindowState.fileUrl = '';
            log('INFO', 'Child window closed')
            childWindow = null;
        });
    } else if (childWindowState.fileUrl != fileUrl) {
        // !! LAZY
        childWindow.close();
        childWindow = null;
        createChildWindow(windowOptions);
    } else {
        log('INFO', 'Showing the opened child window');
        childWindow.focus();
    }
};


ipcMain.on('openWindow', (event, windowOptions) => {
    createChildWindow(windowOptions);
});

ipcMain.on('theme-changed', (event, themePath) => {
    mainWin.webContents.send('theme-changed', themePath);
});

ipcMain.on('update-discord-changed', (event, enabled) => {
    if (enabled) {
        initDiscordRichPresence();
    } else if (!enabled) {
        removeDiscordRichPresence();
    };
});

ipcMain.on('show-info-box', (event, message) => {
    childWindow.webContents.send('show-info-box', message);
});


ipcMain.on('log', (event, level, message) => {
    log(level, message)
});

function log(level, message) {
    console.log(`[${level}] ${message}`);
};
