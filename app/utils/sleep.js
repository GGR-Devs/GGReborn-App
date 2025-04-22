function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sleepUntilFetch() {
  // Fetch data from API while splash.
  // Max wait time 5, after it the app force loads.
  // api etc when our site is done.
  return sleep(1000);
}

module.exports = { sleep, sleepUntilFetch };
