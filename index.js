const { Telegraf } = require("telegraf");
const config = require("./config");

const { registerStart } = require("./start");
const { registerRequest } = require("./request");
const { registerChannel } = require("./channel");
const { registerNotification } = require("./notification");
const { registerAdmin } = require("./admin");

const bot = new Telegraf(config.BOT_TOKEN);

/* =========================================
   REGISTER MODULES
========================================= */

registerStart(bot);

registerRequest(bot);

registerChannel(bot);

registerNotification(bot);

registerAdmin(bot);

/* =========================================
   BOT START
========================================= */

bot.launch(() => {

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🤖 Trading Request Bot");
    console.log("✅ Bot Online");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

});

/* =========================================
   STOP BOT
========================================= */

process.once("SIGINT", () => bot.stop("SIGINT"));

process.once("SIGTERM", () => bot.stop("SIGTERM"));
