const { getGameServerStatus, getGameServerPlayers } = require("./api");
const { appConfig } = require("../utils/settings");
const { Log } = require("../utils/logger");
const { playMusic, stopMusic, playAnimation } = require("../utils/about");

function checkConnection() {
  return navigator.onLine;
}

const launcherProperties = {
  isOnline: checkConnection(),
  selectedGame: appConfig.favGame,
  selectedMenu: "games",
  newsCategory: "All",
  fullScreenFocus: false,
  isPlaying: false,
  currentGame: null,
  isEventAdded: false,
  isTimerStarted: false,
};

// I'm not really sure if this structure is good, because the long names.
// But at least, everything is here, so I don't need to search it every time.
// Contains: HTML elements, Icons, IDs (names)
const launcherElements = {
  Containers: {
    Games: {
      Container: document.getElementById("games-menu"),
      Background: document.getElementById("game-background-container"),
      GamesList: document.querySelectorAll(".game-item"),
      Game: document.getElementById(`${launcherProperties.currentGame}-game`),
    },
    Guides: {
      Container: document.getElementById("guides-menu"),
    },
    News: {
      Container: document.getElementById("news-menu"),
      NewsList: document.querySelectorAll(".news-item"),
    },
    About: {
      Container: document.getElementById("about-menu"),
    },
    Titlebar: {
      HoverArea: document.getElementById("titlebar-hover-area"),
      Navbar: document.getElementById("navbar"),
      NavbarUtils: document.getElementById("navbar-utils"),
    },
  },
  Menus: {
    Games: {
      ID: "games",
    },
    Guides: {
      ID: "guides",
    },
    News: {
      ID: "news",
    },
    About: {
      ID: "about",
    },
  },
  Buttons: {
    Navbar: document.querySelectorAll("#navbar .text"),
    Play: document.getElementById("play-button"),
    Favourites: {
      _isFilled: false,
      get isFilled() {
        return this._isFilled;
      },
      set isFilled(value) {
        this._isFilled = value;
      },
      Favourite: document.getElementById("game-add-to-fav"),
      get Icon() {
        if (this.isFilled) {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
          </svg>`;
        } else {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
        </svg>`;
        }
      },
    },
  },
};

const isHover = (e) => e?.parentElement?.querySelector(":hover") === e;

function init() {
  // For now its lazy, but I'll add a setting option where the players can change the default tab to load when
  // the app is opened. Like if the players always wants to check the guides or the news tab first, they dont
  // need to always click on it to view it.
  switchNavbarMenu(launcherProperties.selectedMenu);
  addEventListeners();
}

function addEventListeners() {
  handleNavbarControls();
  handleGamesMenuControls();
  handleNewsMenuControls();

  window.addEventListener("online", () => (launcherProperties.isOnline = true));
  window.addEventListener(
    "offline",
    () => (launcherProperties.isOnline = false),
  );

  launcherElements.Buttons.Play.addEventListener("click", () => {
    if (
      launcherProperties.isOnline &&
      getGameServerStatus(launcherProperties.selectedGame) == 1
    ) {
      if (launcherProperties.currentGame === launcherProperties.selectedGame) {
        exitGame();
      } else {
        if (launcherProperties.isPlaying) {
          exitGame();
        }

        hideNavbar();
        hideOthers();
        playGame(launcherProperties.selectedGame);
      }
    } else {
      return;
    }
  });

  launcherElements.Buttons.Favourites.Favourite.addEventListener(
    "click",
    () => {
      if (appConfig.favGame === launcherProperties.selectedGame) {
        launcherElements.Buttons.Favourites.isFilled = false;
        launcherElements.Buttons.Favourites.Favourite.innerHTML =
          launcherElements.Buttons.Favourites.Icon;
      } else {
        launcherElements.Buttons.Favourites.isFilled = true;
        launcherElements.Buttons.Favourites.Favourite.innerHTML =
          launcherElements.Buttons.Favourites.Icon;
      }
    },
  );

  launcherElements.Containers.Titlebar.HoverArea.addEventListener(
    "mousemove",
    checkHover,
  );
  launcherElements.Containers.Titlebar.Navbar.addEventListener(
    "mousemove",
    checkHover,
  );
  launcherElements.Containers.Titlebar.HoverArea.addEventListener(
    "mouseleave",
    handleMouseLeave,
  );
  launcherElements.Containers.Titlebar.Navbar.addEventListener(
    "mouseleave",
    handleMouseLeave,
  );
  launcherElements.Containers.Titlebar.NavbarUtils.addEventListener(
    "mousemove",
    checkHover,
  );
  launcherElements.Containers.Titlebar.NavbarUtils(
    "mouseleave",
    handleMouseLeave,
  );
}

