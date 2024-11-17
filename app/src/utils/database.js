const PouchDB = require('pouchdb');
const path = require('path');
const fs = require('fs');

const databasePath = path.join(path.dirname(__dirname), "../../database")

const db = new PouchDB(databasePath);

function newAccount(username, password, account_id, encrypt) {
    db.put({
        _id: account_id,
        username: username,
        password: password,
        encrypt: encrypt
    });
};

function getAccount(account_id) {
    return db.get(account_id)
        .then((account) => {
            return {
                username: account.username,
                password: account.password,
                encrypt: account.encrypt
            };
        });
};

function removeAccount(account_id) {
    db.get(account_id).then(function (account) {
        return db.remove(account);
      });
};


function updateAccount(account_id, username, password, encrypt) {
    db.get(account_id).then((account) => {
            const updatedAccount = { 
                ...account, 
                username: username, 
                password: password,
                encrypt: encrypt
            };
            return db.put(updatedAccount);
        });
};

async function getAllAccounts() {
        const result = await db.allDocs({ include_docs: true });
        if (result.rows && result.rows.length > 0) {
            const accounts = result.rows.map(row => row.doc);
            return accounts;
        } else {
            return [];
        }
};

module.exports = { newAccount, getAllAccounts, getAccount, updateAccount, removeAccount }