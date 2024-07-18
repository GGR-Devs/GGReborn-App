const fs = require('fs');
const path = require('path');

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
        }});
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
                theme_item.id = 'theme-item'

                theme_item.innerHTML = 
                `
                <div id="theme-${theme.id}" title="Hold or click to see the preview" draggable="false" class="theme">
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
                    <button class="delete-theme-button">Delete</button>
                </div>
                `;
                themes_list.appendChild(theme_item);
        };
    });
};

function getThemePreview(wantedThemeID) {

}

module.exports = { loadThemes, injectTheme, injectAvaliableThemes, getThemePreview };