const ServerStatuses = {
  0: "Offline",
  1: "Online",
  2: "Maintenance",
};

init();

function handleNavbarControls() {
  launcherElements.Buttons.Navbar.forEach((tab) => {
    tab.addEventListener("click", () => {
      launcherElements.Buttons.Navbar.forEach((t) =>
        t.classList.remove("selected-tab"),
      );
      tab.classList.add("selected-tab");

      const menu = tab.id.split("-")[1];

      if (launcherProperties.selectedMenu !== menu) {
        switchNavbarMenu(menu);
      }
    });
  });
}

function handleGamesMenuControls() {
  launcherElements.Containers.Games.GamesList.forEach((game) => {
    game.addEventListener("click", () => {
      launcherElements.Containers.Games.GamesList.forEach((btn) =>
        btn.classList.remove("selected-game"),
      );
      game.classList.add("selected-game");

      const gameName = game.id.split("-")[0];

      // Switch games. If the selected game is the same, just hide the game containe
      if (
        gameName != launcherProperties.selectedGame &&
        !launcherProperties.fullScreenFocus
      ) {
        switchGame(gameName);

        launcherElements.Containers.Games.Background.style.display = "flex";
      } else {
        launcherElements.Containers.Games.Background.style.display = "none";

        const game_item = document.getElementById(`${gameName}-game`);
        game_item.classList.remove("selected-game");

        if (launcherProperties.isPlaying) {
          hideNavbar();
          hideOthers();

          // LAZY !!!!
          // It's just changes the focus, and the selected tab.
          // Its just loads the game once, if the game is the same.
          playGame(gameName);
        } else {
          launcherProperties.selectedGame = null;
        }
      }
    });
  });
}

function switchGame(gameName) {
  Log.Info(`Switched to game: ${gameName}`);

  launcherProperties.selectedGame = gameName;

  const game_item = document.getElementById(`${gameName}-game`);
  const game_add_to_fav = document.getElementById("game-add-to-fav");
  const background = document.getElementById("background");
  const game_title_image = document.getElementById("game-title-image");
  const game_title_name = document.getElementById("game-title-name");
  const server_status = document.getElementById("server-status");
  const server_players = document.getElementById("server-players");

  const play_text = document.getElementById("play-text");
  const offline_text = document.getElementById("offline-text");
  const exit_text = document.getElementById("exit-text");

  game_item.classList.add("selected-game");

  let serverStatus = ServerStatuses[0];

  if (!launcherProperties.isOnline) {
    play_text.style.display = "none";
    offline_text.style.display = "flex";

    launcherElements.Buttons.Play.classList.remove("enabled");
    launcherElements.Buttons.Play.classList.add("disabled");

    launcherElements.Buttons.Play.title =
      "Active internet connection is required to play.";
  }

  serverStatus = getGameServerStatus(gameName);

  background.style.backgroundImage = `url("../assets/images/games/backgrounds/${gameName}.jpg")`;
  game_title_image.src = `../assets/images/games/titles/${gameName}.png`;
  game_title_name.innerText = `GoodGame ${
    gameName.toLowerCase() === "cafe"
      ? "Café"
      : gameName.charAt(0).toUpperCase() + gameName.slice(1)
  }`;

  if (appConfig.favGame == launcherProperties.selectedGame) {
    launcherElements.Buttons.Favourites.isFilled = true;
    game_add_to_fav.innerHTML = launcherElements.Buttons.Favourites.Icon;
  } else {
    launcherElements.Buttons.Favourites.isFilled = false;
    game_add_to_fav.innerHTML = launcherElements.Buttons.Favourites.Icon;
  }

  server_status.innerText = ServerStatuses[serverStatus];
  server_status.className = `text ${ServerStatuses[serverStatus]}`;
  server_players.innerText = getGameServerPlayers(gameName);

  if (serverStatus == 0 || serverStatus == 2) {
    const play_text = document.getElementById("play-text");
    const offline_text = document.getElementById("offline-text");

    play_text.style.display = "none";
    offline_text.style.display = "flex";

    launcherElements.Buttons.Play.classList.remove("enabled");
    launcherElements.Buttons.Play.classList.add("disabled");

    launcherElements.Buttons.Play.title =
      "Server is unavailable. Try again later.";
  } else {
    if (launcherProperties.currentGame == gameName) {
      play_text.style.display = "none";
      exit_text.style.display = "flex";

      launcherElements.Buttons.Play.classList.add("exit");
    } else {
      play_text.style.display = "flex";
      exit_text.style.display = "none";

      launcherElements.Buttons.Play.classList.remove("exit");
    }
  }
}

