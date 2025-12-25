const resolutions = {
  // 4:3
  // SMALLER RESOLUTION NOT RECOMMENDED!
  R1152x864: "1152x864",
  R1280x960: "1280x960",
  R1440x1050: "1440x1050",
  R1440x1080: "1440x1080",
  R1600x1200: "1600x1200",
  R1856x1392: "1856x1392",
  R1920x1440: "1920x1440",

  // 16:9
  // SMALLER RESOLUTION NOT RECOMMENDED!
  R1280x768: "1280x768",
  R1366x768: "1366x768",
  R1600x900: "1600x900",
  R1920x1080: "1920x1080",
  R2560x1440: "2560x1440",
  R3200x1800: "3200x1800",
  R3840x2160: "3840x2160",
};

const RenderEngines = {
  FLASH: "flash",
  RUFFLE: "ruffle",
};

const guidesLayoutPins = {
  // 1000 BASE NUMBER
  cafeGuidesPinned: [
    1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  ], // ID
  discoGuidesPinned: [
    1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  ], // ID
  fashionGuidesPinned: [
    1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  ], // ID
  maxPins: 10, // Max userpins allowed
};

// default
const appConfig = {
  startMaximized: false, // Always maximize the main (game) window
  enableSplash: true, //Splash screen duration: 5s.
  fasterSplash: false, // Splash screen duration: 2.5s
  customResolution: resolutions.R1280x768, // Set a custom app windowed resolution
  appTheme: "default", // Use custom themes
  favGame: "cafe",
  enableDiscordRichPresence: true, // Enable Discord rich presence
  checkForUpdates: true, // On launch the app checks the latest version. If the current version is different, the user can update the app
  autoUpdate: false, // Auto update the app, if there's a new version without asking the user. I always like to check whats new before updating an app.
  renderEngine: RenderEngines.FLASH, // Set the engine to render the game ('flash' or 'ruffle'). Ruffle have some issues, already contacted a developer about the issues.
  // Some ruffle layer render issues, and sound buffer issues. But its playable.
  language: "en-US", // App language
  key: "", // This API key allows the app to access our API.
  // Note: This API key has limitations and cannot be used to retrieve other information from the API.
  // It is reserved only for the app.
  // Each API key is valid for 30 days. After this period, the app will automatically tries renew it.
  // The API key is not stored in the app config file, and its generated/handled in server side.
  // If you need a custom API key or have any questions, please contact us at bence@ggreborn.net.
  guidesPinned: guidesLayoutPins,
  refreshData: 2, // Update the displayed data in every 2 minutes. (1, 2, 5, 10, 20, 30, 60, never)
  // Refreshing: Online players, server status, guides, news.
};

module.exports = { appConfig };
