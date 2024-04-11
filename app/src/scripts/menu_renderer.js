const remote = require('electron').remote;
const { ipcRenderer } = require('electron');


const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

const webview = document.getElementById('game');
const title = document.getElementById('window-title');

// Added check
if (webview) {
webview.addEventListener('dom-ready', () => {
    title.innerHTML = webview.getTitle();
});
}

handleControls();

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleControls() {

    document.getElementById('menu-button').addEventListener("click", event => {
        const menu = document.getElementById('menu');
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    });

    document.getElementById('password-manager-button').addEventListener('click', event => {
    });

    document.getElementById('reload-button').addEventListener("click", event => {
        win.reload();
    });

    
    document.getElementById('support-button').addEventListener("click", event => {
        log('USEREVENT', 'Support button clicked')
        ipcRenderer.send('openWindow', { 
            width: 720,
            height: 520,
            minWidth: 700,
            minHeight: 500,
            fileUrl: 'app/src/views/Discord.html'
            });
        });

    
    document.getElementById('settings-button').addEventListener("click", event => {
        log('USEREVENT', 'Settings button clicked')
        ipcRenderer.send('openWindow', { 
            width: 400,
            height: 560,
            minWidth: 350,
            minHeight: 450,
            fileUrl: 'app/src/views/settings.html'
            });
        });
}

function log(event, message) {
    ipcRenderer.send('log', event, message);
}
