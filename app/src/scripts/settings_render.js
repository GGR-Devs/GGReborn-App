const { app } = require('electron');
const { appConfig } = require('./settings');

handleControls();

function setSettings(settingId, value) {
    const setting = document.getElementById(settingId);
    if (setting) {
        setting.checked = value;
    }
}

function setSelection(selectionId, value) {
    const selection = document.getElementById(selectionId);
    if (selection) {
        for (let i = 0; i <= selection.options.length; i++) {
            if (selection.options[i].text.toLowerCase() === value.toLowerCase()) {
                selection.selectedIndex = i;
                break;
            }
        }
    }
}

function handleControls() {
    document.getElementById('change-theme-button').addEventListener("click", event => {
        checkGeneratedThemeBrowserFile();
        ipcRenderer.send('openWindow', { 
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            fileUrl: fileUrl
            });
        });
}

setSettings('start-maximized', appConfig.startMaximized);
setSettings('enable-splash', appConfig.enableSplash);
setSettings('faster-splash', appConfig.fasterSplash);
setSettings('enable-discord', appConfig.enableDiscordRichPresence);
setSettings('update-discord', appConfig.updateDiscordRichPresence);
setSettings('auto-update', appConfig.autoUpdate);
setSettings('store-logs', appConfig.storeLogs);

setSelection('game-select', appConfig.defaultGame);
setSelection('resolutions-select', appConfig.customResolution);
