const remote = require('electron').remote;
const { ipcRenderer, app } = require('electron');
const path = require('path');

const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

const webview = document.getElementById('game');
const app_title = document.getElementById('app-title');
const title = document.getElementById('window-title');

const { appConfig } = require('./settings');

const { injectTheme } = require('./themer');

injectTheme(appConfig.appTheme)


window.RufflePlayer = window.RufflePlayer || {};

// Added check
if (webview) {
webview.addEventListener('dom-ready', () => {
    app_title.innerHTML = webview.getTitle();
    title.innerHTML = webview.getTitle();

    const titlebar_image = `../assets/layout/${appConfig.defaultGame}-titlebar.jpg`; // Overwrides when switching games
    document.getElementById("titlebar-image").src = titlebar_image;
});
}

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    // document.getElementById('max-button').addEventListener("click", event => {
    //     win.maximize();
    // });

    // document.getElementById('restore-button').addEventListener("click", event => {
    //     win.unmaximize();
    // });

    document.getElementById('close-button').addEventListener("click", event => {
        ipcRenderer.send('windowClosed')
        win.close();
        log('USEREVENT', 'Window closed');
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    // toggleMaxRestoreButtons();
    // win.on('maximize', toggleMaxRestoreButtons);
    // win.on('unmaximize', toggleMaxRestoreButtons);

    // function toggleMaxRestoreButtons() {
    //     if (win.isMaximized()) {
    //         document.body.classList.add('maximized');
    //     } else {
    //         document.body.classList.remove('maximized');
    //     }
    // }
}

function log(event, message) {
    ipcRenderer.send('log', event, message);
}
