const { ipcRenderer } = require('electron');

const updateStatus = {
    isDownloading: false,
    isDownloaded: false,
    isInstalling: false
}

let downloadProgress = -1;
let nextPreload = 0

const update_found = document.getElementById('update-found');
const update_downloading = document.getElementById('update-downloading');
const update_downloaded = document.getElementById('update-downloaded');

init();

function init() {
    handleControls();
};

function handleControls() {

    document.getElementById('update-download-now').addEventListener('click', event => {
        update_found.style.display = 'none';
        update_downloading.style.display = 'block';
        downloadingAnim();
        ipcRenderer.send("downloadUpdate")
    });

    document.getElementById('update-download-later').addEventListener('click', event => {
        window.close();
    });
}

function downloadingAnim() {
    const progress_bar_preload_0 = document.getElementById('progress-bar-preload-0');
    const progress_bar_preload_1 = document.getElementById('progress-bar-preload-1');
    const progress_bar_preload_2 = document.getElementById('progress-bar-preload-2');
    const progress_bar_preload_3 = document.getElementById('progress-bar-preload-3');
    setInterval(function(){
        switch (downloadProgress) {
            case 0:
                progress_bar_preload_0.style.display = 'block';
                progress_bar_preload_0.src = '../assets/progress_bar/' + `${nextPreload % 5}` + '.png';
                break;
            
            case 1:
                progress_bar_preload_1.style.display = 'block';
                progress_bar_preload_1.src = '../assets/progress_bar/' + `${(nextPreload + 1) % 5}` + '.png';
                break;
            
            case 2:
                progress_bar_preload_2.style.display = 'block';
                progress_bar_preload_2.src = '../assets/progress_bar/' + `${(nextPreload + 2) % 5}` + '.png';
                break;
    
            case 3:
                progress_bar_preload_3.style.display = 'block';
                progress_bar_preload_3.src = '../assets/progress_bar/' + `${(nextPreload + 3) % 5}` + '.png';
                break;

            case 4:
                break;
    
            default:
                progress_bar_preload_0.style.display = 'none';
                progress_bar_preload_1.style.display = 'none';
                progress_bar_preload_2.style.display = 'none';
                progress_bar_preload_3.style.display = 'none';
                downloadProgress = -1;
                nextPreload += 1;
                break;
        }
        downloadProgress += 1;
    }, 500);
}

function updateDownloaded() {
    update_downloading.style.display = 'none';
    update_downloaded.style.display = 'block';
}

module.exports = { updateDownloaded }
