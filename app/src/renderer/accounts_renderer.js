const { ipcRenderer } = require('electron');

const { showInfoBox } = require('../renderer/renderer');

handleControls();

function handleControls() {
    document.getElementById('add-account-button').addEventListener('click', event => {
        addNewAccount();
    });
}

function addNewAccount() {
    let isAccountUpdate = document.getElementById("account-update");

    if (!isAccountUpdate) {
    let accounts_list = document.getElementById("accounts-list");

    const account_item = document.createElement('div');
    account_item.className = 'account-item';
    account_item.id = 'account-update';
    account_item.draggable = false;

    account_item.innerHTML = `
        <p class="text">Username</p>
        <input type="text" id="account-username">
        <p class="text">Password</lapbel>
        <div class="password-container">
            <input type="password" id="account-password">
            <button type="button" class="reveal-button">Show</button>
        </div>
        <div class="checkbox-container">
            <input type="checkbox" id="encrypt-password">
            <label for="encrypt-password">Encrypt</label>
        </div>
        <div class="button-container">
            <button id="cancel-button">Cancel</button>
            <button id="save-button">Save</button>
        </div>
    `;

    accounts_list.appendChild(account_item);

    document.getElementById('cancel-button').addEventListener('click', event => {
        cancelAccountUpdate();
    });

    document.getElementById('save-button').addEventListener('click', event => {
        saveAccount();
    });

    };
};

function cancelAccountUpdate() {
    const accountUpdate = document.getElementById("account-update");
    accountUpdate.remove();
};

function saveAccount() {
    const account_username = document.getElementById("account-username");
    const username_len = account_username.value.length;

    if (username_len <= 0) {
        showInfoBox("Username cannot be empty.");
    };
};