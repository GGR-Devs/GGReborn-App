const { app, ipcRenderer } = require('electron');
const { appConfig, updateSetting } = require('./settings');
const remote = require('electron').remote;
const shell = require('electron').shell; // need to open the links in the OS default browser

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
            fileUrl: 'app/src/views/theme_browser.html'
            });
        });
        
    document.getElementById('github-repo').addEventListener("click", event => {
        event.preventDefault();
        shell.openExternal("https://github.com/GGR-Devs/GGReborn-App");
    });

    document.getElementById('x-social').addEventListener("click", event => {
        event.preventDefault();
        shell.openExternal("https://x.com/GGSCafeReborn");
    });

    document.getElementById('facebook-social').addEventListener("click", event => {
        event.preventDefault();
        shell.openExternal("https://www.facebook.com/GGSCR");
    });

    document.getElementById('buymeacoffee').addEventListener("click", event => {
        event.preventDefault();
        shell.openExternal("https://www.buymeacoffee.com/ggreborn");
    });

    document.getElementById('report-problem-button').addEventListener("click", event => {
        event.preventDefault();
        shell.openExternal("https://github.com/GGR-Devs/GGReborn-App/issues/new/choose");
    })
    
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

const check_updates = document.getElementById('check-updates');
check_updates.addEventListener("click", event => { updateSetting('checkUpdates', check_updates.checked) });

const auto_update = document.getElementById('auto-update');
auto_update.addEventListener("click", event => { updateSetting('autoUpdate', auto_update.checked) });


const game_select = document.getElementById('game-select');
game_select.addEventListener("change", event => { updateSetting('defaultGame', game_select.value) });

const resolutions_select = document.getElementById('resolutions-select');
resolutions_select.addEventListener("change", event => { updateSetting('customResolution', resolutions_select.options[resolutions_select.selectedIndex].text) });

setSettings('start-maximized', appConfig.startMaximized);
setSettings('enable-splash', appConfig.enableSplash);
setSettings('faster-splash', appConfig.fasterSplash);
setSettings('enable-discord', appConfig.enableDiscordRichPresence);
setSettings('update-discord', appConfig.updateDiscordRichPresence);
setSettings('check-updates', appConfig.checkUpdates);
setSettings('auto-update', appConfig.autoUpdate);

setSelection('game-select', appConfig.defaultGame);
setSelection('resolutions-select', appConfig.customResolution);