function switchNavbarMenu(menu) {
  const selected_tab = document.getElementById(`navbar-${menu}`);

  selected_tab.classList.add("selected-tab");

  launcherProperties.fullScreenFocus = false;
  launcherProperties.selectedMenu = menu;

  switch (menu) {
    case launcherElements.Menus.Games.ID: {
      launcherElements.Containers.Games.Container.style.display = "flex";
      launcherElements.Containers.Games.Container.className = "";
      launcherElements.Containers.News.Container.style.display = "none";
      launcherElements.Containers.Guides.Container.style.display = "none";
      launcherElements.Containers.About.Container.style.display = "none";

      launcherElements.Containers.Games.Background.style.display = "flex";

      switchGame(launcherProperties.selectedGame);
      break;
    }
    case launcherElements.Menus.News.ID: {
      launcherElements.Containers.Games.Container.style.display = "none";
      launcherElements.Containers.News.Container.style.display = "flex";
      launcherElements.Containers.Guides.Container.style.display = "none";
      launcherElements.Containers.About.Container.style.display = "none";

      launcherElements.Containers.Games.Background.style.display = "none";
      break;
    }
    case launcherElements.Menus.Guides.ID: {
      launcherElements.Containers.Games.Container.style.display = "none";
      launcherElements.Containers.News.Container.style.display = "none";
      launcherElements.Containers.Guides.Container.style.display = "flex";
      launcherElements.Containers.About.Container.style.display = "none";

      launcherElements.Containers.Games.Background.style.display = "none";
      break;
    }
    case launcherElements.Menus.About.ID: {
      launcherElements.Containers.Games.Container.style.display = "none";
      launcherElements.Containers.News.Container.style.display = "none";
      launcherElements.Containers.Guides.Container.style.display = "none";
      launcherElements.Containers.About.Container.style.display = "flex";

      launcherElements.Containers.Games.Background.style.display = "none";

      launcherProperties.fullScreenFocus = true;

      hideNavbar();
      playMusic();
      playAnimation();
      break;
    }
  }
  if (menu != launcherElements.Menus.About.ID) {
    stopMusic();
    let animation_container = document.getElementById("animation-container");
    animation_container.innerHTML = "";

    let project_supporters_container = document.getElementById(
      "project-supporters-container",
    );
    project_supporters_container.innerHTML = "";
  }
}

function hideNavbar() {
  launcherElements.Containers.Titlebar.Navbar.className = "navbar-hide";
  launcherElements.Containers.Titlebar.NavbarUtils.className =
    "navbar-utils-hide";
}

