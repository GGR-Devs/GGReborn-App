const fs = require("fs");
const path = require("path");
const remote = require("electron").remote;
const electron = require("electron");

const userPath = (electron.app || electron.remote.app).getPath("userData");
const parentDir = path.join(userPath, "..");
// var appDir = path.join(parentDir, "GGRebornApp");
// var cachesFile = path.join(appDir, "caches.json");

const cacheProperties = {
  guidesCache: {
    latestCached: -1, // TIMESTAMP
  },
  newsCache: {
    latestCached: -1, // TIMESTAMP
  },
  serverAdmins: {
    latestCached: -1, // TIMESTAMP
  },

  cacheStepps: 6, // Do not try to cache everyting at one time.
  retriesBeforeCancelling: 4, // Number of tries before cancelling the caching, and showing network error and retry button.
};
