const remote = require("electron").remote;

const { applyTranslations } = require("../utils/locales");

const win = remote.getCurrentWindow();

function init() {
  applyTranslations();
  handleWindowControls();
}

function handleWindowControls() {
  document.getElementById("min-button").addEventListener("click", (event) => {
    win.minimize();
  });

  document.getElementById("close-button").addEventListener("click", (event) => {
    win.close();
  });
}

init();
