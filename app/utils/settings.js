const resolutions = {
  // 4:3
  R800x600: "800x600",
  R960x720: "960x720",
  R1024x768: "1024x768",
  R1152x864: "1152x864",
  R1280x960: "1280x960",
  R1440x1050: "1440x1050",
  R1440x1080: "1440x1080",
  R1600x1200: "1600x1200",
  R1856x1392: "1856x1392",
  R1920x1440: "1920x1440",

  // 16:9
  R854x480: "854x480",
  R960x540: "960x540",
  R1024x576: "1024x576",
  R1280x768: "1280x768",
  R1366x768: "1366x768",
  R1600x900: "1600x900",
  R1920x1080: "1920x1080",
  R2560x1440: "2560x1440",
  R3200x1800: "3200x1800",
  R3840x2160: "3840x2160",
};

// default
const appConfig = {
  startMaximized: false, // Always maximize the main (game) window
  enableSplash: true, //Splash screen duration: 5s. The game loads in the background
  fasterSplash: false, // Splash screen duration: 2.5s
  customResolution: resolutions.R1280x768, // Set a custom app windowed resolution
  appTheme: "default", // Use custom themes
  favGame: "cafe",
  enableDiscordRichPresence: true, // Enable Discord rich presence
  checkForUpdates: true, // On launch the app checks the latest version. If the current version is different, the user can update the app
  autoUpdate: false, // Auto update the app, if there's a new version without asking the user
  renderEngine: "flash", // Set the engine to render the game ('flash' or 'ruffle'). Ruffle have some issues, already contacted a developer about the issues.
  language: "en-US", // App language
  key: "", // This API key allows the app to access our API.
  // Note: This API key has limitations and cannot be used to retrieve other information from the API.
  // It is reserved only for the app.
};

module.exports = { appConfig };
