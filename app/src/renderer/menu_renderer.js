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

const app_version = document.getElementById('app-version');

const version = remote.app.getVersion();

const isAlpha = version.split('.')[0] === '0';

app_version.textContent = isAlpha ? `Preview: ${version}` : `Release: ${version}`;

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

    document.getElementById('reload-button').addEventListener("click", event => {
        win.reload();
    });

    document.getElementById('account-manager-button').addEventListener("click", event => {
        log('USEREVENT', 'Account manager button clicked')
        ipcRenderer.send('openWindow', { 
            width: 600,
            height: 600,
            minWidth: 600,
            minHeight: 600,
            fileUrl: 'app/src/views/accounts.html'
            });
        });

    
    document.getElementById('support-button').addEventListener("click", event => {
        log('USEREVENT', 'Support button clicked')
        ipcRenderer.send('openWindow', { 
            width: 720,
            height: 520,
            minWidth: 700,
            minHeight: 500,
            fileUrl: 'app/src/views/discord.html'
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

    document.getElementById('play-cafe-game-button').addEventListener("click", event => {
        log('USEREVENT', 'Clicked the Café game button')
        ipcRenderer.send('loadGame', 'cafe')
    });

    document.getElementById('play-disco-game-button').addEventListener("click", event => {
        log('USEREVENT', 'Clicked the Disco game button')
        ipcRenderer.send('loadGame', 'disco')
    });

    document.getElementById('play-fashion-game-button').addEventListener("click", event => {
        log('USEREVENT', 'Clicked the Fashion game button')
        ipcRenderer.send('loadGame', 'fashion')
    });
    
    document.getElementById('load-homepage-button').addEventListener("click", event => {
        log('USEREVENT', 'Clicked the homepage button')
        ipcRenderer.send('loadGame', 'website')
    });
}

function log(event, message) {
    ipcRenderer.send('log', event, message);
}
