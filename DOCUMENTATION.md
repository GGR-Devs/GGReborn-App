# **App Usage Basics**

#### **Window Controls**
- **Move the Window:**  
  Click and hold the top of the window to move it around the screen.
  
- **Maximize the Window:**  
  Double click the title bar to maximize the window.

---

#### **Menu Navigation**
- **Open the Menu:**  
  Click the **menu icon** (three horizontal lines) located in the top left corner of the app to access the menu.

---

#### **Quick Access Buttons**
- **Play Games:**  
  In the **Discover** section, click on any game to play.

- **Homepage:**  
  Click the **house icon** to go directly to the homepage of our website.

- **News:**  
  Click the **list icon** to view the latest news updates.

- **Refresh Page:**  
  Click the **arrow icon** to refresh the current page.

---

#### **Account and Settings**
- **Account Manager:**  
  Click the **lock icon** to open the account manager, where you can save your ingame username and passwords.

- **Settings:**  
  Click the **three vertical dots icon** to access app settings.

- **Support:**  
  Click the **help icon** to get help.


## Dependencies

- `electron`
- `electron-builder`
- `electron-updater`
- `jszip`
- `crypto-js`
- `pouchdb`

See in the: [package.json](https://github.com/GGR-Devs/GGReborn-App/blob/b7442ce6e4d80dc77401cd5e5840d5fdefe38cc0/package.json#L85)

## Functions and Methods

### `createSplash()`
Creates and displays a splash screen at startup.

### `createMain()`
Creates and displays the main app window.

### `createUpdate()`
Creates and displays the update window when an update is available.

### `createChildWindow(windowOptions)`
Creates a child window with specified options.
The args needed:
- width
- height
- minWidth
- minHeight
- fileUrl

### `log(level, message)`
Logs a message with a log level.

## AutoUpdater Configuration

The `autoUpdater` is configured to:
- **autoDownload**: Disabled (`false`), meaning updates are not downloaded automatically.
- **autoInstallOnAppQuit**: Enabled (`true`), which installs updates when the app is closed.
- **autoRunAppAfterInstall**: Enabled (`true`), which re-launches the app after the update is installed. (not works).

## App Configuration

The `appConfig` object, imported from `../src/utils/settings`, provides settings for the application. The available settings are:

- **Start maximized**: Always maximize the main (game) window.
- **Enable splash screen**: Splash screen duration: 5s. The game loads in the background.
- **Faster splash screen**: Splash screen duration: 2.5s.
- **Custom window resolution**: Set a custom app windowed resolution.
- **App theme**: Use custom themes.
- **Default game**: Loads this game on launch.
- **Discord Rich Presence**: Enable rich presence.
- **Update Discord Rich Presence**: Update realtime the rich presence.
- **Check for updates**: On launch the app checks the latest version. If the current version is different, the user can update the app.
- **Auto-update**: Auto update the app, if there's a new version without asking the user.
- **Render engine**: Set the engine to render the game ('flash' or 'ruffle').
- **Language**: App language.

## Window Management

The app manages the following windows:
- **Splash Window** (`splashWin`): An window shown at startup.
- **Main Window** (`mainWin`): The main app window.
- **Update Window** (`updateWin`): Displays when an update is available.
- **Child Window** (`childWindow`): Child windows used to create new windows.

## IPC Handlers

The app listens for IPC events:

- **`loadGame`**: Loads the game in the main window.
- **`downloadUpdate`**: Triggers the update download process.
- **`openWindow`**: Opens a new child window.
- **`theme-changed`**: Sends theme change notifications to the main window.
- **`resizeMainWindow`**: Resizes and repositions the main window.
- **`log`**: Logs messages with a log level.

## Structure

| **Path**                 | **Description**                        |
|--------------------------|----------------------------------------|
| [`main.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/main.js)               | Main entry point                       |
| [`app/src/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src)               | Main source directory                  |
| [`assets/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/assets)                | Static assets                          |
| ├─ [`buttons/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/assets/buttons)            | Button design images                   |
| ├─ [`fonts/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/assets/fonts)              | App fonts                              |
| ├─ [`layout/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/assets/layout)             | Layout designs, titlebar image         |
| └─ [`progress_bar/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/assets/progress_bar)        | Progress bar assets for updater        |
| [`integrations/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/integrations)          | External integrations                  |
| └─ [`discord.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/integrations/discord.js)          | Discord integration for status updates |
| [`locales/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/locales)               | Translation files                      |
| └─ [`en-US/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/locales/en-US)          | Language-specific translation files    |
| [`renderer/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/renderer)              | Backend renderers                      |
| [`styles/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/styles)                | Global styles (without colors)         |
| [`utils/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/utils)                 | Utility modules                        |
| ├─ [`database.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/utils/database.js)         | Database tool                          |
| ├─ [`encrypter.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/utils/encrypter.js)        | Encryption tool                        |
| ├─ [`locales.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/utils/locales.js)          | Localization tool                      |
| ├─ [`settings.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/utils/settings.js)         | Configuration settings                 |
| └─ [`themer.js`](https://github.com/GGR-Devs/GGReborn-App/blob/main/app/src/utils/themer.js)           | Core theme loader                      |
| [`views/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/src/views)                | Frontend views                         |
| [`themes/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/themes)               | Theme files                            |
| └─ [`default/`](https://github.com/GGR-Devs/GGReborn-App/tree/main/app/themes/default)             | Available theme                       |
