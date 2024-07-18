const { injectAvaliableThemes } = require('./themer');

const { appConfig } = require('./settings');

document.addEventListener('DOMContentLoaded', function() {
    injectAvaliableThemes();
});

document.addEventListener("DOMContentLoaded", function() {
// showInfoBox(`Theme ${themeData.name} loaded!`, {button_id: 'ok_test', button_class: 'ok_test', button_text: 'OK'});
showInfoBox(`Theme ${appConfig.appTheme} loaded!`, {button_id: 'ok_test', button_class: 'ok_test', button_text: 'OK'});
});

function showInfoBox(message, buttonOptions) {
    let info_box_message = document.getElementById("info-box-message");
    let status_bar = document.getElementById("status-bar");
    let info_box = document.getElementById("info-box");

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
    }

    setTimeout(() => {
        status_bar.style.width = '0';
    }, 0);

    setTimeout(() => {
        info_box.style.opacity = '0';
        info_box.style.transform = 'translateY(-50px)';
        setTimeout(() => {
            info_box.style.display = 'none';
        }, 2000);
    }, 5000);
}
