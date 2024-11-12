const fs = require('fs');
const path = require('path');

const locales = {};

function loadLocales(locale, resources) {
    const baseLocalePath = path.join(__dirname, '../locales');

    resources.forEach(resource => {
        const languageFilePath = path.join(baseLocalePath, `${locale}/${resource}.locale`);

        try {
            const content = fs.readFileSync(languageFilePath, 'utf-8');

            content.split('\n').forEach(line => {
                if (line.trim() && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    const value = valueParts.join('=').trim();
                    locales[key.trim()] = value;
                }
            });

        } catch (e) {
            console.error(`[ERROR] While loading ${resource} for ${locale}: ${e.message}`);
        };
    });
};

function getLocalizedText(key) {
    return locales[key] || key;
};

module.exports = { loadLocales, getLocalizedText };