const remote = require('electron').remote;
const { ipcRenderer } = require('electron');

const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

const webview = document.getElementById('game');
const app_title = document.getElementById('app-title');
const title = document.getElementById('window-title');

const { appConfig } = require('../utils/settings');
const { injectTheme } = require('../utils/themer');
const { loadLocales, getLocalizedText } = require('../utils/locales');
loadLocales('en-US', ['common', 'menu', 'settings', 'accounts']);

injectTheme(appConfig.appTheme)

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

        document.querySelectorAll('[locale]').forEach(element => {
            const key = element.getAttribute('locale');

            const localizedText = getLocalizedText(key);

            if (element.hasAttribute('title')) {
                element.title = localizedText;
            } else {
                element.textContent = localizedText;
            };
        });
    };
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

function showInfoBox(message, buttonOptions) {
    let info_box_container = document.getElementById("info-box-container");

    document.getElementById('info-box')?.remove();

    let info_box = document.createElement('div');
    info_box.id = 'info-box';
    info_box_container.appendChild(info_box);

    let info_box_message = document.createElement('p');
    info_box_message.className = 'text';
    info_box_message.id = 'info-box-message';
    info_box.appendChild(info_box_message);

    let status_bar_container = document.createElement('div');
    status_bar_container.className = 'status-bar-container';
    info_box.appendChild(status_bar_container);

    let status_bar = document.createElement('div');
    status_bar.id = 'status-bar';
    status_bar_container.appendChild(status_bar);

    status_bar.offsetHeight;

    if (message) {
        info_box_message.innerHTML = message
    };

    if (buttonOptions) {
        const {
            button_id,
            button_class,
            button_text,
        } = buttonOptions;

        const button = document.createElement('button');
        button.id = button_id;
        button.className = button_class;
        button.textContent = button_text;
        info_box.appendChild(button);
    };

    setTimeout(() => {
        status_bar.style.width = '0';
    }, 0);

    setTimeout(() => {
        info_box.style.opacity = '0';
        info_box.style.transform = 'translateY(-50px)';
        setTimeout(() => {
            info_box.style.display = 'none';
            info_box_container.removeChild(info_box);
        }, 2000);
    }, 5000);
};

ipcRenderer.on('theme-changed', (event, themePath) => {
    const active_theme = document.getElementById('active-theme');
    active_theme.href = themePath;
});

ipcRenderer.on('show-info-box', (event, message) => {
    showInfoBox(message);
});

function log(event, message) {
    ipcRenderer.send('log', event, message);
}

module.exports = { showInfoBox }