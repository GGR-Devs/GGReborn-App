const RPC = require('discord-rpc');
const rpcClient = new RPC.Client({ transport: 'ipc' });

// This should be moved to the game files!!!
// For now, we can keep this in here, but we need to connect the game and the app,
// then we can set that what we're receiving from the game.
// Like we will send: in the Café, instead of setting it from here, because users,
// can modify it, and can change it to something else.
const states = {
    cafe: {
        in: 'Café',
        lounge: 'Marketplace',
        logo: 'ggcafelogo',
        APPLICATION_ID: '1137886441234518076'
    },
    disco: {
        in: 'Club',
        lounge: 'Lounge',
        logo: 'ggdiscologo',
        APPLICATION_ID: '1258521418350596146'
    },
    fashion: {
        in: 'Fashion',
        lounge: 'Lounge',
        logo: 'ggfashionlogo',
        APPLICATION_ID: ''
    }
};

const games = {
    cafe: 'Café',
    disco: 'Disco',
    fashion: 'Fashion'
};

const content = {
    currentGame: 'cafe',
    visiting: false,
    inEditor: false
};



function onRpcReady() {
    let state = `in the ${states[content.currentGame].in}`;
    if (content.visiting) {
        state = `Visiting other players ${states[content.currentGame].in}`;
    };
    if (content.inEditor) {
        state = `Decorating the ${states[content.currentGame].in}`;
    }
    rpcClient.setActivity({
        state: state,
        details: `Goodgame ${games[content.currentGame]} Reborn`,
        startTimestamp: Date.now(),
        largeImageKey: states[content.currentGame].logo,
        instance: true,
        buttons: [{label: "Play now!", url: "https://github.com/GGR-Devs/GGReborn-App"}],
    });
}

function initDiscordRichPresence() {
    rpcClient.on('ready', onRpcReady);
    RPC.register(states[content.currentGame].APPLICATION_ID);
    rpcClient.login({
        clientId: states[content.currentGame].APPLICATION_ID
    }).catch(console.error);
}

function removeDiscordRichPresence() {
    rpcClient.clearActivity();
}

module.exports = { initDiscordRichPresence, removeDiscordRichPresence }
