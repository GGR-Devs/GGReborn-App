const remote = require('electron').remote;
const { ipcRenderer } = require('electron');

const { injectAvaliableThemes, getThemePreview, getThemeDescription, getThemeName, injectTheme, getThemeFile } = require('./themer');
const { appConfig, updateSetting } = require('./settings');

document.addEventListener('DOMContentLoaded', function() {
    injectAvaliableThemes();
});

document.addEventListener("DOMContentLoaded", function() {
// showInfoBox(`Theme ${themeData.name} loaded!`, {button_id: 'ok_test', button_class: 'ok_test', button_text: 'OK'});
// We can add buttons, but its not useful.
// showInfoBox(`Theme ${appConfig.appTheme} loaded!`);
handleControls();
});

function handleControls() {

    document.getElementById('theme-browser-back').addEventListener("click", event => {
        ipcRenderer.send('openWindow', { 
            width: 400,
            height: 560,
            minWidth: 350,
            minHeight: 450,
            fileUrl: 'app/src/views/settings.html'
            });
        });

    document.querySelectorAll('.theme').forEach(preview => {
        preview.addEventListener('click', event => {
            let blur = document.getElementById("blur");
            let theme_preview_window = document.getElementById("theme-preview-window");

            themeID = event.currentTarget.id;

            theme_preview_src = getThemePreview(themeID);
            theme_description = getThemeDescription(themeID);

            theme_preview_window.innerHTML = 
            `
            <div id="theme-preview-window" draggable="false">
            <img id="theme-preview" src="${theme_preview_src}" draggable="false">
            <p class="text" id="theme-preview-long-description" draggable="false">${theme_description}</p>
            <p class="text" id="close-theme-preview" draggable="false">Close</p>
            </div>
            `;

            blur.style.display = 'block';
            theme_preview_window.style.display = 'block';
        });
    });

    document.addEventListener("click", event => {
        if (event.target.id === 'blur' || event.target.id === 'close-theme-preview') {
            let blur = document.getElementById("blur");
            let theme_preview_window = document.getElementById("theme-preview-window");

            blur.style.display = 'none';
            theme_preview_window.style.display = 'none';
        }
    });

    document.querySelectorAll('.use-theme-button').forEach(preview => {
        preview.addEventListener('click', event => {
            themeID = event.currentTarget.id;

            if (appConfig.appTheme != themeID) {
            updateSetting('appTheme', themeID)

            showInfoBox(`App theme set to: ${getThemeName(themeID)}`);

            injectTheme(themeID);
            ipcRenderer.send('theme-changed', getThemeFile(themeID));
            };
        });
    });
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
}
