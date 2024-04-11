const RPC = require('discord-rpc');
const rpcClient = new RPC.Client({ transport: 'ipc' });
const APPLICATION_ID = '1137886441234518076';
RPC.register(APPLICATION_ID);

function onRpcReady() {
    rpcClient.setActivity({
        state: "in the Café",
        details: "Goodgame Café Reborn",
        startTimestamp: Date.now(),
        largeImageKey: "ggcafelogo",
        instance: true,
    });
}

function initDiscordRichPresence() {
    rpcClient.on('ready', onRpcReady);
    rpcClient.login({
        clientId: APPLICATION_ID
    }).catch(console.error);
}

module.exports = { initDiscordRichPresence }
