# TODO: UPDATE
# **App Usage Basics**

#### **Window Controls**
- **Move the Window:**
  Click and hold the top of the window to move it around the screen.

- **Maximize the Window:**
  Double click the title bar to maximize the window.

- **Show the Navbar**:
The navbar automatically hides while you're playing.
Hover your cursor at the top of the window to show it.
---

#### **Menu Navigation***
- **Play Games:**
In the **Games** section, click on any game to start playing.

- **Get Game Guides:**
In the **Guides** section, click on a game name to access its guides.

- **Read Game News:**
In the **News** section, click on a game name to read the latest updates and news.
---

#### **Settings and Support**

-   **Settings:**
    Click the **Wrench** icon in top right, to access the app settings.

-   **Support:**
    Click the **Question mark** icon in top right, to access help and support.

## Dependencies

- `electron`
- `electron-builder`
- `electron-updater`

See in the: [package.json](https://github.com/GGR-Devs/GGReborn-App/blob/main/package.json)

## Functions and Methods

### `createSplash()`
Creates and displays a splash screen at startup.

### `createMain()`
Creates and displays the main app window.

### `createUpdate()`
Creates and displays the update window when an update is available.

## AutoUpdater Configuration

The `autoUpdater` is configured to:
- **autoDownload**: Disabled (`false`), meaning updates are not downloaded automatically.
- **autoInstallOnAppQuit**: Enabled (`true`), which installs updates when the app is closed.
- **autoRunAppAfterInstall**: Enabled (`true`), which re-launches the app after the update is installed. (not works).

## App Configuration

The `appConfig` object, imported from `app/utils/settings`, provides settings for the application. The available settings are:

- **Start maximized**: Always maximize the main (game) window.
- **Custom window resolution**: Set a custom app windowed resolution.
- **App theme**: Use custom themes.
- **Favourite game**: Loads this game on launch.
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
