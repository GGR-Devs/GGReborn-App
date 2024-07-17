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

function inject(wantedThemeID) {
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

module.exports = { loadThemes, inject };
