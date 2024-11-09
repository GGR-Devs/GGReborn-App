const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

const { injectAvaliableThemes, getThemePreview, getThemeDescription, 
        getThemeName, injectTheme, getThemeFile, removeTheme, importTheme } = require('../utils/themer');
const { appConfig, updateSetting } = require('../utils/settings');
const { showInfoBox } = require('../renderer/renderer');
const { loadLocales, getLocalizedText } = require('../utils/locales');
loadLocales('en-US', ['common', 'messages']);

document.addEventListener('DOMContentLoaded', function () {
    injectAvaliableThemes();
});

document.addEventListener("DOMContentLoaded", function () {
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

    document.getElementById('import-theme-button').addEventListener("click", event => {
        showOpenFileDialog();
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
            <p class="text" id="close-theme-preview" draggable="false" locale="close">Close</p>
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

    document.querySelectorAll('.use-theme-button').forEach(use_theme => {
        use_theme.addEventListener('click', event => {
            themeID = event.currentTarget.id;

            if (appConfig.appTheme != themeID) {
                updateSetting('appTheme', themeID)

                const themeName = getThemeName(themeID);
                const message = getLocalizedText('theme-set');

                showInfoBox(message.replace('{id}', themeName));

                injectTheme(themeID);
                ipcRenderer.send('theme-changed', getThemeFile(themeID));
            };
        });
    });

    document.querySelectorAll('.delete-theme-button').forEach(delete_theme => {
        delete_theme.addEventListener('click', event => {
            themeID = event.currentTarget.id;

            if (themeID == 'default') {
                const message = getLocalizedText('cant-delete-this-theme');
                showInfoBox(message);
            return;
            };

            if (themeID == appConfig.appTheme) {
                const message = getLocalizedText('cant-delete-used-theme');
                showInfoBox(message);
            return;
            };

            let theme_item = document.getElementById(`theme-item-${themeID}`);
            theme_item.className = 'theme-item-destroy';

            const themeName = getThemeName(themeID);
            const message = getLocalizedText('theme-deleted');

            showInfoBox(message.replace('{id}', themeName));

            removeTheme(themeID);
            setTimeout(() => {
                theme_item.remove();
            }, 150);
        });
    });
};

function showOpenFileDialog() {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'Zip',
            extensions: ['zip']
        }]
    }).then(function(file) {
        if (!file.canceled) {
            const extension = file.filePaths[0].split('.').pop().toLowerCase();
            if (extension == 'zip') {
                importTheme(file.filePaths[0]);
            } else {
                showInfoBox('The selected file is not an zip archive.');
                /*setTimeout(() => {
                showOpenFileDialog();
                }, 5000); */
            };
        };
    });
};
