const RPC = require("discord-rpc");
const rpcClient = new RPC.Client({ transport: "ipc" });
const { Log } = require("../utils/logger");

const states = {
  cafe: {
    in: "Café",
    lobby: "Marketplace",
    logo: "ggcafelogo",
    APPLICATION_ID: "1137886441234518076",
  },
  disco: {
    in: "Club",
    lobby: "Lounge",
    logo: "ggdiscologo",
    APPLICATION_ID: "1258521418350596146",
  },
  fashion: {
    in: "Fashion",
    lobby: "Lounge",
    logo: "ggfashionlogo",
    APPLICATION_ID: "",
  },
};
