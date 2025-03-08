const { getGameServerStatus, getGameServerPlayers } = require("./api");
const { appConfig } = require("../utils/settings");
const { Log } = require("../utils/logger");

function checkConnection() {
  return navigator.onLine;
}

const launcherProperties = {
  isOnline: checkConnection(),
  selectedGame: appConfig.favGame,
  selectedMenu: "games",
  newsCategory: "All",
  gameFocus: false,
  isPlaying: false,
  currentGame: null,
  isEventAdded: false,
  isTimerStarted: false,
};

const Stars = {
  addToFav: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" id="add-to-fav">
      <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
  </svg>`,

  removeFromFav: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" id="remove-from-fav">
      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
  </svg>`,
};

function init() {
  handleNavbarControls();
  handleGamesMenuControls();
  handleNewsMenuControls();
  handleWindowTitlebarHover();

  switchNavbarMenu(launcherProperties.selectedMenu);
  addEventListeners();
}

function addEventListeners() {
  const play_button = document.getElementById("play-button");
  play_button.addEventListener("click", () => {
    if (launcherProperties.currentGame == launcherProperties.selectedGame) {
      exitGame();
    } else {
      if (launcherProperties.isPlaying) {
        exitGame();
      }
      playGame(launcherProperties.selectedGame);
    }
  });
}

const ServerStatuses = {
  0: "Offline",
  1: "Online",
  2: "Maintenance",
};

init();

function handleNavbarControls() {
  const navs = document.querySelectorAll("#navbar .text");

  navs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navs.forEach((t) => t.classList.remove("selected-tab"));
      tab.classList.add("selected-tab");

      const menu = tab.id.split("-")[1];

      switch (menu) {
        case "games":
          if (tab.className.includes("selected-tab")) {
            switchNavbarMenu(menu);
          } else {
            games_menu.style.display = "none";
            launcherProperties.selectedMenu = "";
          }
          break;
        case "news":
          if (tab.className.includes("selected-tab")) {
            switchNavbarMenu(menu);
          } else {
            news_menu.style.display = "none";
            launcherProperties.selectedMenu = "";
          }
          break;
        case "guides":
          if (tab.className.includes("selected-tab")) {
            switchNavbarMenu(menu);
          } else {
            guides_menu.style.display = "none";
            launcherProperties.selectedMenu = "";
          }
          break;
        case "about":
          if (tab.className.includes("selected-tab")) {
            switchNavbarMenu(menu);
          } else {
            about_menu.style.display = "none";
            launcherProperties.selectedMenu = "";
          }
          break;
      }
    });
  });
}

function addToFav() {
  const game_add_to_fav = document.getElementById("game-add-to-fav");

  const add_to_fav = document.getElementById("add-to-fav");
  if (add_to_fav) {
    add_to_fav.addEventListener("click", () => {
      game_add_to_fav.innerHTML = Stars.removeFromFav;
      removeFromFav();
    });
  }
}

function removeFromFav() {
  const game_add_to_fav = document.getElementById("game-add-to-fav");

  const remove_from_fav = document.getElementById("remove-from-fav");
  if (remove_from_fav) {
    remove_from_fav.addEventListener("click", () => {
      game_add_to_fav.innerHTML = Stars.addToFav;
      addToFav();
    });
  }
}

