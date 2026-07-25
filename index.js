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

bot.launch().then(() => {

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🤖 ${config.BOT_NAME}`);
    console.log("✅ Bot Started Successfully");
    console.log(`👑 Admin ID: ${config.ADMIN_ID}`);
    console.log(`📢 Channel ID: ${config.CHANNEL_ID}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

});

/* =========================================
   STOP BOT
========================================= */

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

/* =========================================
   ERROR HANDLER
========================================= */

bot.catch((err, ctx) => {

    console.error("Bot Error:", err);

});
