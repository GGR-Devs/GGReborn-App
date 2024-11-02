const remote = require('electron').remote;
const {  ipcRenderer } = require('electron');


var db = new PouchDB('accounts');

function getLatestID() {

}


function new_account(username, encrypted) {
    return db.put({
        _id: getLatestID().toString(),
        username: username,
        encrypted: encrypted
    });
}

function remove_account(username) {

}


function update_account(username) {

}