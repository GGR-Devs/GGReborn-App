const fs = require('fs');
const path = require('path');
const { appConfig } = require('./settings');
const { Log } = require('./logger');

let currentLocale = {};

function loadLocale() {
    const lang = appConfig.language || 'en-US'; // For now, default to English
    const localePath = path.join(__dirname, '../../locales', lang, 'common.locale');

    try {
        if (fs.existsSync(localePath)) {
            const data = fs.readFileSync(localePath, 'utf8');
            const lines = data.split('\n');

            lines.forEach(line => {
                const trimmedLine = line.trim();
                // Skip comments and empty lines
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const parts = trimmedLine.split('=');
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        // Handle cases where value might contain '='
                        const value = parts.slice(1).join('=').trim();
                        currentLocale[key] = value;
                    }
                }
            });
            Log.Info(`Loaded locale: ${lang}`);
        } else {
            Log.Error(`Locale file not found: ${localePath}`);
        }
    } catch (err) {
        Log.Error(`Failed to load locale file: ${localePath}`, err);
    }
}

function getLocale(key) {
    return currentLocale[key] || key;
}

function applyTranslations() {
    loadLocale();
    const elements = document.querySelectorAll('[locale]');
    elements.forEach(element => {
        const key = element.getAttribute('locale');
        if (currentLocale[key]) {
            // Apply to title if the element supports it/has it
            if (element.hasAttribute('title')) {
                element.title = currentLocale[key];
            }

            // Apply to text content for text elements
            // We target elements with 'text' class or generic text wrappers like SPAN, P, etc.
            // But we must be careful not to overwrite HTML structure (like images) unless intended.
            // In main.html, text elements usually have class="text" or are inside specific IDs.
            if (element.classList.contains('text') || ['SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LABEL', 'BUTTON'].includes(element.tagName)) {
                // Check if it has children that are not text nodes. If so, be careful.
                // But for now, assuming standard usage in this app:
                if (element.children.length === 0) {
                    element.innerText = currentLocale[key];
                }
            }
        }
    });
}

module.exports = { loadLocale, getLocale, applyTranslations };
