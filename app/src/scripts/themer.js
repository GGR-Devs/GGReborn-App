const fs = require('fs');
const path = require('path');
const JSZip = require("jszip");
const { ipcRenderer } = require('electron');

const appPath = path.join(__dirname, '../../../')
const assetsPath = path.join(__dirname, '../assets/');
const themesPath = path.join(__dirname, '../../themes/');
const themesConfig = require('../../themes/themes.json');
const themes = themesConfig.themes || [];

function loadThemes() {
    themes.forEach(theme => {
        const themePath = path.join(themesPath, theme.id + '/' + theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            /*console.log('Theme details:');
            console.log('Name:', themeData.name);
            console.log('ID:', themeData.id);
            console.log('Description:', themeData.description);
            console.log('Long Description:', themeData['long-description']);
            console.log('Author:', themeData.author);
            console.log('Created:', themeData.created);
            console.log('Modified:', themeData.modified);
            console.log('Theme Path:', themeData.themepath);
            console.log('Thumbnail:', themeData.thumbnail);*/
        }
    });
};

function importTheme(zipPath) {
    console.log('Importing a theme from: ' + zipPath);

    fs.readFile(zipPath, function(er, data) {
        if (er) {
            console.error(er);
            return;
        };

        console.log('Path found!');
        JSZip.loadAsync(data).then(function(zip) {
            const promises = [];

            Object.keys(zip.files).forEach(function(filename) {
                const file = zip.files[filename];
                const filePath = path.join(themesPath, filename);

                if (file.dir) {
                    fs.mkdirSync(filePath, {
                        recursive: true
                    });
                } else {
                    promises.push(
                        file.async('nodebuffer').then(content => {
                            const dir = path.dirname(filePath);
                            fs.mkdirSync(dir, {
                                recursive: true
                            });
                            fs.writeFileSync(filePath, content);
                        })
                    );
                };
            });

            return Promise.all(promises);
        })
    });
};

//importTheme(appPath + "test.zip");

function removeTheme(themeID) {
    const filePath = path.join(themesPath, 'themes.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const themeJSON = JSON.parse(data);

    const index = themeJSON.themes.findIndex(theme => theme.id === themeID);

    const theme = themeJSON.themes[index];
    const themePath = path.join(themesPath, theme.id + '/');

    if (fs.existsSync(themePath)) {
        fs.rmdirSync(themePath, { recursive: true, force: true });
        // alert(`Deleted: ${themePath}`);
    } else {
        // alert(`Not exist: ${themePath}`);
        return;
    };

    themeJSON.themes.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(themeJSON, null, 2), 'utf-8');
};

function injectTheme(wantedThemeID) {
    const active_theme = document.getElementById('active-theme');
    let theme_loaded = false;

    themes.forEach(theme => {
        const themePath = path.join(themesPath + wantedThemeID + '/' + theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            if (theme.id == wantedThemeID) {
                active_theme.href = themesPath + themeData.id + '/' + themeData.theme_file;
                //alert('Theme loaded! ' + wantedThemeID)
                theme_loaded = true;
            };
        };
    }
    );

    if (!theme_loaded) {
        alert('Cant load theme: ' + wantedThemeID + '\nUsing the default theme');
        active_theme.href = themesPath + 'default/theme.css';
    }
};

function injectAvaliableThemes() {
    const themes_list = document.getElementById('themes-list');

    themes.forEach(theme => {
        const themePath = path.join(themesPath + theme.id + '/' + theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            const theme_item = document.createElement('div');
            theme_item.id = `theme-item-${themeData.id}`;
            theme_item.className = 'theme-item';

            theme_item.innerHTML =
                `
                <div id="${themeData.id}" title="Click to zoom in" draggable="false" class="theme">
                <img class="theme-thumbnail" src="${themesPath + themeData.id + '/' + themeData.thumbnail}" style="width: 200px; height: 150px;" draggable="false">
                <img class="preview" src="../assets/buttons/preview.png" draggable="false">
                </div>
                <p class="theme-name">${themeData.name}</p>
                <p class="theme-description">${themeData.description}</p>
                <p class="theme-author">Author: ${themeData.author}</p>
                <p class="theme-modified">Modified: ${themeData.modified}</p>
                <div id="theme-buttons">
                    <button class="use-theme-button" id="${themeData.id}">Use</button>
                    <button class="edit-theme-button">Edit</button>
                    <button class="delete-theme-button" id="${themeData.id}">Delete</button>
                </div>
                `;
            themes_list.appendChild(theme_item);
        };
    });
};

function getThemePreview(wantedThemeID) {
    for (const theme of themes) {
        const themePath = path.join(themesPath, wantedThemeID, theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            if (theme.id == wantedThemeID) {
                if (fs.existsSync(themesPath + theme.id + '/' + themeData.thumbnail)) {
                    return `${themesPath + themeData.id + '/' + themeData.thumbnail}`;
                };
            };
        };
    };
    return `${assetsPath + 'preview-missing.png'}`;
}

function getThemeDescription(wantedThemeID) {
    for (const theme of themes) {
        const themePath = path.join(themesPath, wantedThemeID, theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            if (theme.id == wantedThemeID) {
                return themeData['long-description'] || themeData.description;
            };
        };
    };
}

function getThemeName(wantedThemeID) {
    for (const theme of themes) {
        const themePath = path.join(themesPath, wantedThemeID, theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            if (theme.id == wantedThemeID) {
                return themeData.name;
            };
        };
    };
}

function getThemeFile(wantedThemeID) {
    for (const theme of themes) {
        const themePath = path.join(themesPath, wantedThemeID, theme.config);

        if (fs.existsSync(themePath)) {
            const themeConfig = fs.readFileSync(themePath, 'utf-8');
            const themeData = JSON.parse(themeConfig);
            if (theme.id == wantedThemeID) {
                return `${themesPath + themeData.id + '/' + themeData.theme_file}`;
            };
        };
    };
}

module.exports = { loadThemes, injectTheme, injectAvaliableThemes, getThemePreview, getThemeDescription, getThemeName, getThemeFile, removeTheme };
