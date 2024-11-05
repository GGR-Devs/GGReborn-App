const PouchDB = require('pouchdb');
const path = require('path');
const fs = require('fs');

const databasePath = path.join(path.dirname(__dirname), "../../database")

const db = new PouchDB(databasePath);

function newAccount(username, password) {
    return db.put({
        _id: Date.now().toString(),
        username: username,
        password: password
    });
}

function removeAccount(username) {

}


function updateAccount(username) {

}

async function getAllAccounts() {
        const result = await db.allDocs({ include_docs: true });
        if (result.rows && result.rows.length > 0) {
            const accounts = result.rows.map(row => row.doc);
            return accounts;
        } else {
            return [];
        }
};

module.exports = { newAccount, getAllAccounts }