// 4:3
const resolutions = {
    a: '640x480',
    b: '800x600',
    c: '960x720',
    d: '1024x768',
    e: '1152x864',
    f: '1280x960',
    g: '1440x1050',
    h: '1440x1080',
    i: '1600x1200',
    j: '1856x1392',
    k: '1920x1440'
}

// default
const appConfig = {
    startMaximized: false, // Always maximize the main (game) window
    enableSplash: true,  //Splash screen duration: 5s. The game loads in the background
    fasterSplash: false, // Splash screen duration: 2.5s
    customResolution: resolutions.b, // Set a custom app windowed resolution
    appTheme: 'default', // Use custom themes
    defaultGame: 'Cafe', // Loads this game on launch
    enableDiscordRichPresence: true, // Enable rich presence
    updateDiscordRichPresence: true, // Update realtime the rich presence
    autoUpdate: true, // On launch the app checks the latest version. If the current version is different, the app will update
    storeLogs: false, // Enable this to store logs
}