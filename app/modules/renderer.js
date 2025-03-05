const remote = require("electron").remote;

const win = remote.getCurrentWindow();

function init() {
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
