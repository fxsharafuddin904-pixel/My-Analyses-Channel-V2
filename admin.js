const config = require("./config");
const { getAllUsers } = require("./database");

/* =========================================
   ADMIN PANEL
========================================= */

function registerAdmin(bot) {

    // /admin
    bot.command("admin", async (ctx) => {

        if (ctx.from.id != config.ADMIN_ID) return;

        const users = getAllUsers();

        const total = users.length;

        const approved =
            users.filter(x => x.approved).length;

        const pending =
            users.filter(
                x => x.requested && !x.approved
            ).length;

        const joined =
            users.filter(x => x.joined).length;

        const rejected =
            users.filter(
                x => x.requested && !x.approved
            ).length;

        await ctx.reply(

`👑 <b>Admin Panel</b>

━━━━━━━━━━━━━━━━━━

👥 Total Users
<b>${total}</b>

✅ Approved Users
<b>${approved}</b>

📩 Pending Requests
<b>${pending}</b>

📢 Joined Channel
<b>${joined}</b>

❌ Rejected
<b>${rejected}</b>

━━━━━━━━━━━━━━━━━━

⚙️ Bot Status : Online ✅`,

            {
                parse_mode: "HTML"
            }

        );

    });

    /* ==========================
       BROADCAST
    ========================== */

    bot.command("broadcast", async (ctx) => {

        if (ctx.from.id != config.ADMIN_ID) return;

        const text = ctx.message.text.replace(
            "/broadcast",
            ""
        ).trim();

        if (!text) {

            return ctx.reply(

"ব্যবহার:\n\n/broadcast আপনার মেসেজ"

            );

        }

        const users = getAllUsers();

        let sent = 0;

        for (const user of users) {

            try {

                await ctx.telegram.sendMessage(

                    user.id,

                    `📢 <b>Admin Message</b>

━━━━━━━━━━━━━━━━━━

${text}`,

                    {
                        parse_mode: "HTML"
                    }

                );

                sent++;

            } catch (e) {}

        }

        ctx.reply(

`✅ Broadcast Complete

📨 Sent : ${sent}`

        );

    });

}

module.exports = {

    registerAdmin

};
