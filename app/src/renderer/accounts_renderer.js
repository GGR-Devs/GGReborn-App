const { showInfoBox } = require('../renderer/renderer');
const { encrypt, decrypt } = require('../utils/encrypter');
const { newAccount, getAllAccounts, getAccount, updateAccount, removeAccount } = require('../utils/database');
const { getLocalizedText } = require('../utils/locales');

init();

function init() {
    listAccounts();

    handleControls();
};

function handleControls() {
    document.getElementById('add-account-button').addEventListener('click', event => {
        editAccount();
    });

    document.getElementById('accounts-list').addEventListener('click', event => {
        if (event.target.classList.contains('edit-account-button')) {
            const account_id = event.target.id;
            editAccount(account_id);
        }
    });
};

async function listAccounts() {
    const accounts_list = document.getElementById("accounts-list");

    const accounts = await getAllAccounts();

    accounts.sort((a, b) => {
        return parseInt(b._id, 10) - parseInt(a._id, 10);
    });

    accounts.forEach(account => {
        const account_item = document.createElement('div');
        account_item.className = 'account-item';
        account_item.id = `account-container-${account._id}`;

        account_item.innerHTML = `
        <p class="text">${account.username}</p>
        <p class="text">****</p>
        <div class="button-container">
            <button id="${account._id}" class="edit-account-button" locale="edit">${getLocalizedText('edit')}</button>
        </div>
        `

        accounts_list.appendChild(account_item);
    });
};

async function editAccount(account_id) {
    let isAccountEdit = document.getElementById("account-edit");

    // No account ID given on adding new account
    if (!account_id) {
        if (!isAccountEdit) {
            const accounts_list = document.getElementById("accounts-list");

            const account_item = document.createElement('div');
            account_item.className = 'account-item';
            account_item.id = 'account-edit';
            account_item.draggable = false;

            account_item.innerHTML = `
                <p class="text" locale="username">${getLocalizedText('username')}</p>
                <input type="text" id="account-username">
                <p class="text" locale="password">${getLocalizedText('password')}</p>
                <div class="password-container">
                    <input type="password" id="account-password">
                    <button type="button" id="reveal-password-button" locale="show-password">${getLocalizedText('show-password')}</button>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="encrypt-password" checked="true">
                    <label for="encrypt-password" locale="encrypt" class="text">${getLocalizedText('encrypt')}</label>
                </div>
                <div class="button-container">
                    <button id="remove-button" disabled="true" locale="remove">${getLocalizedText('remove')}</button>
                    <button id="cancel-button" locale="cancel">${getLocalizedText('cancel')}</button>
                    <button id="save-button" locale="save">${getLocalizedText('save')}</button>
                </div>
            `;

            accounts_list.insertBefore(account_item, accounts_list.firstChild);
        } else if (isAccountEdit) {
            return;
        };
    } else if (account_id) {
        const account_container = document.getElementById(`account-container-${account_id}`);

        if (!account_container) {
            return;
        }
        else if (account_container) {
            account_container.id = "account-edit";

            const account_data = await getAccount(account_id);

            let password = account_data.password;

            if (account_data.encrypt) {
                password = decrypt(account_data.username, account_data.password);
            };

            const isEncrypt = account_data.encrypt ? 'checked' : '';

            account_container.innerHTML = `
                <p class="text" locale="username">${getLocalizedText('username')}</p>
                <input type="text" id="account-username" value="${account_data.username.trim()}">
                <p class="text" locale="password">${getLocalizedText('password')}</p>
                <div class="password-container">
                    <input type="password" id="account-password" value="${password.trim()}">
                    <button type="button" id="reveal-password-button" locale="show-password">${getLocalizedText('show-password')}</button>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="encrypt-password" ${isEncrypt}>
                    <label for="encrypt-password" locale="encrypt" class="text">${getLocalizedText('encrypt')}</label>
                </div>
                <div class="button-container">
                    <button id="remove-button" locale="remove">${getLocalizedText('remove')}</button>
                    <button id="cancel-button" locale="cancel">${getLocalizedText('cancel')}</button>
                    <button id="save-button" locale="save">${getLocalizedText('save')}</button>
                </div>
            `;
        };
    };

    document.getElementById('cancel-button').addEventListener('click', event => {
        if (!account_id) {
            cancelAccount();
        } else if (account_id) {
            cancelAccount(account_id);
        };
    });

    document.getElementById('save-button').addEventListener('click', event => {
        if (!account_id) {
            saveAccount();
        } else if (account_id) {
            saveAccount(account_id);
        };
    });

    document.getElementById('remove-button').addEventListener('click', event => {
        deleteAccount(account_id);
    });

    const reveal_password_button = document.getElementById('reveal-password-button');

    reveal_password_button.addEventListener('click', event => {
        const account_password = document.getElementById("account-password");

        if (account_password.type === "password") {
            account_password.type = "text";
            reveal_password_button.textContent = getLocalizedText('hide-password');
        } else {
            account_password.type = "password";
            reveal_password_button.textContent = getLocalizedText('show-password');
        };
    });
};

async function deleteAccount(account_id) {

    showInfoBox(getLocalizedText('account-removed'));

    let account_edit = document.getElementById("account-edit");

    account_edit.className = 'account-item-destroy';

    removeAccount(account_id);
    setTimeout(() => {
        account_edit.remove();
    }, 150);
};

async function cancelAccount(account_id) {
    const accountEdit = document.getElementById('account-edit');

    accountEdit.remove();

    if (account_id) {
        const accounts_list = document.getElementById("accounts-list");

        const account_item = document.createElement('div');
        account_item.className = 'account-item';
        account_item.id = `account-container-${account_id}`;

        const account_data = await getAccount(account_id);
    
        account_item.innerHTML = `
        <p class="text">${account_data.username}</p>
        <p class="text">****</p>
        <div class="button-container">
            <button id="${account_id}" class="edit-account-button" locale="edit">${getLocalizedText('edit')}</button>
        </div>
        `
    
        accounts_list.insertBefore(account_item, accounts_list.firstChild);    
    };
};

function saveAccount(account_id) {
    const account_username = document.getElementById('account-username');
    const username_len = account_username.value.length;
    const username = account_username.value;

    const account_password = document.getElementById('account-password');
    const password_len = account_password.value.length;
    let password = account_password.value;

    const encrypt_password = document.getElementById('encrypt-password');
    const isEncrypt = encrypt_password.checked;


    if (username_len <= 0) {
        showInfoBox(getLocalizedText('username-cant-be-empty'));
        return;
    };

    if (password_len <= 0) {
        showInfoBox(getLocalizedText('password-cant-be-empty'));
        return;
    };

    if (isEncrypt) {
        password = encrypt(username, password);
    };

    if (!account_id) {
        account_id = Date.now().toString();
        newAccount(username, password, account_id, isEncrypt);
    } else if (account_id) {
        updateAccount(account_id, username, password, isEncrypt);
    };

    const accountEdit = document.getElementById('account-edit');
    accountEdit.remove();

    const accounts_list = document.getElementById("accounts-list");

    const account_item = document.createElement('div');
    account_item.className = 'account-item';
    account_item.id = `account-container-${account_id}`;

    account_item.innerHTML = `
    <p class="text">${username}</p>
    <p class="text">****</p>
    <div class="button-container">
        <button id="${account_id}" class="edit-account-button" locale="edit">${getLocalizedText('edit')}</button>
    </div>
    `

    accounts_list.insertBefore(account_item, accounts_list.firstChild);
};