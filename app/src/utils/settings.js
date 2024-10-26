const { app, dialog, ipcRenderer } = require('electron');
const remote = require('electron').remote;
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const { initDiscordRichPresence, removeDiscordRichPresence } = require('../integrations/discord')

const resolutions = {
    // 4:3
    R800x600: '800x600',
    R960x720: '960x720',
    R1024x768: '1024x768',
    R1152x864: '1152x864',
    R1280x960: '1280x960',
    R1440x1050: '1440x1050',
    R1440x1080: '1440x1080',
    R1600x1200: '1600x1200',
    R1856x1392: '1856x1392',
    R1920x1440: '1920x1440',

    // 16:9
    R854x480: '854x480',
    R960x540: '960x540',
    R1024x576: '1024x576',
    R1280x768: '1280x768',
    R1366x768: '1366x768',
    R1600x900: '1600x900',
    R1920x1080: '1920x1080',
    R2560x1440: '2560x1440',
    R3200x1800: '3200x1800',
    R3840x2160: '3840x2160'
};

// default
const appConfig = {
    startMaximized: false, // Always maximize the main (game) window
    enableSplash: true,  //Splash screen duration: 5s. The game loads in the background
    fasterSplash: false, // Splash screen duration: 2.5s
    customResolution: resolutions.R1280x768, // Set a custom app windowed resolution
    appTheme: 'default', // Use custom themes
    defaultGame: 'cafe', // Loads this game on launch
    enableDiscordRichPresence: true, // Enable rich presence
    updateDiscordRichPresence: true, // Update realtime the rich presence
    checkUpdates: true, // On launch the app checks the latest version. If the current version is different, the user can update the app
    autoUpdate: false // Auto update the app, if there's a new version without asking the user
}

const userPath = (electron.app || electron.remote.app).getPath('userData');
const parentDir = path.join(userPath, '..');
var appDir = path.join(parentDir, 'GGRebornApp');
var configFile = path.join(appDir, 'config.json');

function createConfigFile() {
    log('INFO', 'Creating the config file with the default config');
    try {
        const content = {
            'DO NOT MODIFY': ['Please DO NOT modify this file!'],
            settings: [appConfig],
        };

        fs.writeFileSync(configFile, JSON.stringify(content, null, 4));
    } catch (e) {
        log('ERROR', e);
    }
    log('INFO', 'Config file created');
}

// Load the config. If the config not exist, create it.
// If the file was got deleted, use the default.
function loadAppConfig() {
    if (!fs.existsSync(appDir)) {
        log('WARNING', 'App directory not exist, creating it...');
        fs.mkdirSync(appDir, {
            recursive: true
        },
        function(e) {
            if (e) {
                log('ERROR', e);
                return
            };
        });
        log('INFO', 'App directory created');
    }
    log('INFO', 'App directory exist');

    if (!fs.existsSync(configFile)) {
        log('WARNING', 'Cannot load the config because its not exist!');
        createConfigFile();
    }
    else {
    log('INFO', 'Config file exist');
    log('INFO', 'Loading the config from the config file');
    try {
    const config = fs.readFileSync(configFile, 'utf8');
    const settings = JSON.parse(config).settings[0];

    Object.assign(appConfig, settings);
    }
    catch (e) {
        log('ERROR', e)
        log('INFO', 'Got an error, using the default config, and overwriting the existing config file')
        createConfigFile();
    }
    log('INFO', 'Config loaded from the config file');
    }
}

function updateSetting(setting, value) {
    appConfig[setting] = value;

    saveSettings();
}

function saveSettings() {
    try {
        // Create the content to be written to the config file
        const content = {
            'DO NOT MODIFY': ['Please DO NOT modify this file!'],
            settings: [appConfig],
        };

        // Write the content to the config file
        fs.writeFileSync(configFile, JSON.stringify(content, null, 4));

        log('INFO', 'Settings saved successfully.');
    } catch (e) {
        log('ERROR', 'Failed to save settings:', e);
    }
}
function log(level, message) {
    console.log(`[${level}] ${message}`);
}

loadAppConfig();
module.exports = { loadAppConfig, appConfig, resolutions, updateSetting }