function hideOthers() {
  launcherElements.Containers.Games.Container.className = "games-menu-hide";
}

function playGame(gameName) {
  launcherProperties.fullScreenFocus = true;

  launcherElements.Containers.Games.Background.style.display = "none";

  const selected_tab = document.getElementById(
    `navbar-${launcherProperties.selectedMenu}`,
  );

  selected_tab.classList.remove("selected-tab");

  if (!launcherProperties.isPlaying) {
    // LOAD THE GAME
    launcherProperties.isPlaying = true;
    launcherProperties.currentGame = gameName;

    const game_content = document.getElementById(`content`);

    game_content.src = `https://ggreborn.net/${gameName}`;
    // game_content.src = `https://example.com`;
    //
    const game_item = document.getElementById(`${gameName}-game`);
    game_item.classList.add("active-game");

    Log.Debug(`Loading game: ${launcherProperties.currentGame}`);
  }

  launcherProperties.selectedMenu = null;
  Log.Debug(`Playing game: ${launcherProperties.currentGame}`);
}

function exitGame() {
  const game_item = document.getElementById(
    `${launcherProperties.currentGame}-game`,
  );
  game_item.classList.remove("active-game");

  launcherProperties.isPlaying = false;
  launcherProperties.currentGame = null;

  switchGame(launcherProperties.selectedGame);
}

function handleNewsMenuControls() {
  launcherElements.Containers.News.NewsList.forEach((category) => {
    category.addEventListener("click", () => {
      launcherElements.Containers.News.NewsList.forEach((btn) =>
        btn.classList.remove("selected-news"),
      );
      category.classList.add("selected-news");

      const selected_category = category.id.split("-")[0];
    });
  });
}

function checkHover() {
  if (
    !launcherProperties.fullScreenFocus &&
    !launcherProperties.isEventAdded &&
    !launcherProperties.isTimerStarted
  ) {
    return;
  }
  launcherProperties.isEventAdded = true;
  const titlebarHovered = isHover(titlebar);
  const navbarHovered = isHover(navbar);

  if (titlebarHovered || navbarHovered) {
    launcherElements.Containers.Titlebar.Navbar.classList = "navbar-show";
    launcherElements.Containers.Titlebar.NavbarUtils.classList =
      "navbar-utils-show";
  }
}

function handleMouseLeave() {
  if (
    !launcherProperties.fullScreenFocus ||
    launcherProperties.isTimerStarted ||
    !launcherProperties.isEventAdded
  ) {
    return;
  }

  if (!launcherProperties.isTimerStarted) {
    Log.Debug("ADDING TIMER");
    checkMouseLeave = setInterval(() => {
      if (!launcherProperties.isTimerStarted) {
        launcherProperties.isTimerStarted = true;
        Log.Debug("TIMER STARTED");
        setTimeout(() => {
          const titlebarHovered = isHover(titlebar);
          const navbarHovered = isHover(navbar);
          const navbarUtilsHovered = isHover(navbar_utils);
          if (!navbarHovered && !titlebarHovered && !navbarUtilsHovered) {
            if (launcherProperties.fullScreenFocus) {
              Log.Debug("GAME FOCUS TRUE");
              clearInterval(checkMouseLeave);

              navbar.classList.remove("navbar-show");
              navbar.classList.add("navbar-hide");
              navbar_utils.classList = "navbar-utils-hide";
              launcherProperties.isEventAdded = false;
              launcherProperties.isTimerStarted = false;

              Log.Debug("TIMER ENDED");
            } else {
              clearInterval(checkMouseLeave);
              launcherProperties.isTimerStarted = false;

              Log.Debug("IN GAME FOCUS, NAVBAR REMAINS");
            }
          } else {
            clearInterval(checkMouseLeave);
            launcherProperties.isTimerStarted = false;
            Log.Debug("STILL HOVERING");
            return;
          }
        }, 3000);
      } else {
        return;
      }
    }, 1);
  }
}

function switchNews(category) {}
