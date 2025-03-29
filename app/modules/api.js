const fs = require("fs");
const path = require("path");

const { appConfig } = require("../utils/settings");

baseUrl = "https://ggreborn.net/api";

function FetchAPI(url) {
  // THE WEBSITE + API IS CURRENTLY IN DEVELOPMENT!
  return null;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        return null;
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        return data.data;
      }
      throw new Error("API error!");
      return null;
    });
}

function getGameServerStatus(gameServer) {
  return 1;
  // API IS NOT YET READY!
  const response = Get(
    `${baseUrl}?game=${gameServer}&fetch=status&source=app&key=${appConfig.key}`,
  );

  if (response.ok) {
    const result = response.json();

    cacheData(gameServer, result.data);
    return result.data.status;
  }

  return 0;

  /*
  0 = OFFLINE
  1 = ONLINE
  2 = MAINTENCE
  */
}

function getGameServerPlayers(gameServer) {
  return 0;
  const response = Get(
    `${baseUrl}?game=${gameServer}&fetch=players&source=app&key=${appConfig.key}`,
  );

  if (response.ok) {
    const result = response.json();

    cacheData(gameServer, result.data);
    return result.data.players;
  }

  return 0;
}

function getAnAppApiKey() {
  return "";
  // This API key allows the app to access our API.
  // Note: This API key has limitations and cannot be used to retrieve other information from the API.
  // It is reserved only for the app.
  const response = FetchAPI(`${baseUrl}?get=key&source=app`);
  if (response.ok) {
    const result = response.json();
    return result.data.key;
  }

  return "";
}

function getSupporters(page, amount) {
  const response = FetchAPI(
    `https://app.buymeacoffee.com/api/creators/slug/ggreborn/coffees?web=1&page=${page}&per_page=${amount}`,
  );

  if (response.ok) {
    const result = response.json();
    return result.data.map((member) => member.supporter_name);
  }
}

function cacheData(game, data) {
  const cacheDir = path.join(__dirname, "storage/cache");

  console.log(cacheDir);

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

module.exports = {
  getGameServerStatus,
  getGameServerPlayers,
  getAnAppApiKey,
  getSupporters,
};
