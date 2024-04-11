let start_maximized = document.getElementById('start-maximized');
let enable_splash = document.getElementById('enable-splash');
let fast_splash = document.getElementById('faster-splash');
let enable_discord = document.getElementById('enable-discord');
let update_discord = document.getElementById('update-discord');
let auto_update = document.getElementById('auto-update');
let enable_logs = document.getElementById('enable-logs');

handleControls();

function setSettings(switchId, enabled) {
    const switchElement = document.getElementById(switchId);
    if (switchElement) {
        switchElement.checked = enabled;
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
    
    
    start_maximized.addEventListener("click", event => {
    });

    enable_splash.addEventListener("click", event => {

    });

    fast_splash.addEventListener("click", event => {

    });

    enable_discord.addEventListener("click", event => {

    });

    update_discord.addEventListener("click", event => {
        appConfig.updateDiscordRichPresence = update_discord.checked;
        saveConfig();
    });

    enable_error_logs.addEventListener("click", event => {

    });
    
}

setSettings('start-maximized', true);

setSettings('enable-splash', true);