function handleGamesMenuControls() {
  const game_item = document.querySelectorAll(".game-item");

  game_item.forEach((game) => {
    game.addEventListener("click", () => {
      game_item.forEach((btn) => btn.classList.remove("selected-game"));
      game.classList.add("selected-game");

      const gameName = game.id.split("-")[0];

      const game_background_container = document.getElementById(
        "game-background-container",
      );

      if (
        gameName != launcherProperties.selectedGame &&
        !launcherProperties.gameFocus
      ) {
        switchGame(gameName);

        game_background_container.style.display = "flex";
      } else {
        game_background_container.style.display = "none";

        const game_item = document.getElementById(`${gameName}-game`);
        game_item.classList.remove("selected-game");

        if (launcherProperties.isPlaying) {
          // LAZY!!!
          // Its just hides the navbar + menu
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
  const play_button = document.getElementById("play-button");

  const play_text = document.getElementById("play-text");
  const offline_text = document.getElementById("offline-text");
  const exit_text = document.getElementById("exit-text");

  game_item.classList.add("selected-game");

  let serverStatus = ServerStatuses[0];

  if (!launcherProperties.isOnline) {
    play_text.style.display = "none";
    offline_text.style.display = "flex";

    play_button.classList.remove("enabled");
    play_button.classList.add("disabled");

    play_button.title = "Active internet connection is required to play.";
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
    game_add_to_fav.innerHTML = Stars.removeFromFav;
  } else {
    game_add_to_fav.innerHTML = Stars.addToFav;
  }

  server_status.innerText = ServerStatuses[serverStatus];
  server_status.className = `text ${ServerStatuses[serverStatus]}`;
  server_players.innerText = getGameServerPlayers(gameName);

  if (serverStatus == 0 || serverStatus == 2) {
    const play_text = document.getElementById("play-text");
    const offline_text = document.getElementById("offline-text");

    play_text.style.display = "none";
    offline_text.style.display = "flex";

    play_button.classList.remove("enabled");
    play_button.classList.add("disabled");

    play_button.title = "Server is unavailable. Try again later.";
  } else {
    if (launcherProperties.currentGame == gameName) {
      play_text.style.display = "none";
      exit_text.style.display = "flex";

      play_button.classList.add("exit");
    } else {
      play_text.style.display = "flex";
      exit_text.style.display = "none";

      play_button.classList.remove("exit");
    }
  }

  addToFav();
  removeFromFav();
}

function switchNavbarMenu(menu) {
  const games_menu = document.getElementById("games-menu");
  const news_menu = document.getElementById("news-menu");
  const guides_menu = document.getElementById("guides-menu");
  const about_menu = document.getElementById("about-menu");

  const game_background_container = document.getElementById(
    "game-background-container",
  );

  const selected_tab = document.getElementById(`navbar-${menu}`);

  selected_tab.classList.add("selected-tab");

  launcherProperties.gameFocus = false;
  launcherProperties.selectedMenu = menu;

  switch (menu) {
    case "games": {
      games_menu.style.display = "flex";
      games_menu.className = "";
      news_menu.style.display = "none";
      guides_menu.style.display = "none";
      about_menu.style.display = "none";

      game_background_container.style.display = "flex";

      switchGame(launcherProperties.selectedGame);
      break;
    }
    case "news": {
      games_menu.style.display = "none";
      news_menu.style.display = "flex";
      guides_menu.style.display = "none";
      about_menu.style.display = "none";

      game_background_container.style.display = "none";
      break;
    }
    case "guides": {
      games_menu.style.display = "none";
      news_menu.style.display = "none";
      guides_menu.style.display = "flex";
      about_menu.style.display = "none";

      game_background_container.style.display = "none";
      break;
    }
    case "about": {
      games_menu.style.display = "none";
      news_menu.style.display = "none";
      guides_menu.style.display = "none";
      about_menu.style.display = "flex";

      game_background_container.style.display = "none";
      break;
    }
  }
}

function playGame(gameName) {
  const navbar = document.getElementById("navbar");
  const games_menu = document.getElementById("games-menu");

  navbar.className = "navbar-hide";
  games_menu.className = "games-menu-hide";

  launcherProperties.gameFocus = true;

  const game_background_container = document.getElementById(
    "game-background-container",
  );

  game_background_container.style.display = "none";

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
  }
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
  const news_item = document.querySelectorAll(".news-item");

  news_item.forEach((category) => {
    category.addEventListener("click", () => {
      news_item.forEach((btn) => btn.classList.remove("selected-news"));
      category.classList.add("selected-news");

      const selected_category = category.id.split("-")[0];
    });
  });
}

function handleWindowTitlebarHover() {
  const titlebar = document.getElementById("titlebar-hover-area");
  const navbar = document.getElementById("navbar");

  // TODO: NEED BUG FIXES
  titlebar.addEventListener("mousemove", checkHover);
  navbar.addEventListener("mousemove", checkHover);
  titlebar.addEventListener("mouseleave", handleMouseLeave);
  navbar.addEventListener("mouseleave", handleMouseLeave);

  const isHover = (e) => e?.parentElement?.querySelector(":hover") === e;

  // TODO: NEED BUG FIXES
  function checkHover() {
    if (
      !launcherProperties.gameFocus &&
      !launcherProperties.isEventAdded &&
      !launcherProperties.isTimerStarted
    ) {
      return;
    }
    launcherProperties.isEventAdded = true;
    const titlebarHovered = isHover(titlebar);
    const navbarHovered = isHover(navbar);

    if (titlebarHovered || navbarHovered) {
      navbar.classList.remove("navbar-hide");
      navbar.classList.add("navbar-show");
    }
  }

  // TODO: NEED BUG FIXES
  function handleMouseLeave() {
    if (
      !launcherProperties.gameFocus ||
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
            if (!navbarHovered && !titlebarHovered) {
              if (launcherProperties.gameFocus) {
                Log.Debug("GAME FOCUS TRUE");
                clearInterval(checkMouseLeave);

                navbar.classList.remove("navbar-show");
                navbar.classList.add("navbar-hide");
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
              Log.Debug(launcherProperties.gameFocus);
              return;
            }
          }, 3000);
        } else {
          return;
        }
      }, 1);
    }
  }
}

function switchNews(category) {}
