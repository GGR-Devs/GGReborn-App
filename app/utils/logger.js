const Log = {
  Info: (message) => log("INFO", message),
  Debug: (message) => log("DEBUG", message),
  Warn: (message) => log("WARN", message),
  Error: (message) => log("ERROR", message),
  Fatal: (message) => log("FATAL", message),
};

function log(level, message) {
  console.log(`[${level}] ${message}`);
}

module.exports = { Log };
