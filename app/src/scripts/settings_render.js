const { app, ipcRenderer } = require('electron');
const { appConfig, updateSetting } = require('./settings');
const remote = require('electron').remote;

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
        ipcRenderer.send('openWindow', { 
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            fileUrl: fileUrl
            });
        });
}

function log(event, message) {
    ipcRenderer.send('log', event, message);
}


const start_maximized = document.getElementById('start-maximized');
start_maximized.addEventListener("click", event => { updateSetting('startMaximized', start_maximized.checked) });

const enable_splash = document.getElementById('enable-splash');
enable_splash.addEventListener("click", event => { updateSetting('enableSplash', enable_splash.checked) });

const faster_splash = document.getElementById('faster-splash');
faster_splash.addEventListener("click", event => { updateSetting('fasterSplash', faster_splash.checked) });

const enable_discord = document.getElementById('enable-discord');
enable_discord.addEventListener("click", event => { updateSetting('enableDiscordRichPresence', enable_discord.checked) });

const update_discord = document.getElementById('update-discord');
update_discord.addEventListener("click", event => { updateSetting('updateDiscordRichPresence', update_discord.checked) });

const auto_update = document.getElementById('auto-update');
auto_update.addEventListener("click", event => { updateSetting('autoUpdate', auto_update.checked) });

const store_logs = document.getElementById('store-logs');
store_logs.addEventListener("click", event => { updateSetting('storeLogs', store_logs.checked) });

const game_select = document.getElementById('game-select');
game_select.addEventListener("change", event => { updateSetting('defaultGame', game_select.value) });

const resolutions_select = document.getElementById('resolutions-select');
resolutions_select.addEventListener("change", event => { updateSetting('customResolution', resolutions_select.options[resolutions_select.selectedIndex].text) });

setSettings('start-maximized', appConfig.startMaximized);
setSettings('enable-splash', appConfig.enableSplash);
setSettings('faster-splash', appConfig.fasterSplash);
setSettings('enable-discord', appConfig.enableDiscordRichPresence);
setSettings('update-discord', appConfig.updateDiscordRichPresence);
setSettings('auto-update', appConfig.autoUpdate);
setSettings('store-logs', appConfig.storeLogs);

setSelection('game-select', appConfig.defaultGame);
setSelection('resolutions-select', appConfig.customResolution);
