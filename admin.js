const config = require("./config");
const { getAllUsers, updateUser } = require("./database");

/* =========================================
   ADMIN PANEL
========================================= */

function registerAdmin(bot) {

    /* ==========================
       /admin
    ========================== */

    bot.command("admin", async (ctx) => {

        if (ctx.from.id != config.ADMIN_ID) return;

        const users = getAllUsers();

        const total = users.length;

        const approved = users.filter(x => x.status === "approved").length;
        const pending = users.filter(x => x.status === "pending").length;
        const rejected = users.filter(x => x.status === "rejected").length;
        const joined = users.filter(x => x.joined).length;

        await ctx.reply(
`👑 <b>Admin Panel</b>

━━━━━━━━━━━━━━

👥 Total Users : <b>${total}</b>

✅ Approved : <b>${approved}</b>

📩 Pending : <b>${pending}</b>

❌ Rejected : <b>${rejected}</b>

📢 Joined : <b>${joined}</b>

━━━━━━━━━━━━━━

🤖 Bot Status : Online ✅`,
        {
            parse_mode: "HTML"
        });

    });

    /* ==========================
       /approve USER_ID
    ========================== */

    bot.command("approve", async (ctx) => {

        if (ctx.from.id != config.ADMIN_ID) return;

        const args = ctx.message.text.split(" ");

        if (args.length < 2) {
            return ctx.reply("ব্যবহার:\n\n/approve USER_ID");
        }

        const userId = args[1];

        updateUser(userId, {
            approved: true,
            requested: false,
            status: "approved",
            approvedAt: Date.now()
        });

        try {

            const invite = await ctx.telegram.createChatInviteLink(
                config.CHANNEL_ID,
                {
                    member_limit: 1,
                    expire_date: Math.floor(Date.now() / 1000) + 3600
                }
            );

            await ctx.telegram.sendMessage(
                userId,
`🎉 <b>অভিনন্দন!</b>

✅ Admin আপনার Request Approved করেছেন।

নিচের Button থেকে Channel Join করুন।`,
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "📢 Join Channel",
                                    url: invite.invite_link
                                }
                            ]
                        ]
                    }
                }
            );

        } catch (e) {
            console.log(e);
        }

        ctx.reply("✅ User Approved.");

    });

    /* ==========================
       /reject USER_ID
    ========================== */

    bot.command("reject", async (ctx) => {

        if (ctx.from.id != config.ADMIN_ID) return;

        const args = ctx.message.text.split(" ");

        if (args.length < 2) {
            return ctx.reply("ব্যবহার:\n\n/reject USER_ID");
        }

        const userId = args[1];

        updateUser(userId, {
            approved: false,
            requested: false,
            status: "rejected",
            rejectedAt: Date.now()
        });

        try {

            await ctx.telegram.sendMessage(
                userId,
`❌ <b>আপনার Request Reject করা হয়েছে।</b>

🚫 আপনি আর নতুন Request পাঠাতে পারবেন না।

📩 Support:
${config.SUPPORT_USERNAME}`,
                {
                    parse_mode: "HTML"
                }
            );

        } catch (e) {
            console.log(e);
        }

        ctx.reply("❌ User Rejected.");

    });

    /* ==========================
       /broadcast
    ========================== */

    bot.command("broadcast", async (ctx) => {

        if (ctx.from.id != config.ADMIN_ID) return;

        const text = ctx.message.text.replace("/broadcast", "").trim();

        if (!text) {
            return ctx.reply("ব্যবহার:\n\n/broadcast আপনার মেসেজ");
        }

        const users = getAllUsers();

        let sent = 0;
        let failed = 0;

        for (const user of users) {

            try {

                await ctx.telegram.sendMessage(
                    user.id,
`📢 <b>Admin Message</b>

━━━━━━━━━━━━━━

${text}`,
                    {
                        parse_mode: "HTML"
                    }
                );

                sent++;

            } catch (e) {

                failed++;
                console.log(e);

            }

        }

        await ctx.reply(
`✅ Broadcast Complete

📨 Sent : ${sent}

❌ Failed : ${failed}`
        );

    });

}

module.exports = {
    registerAdmin
};
