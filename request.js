const config = require("./config");
const { getUser, updateUser } = require("./database");
const { adminButtons, joinButton } = require("./buttons");

/* =========================================
   REGISTER REQUEST SYSTEM
========================================= */

function registerRequest(bot) {

    /* ==========================
       SEND REQUEST
    ========================== */

    bot.action("send_request", async (ctx) => {

        const user = getUser(ctx.from.id);

        // যদি Reject করা থাকে
        if (user.status === "rejected") {

            return ctx.answerCbQuery(

`❌ আপনার Request Reject করা হয়েছে।

আবার Request পাঠানো যাবে না।

📩 Support:
${config.SUPPORT_USERNAME}`,

                {
                    show_alert: true
                }

            );

        }

        // যদি Pending থাকে
        if (user.requested) {

            return ctx.answerCbQuery(
                "📩 আপনি ইতোমধ্যে Request পাঠিয়েছেন।",
                {
                    show_alert: true
                }
            );

        }

        updateUser(ctx.from.id, {

            requested: true,

            approved: false,

            status: "pending",

            name: ctx.from.first_name || "",

            username: ctx.from.username || ""

        });

        await ctx.editMessageReplyMarkup({
            inline_keyboard: []
        });

        await ctx.reply(

`✅ <b>আপনার Request সফলভাবে পাঠানো হয়েছে।</b>

⏳ Admin Review করার পর আপনাকে জানানো হবে।`,

            {
                parse_mode: "HTML"
            }

        );

        // Admin Notification
        await ctx.telegram.sendMessage(

            config.ADMIN_ID,

`📩 <b>নতুন Request এসেছে</b>

━━━━━━━━━━━━━━

👤 Name: ${ctx.from.first_name}

🆔 Username:
${ctx.from.username ? "@" + ctx.from.username : "Not Set"}

🪪 User ID:
${ctx.from.id}

━━━━━━━━━━━━━━

নিচের Button থেকে সিদ্ধান্ত নিন।`,

            {
                parse_mode: "HTML",
                ...adminButtons(ctx.from.id)
            }

        );

        return ctx.answerCbQuery();

    });
   /* ==========================
       APPROVE
    ========================== */

    bot.action(/^approve_(.+)$/, async (ctx) => {

        const userId = ctx.match[1];

        updateUser(userId, {

            approved: true,

            requested: false,

            status: "approved"

        });

        // ১ ঘণ্টার Single-use Invite Link
        const invite =
            await ctx.telegram.createChatInviteLink(
                config.CHANNEL_ID,
                {
                    member_limit: 1,
                    expire_date:
                        Math.floor(Date.now() / 1000) + 3600
                }
            );

        await ctx.telegram.sendMessage(

            userId,

`🎉 <b>অভিনন্দন!</b>

✅ আপনার Request Approved হয়েছে।

⏳ নিচের Button থেকে ১ ঘণ্টার মধ্যে Channel Join করুন।

⚠️ এই Link শুধুমাত্র ১ জন ব্যবহার করতে পারবে এবং ১ ঘণ্টা পরে Expire হয়ে যাবে।`,

            {
                parse_mode: "HTML",
                ...joinButton(invite.invite_link)
            }

        );

        await ctx.editMessageReplyMarkup({
            inline_keyboard: []
        });

        return ctx.answerCbQuery("Approved ✅");

    });

    /* ==========================
       REJECT
    ========================== */

    bot.action(/^reject_(.+)$/, async (ctx) => {

        const userId = ctx.match[1];

        updateUser(userId, {

            approved: false,

            requested: false,

            status: "rejected"

        });

        await ctx.telegram.sendMessage(

            userId,

`❌ <b>দুঃখিত!</b>

আপনার Request Reject করা হয়েছে।

🚫 আপনি আর নতুন Request পাঠাতে পারবেন না।

📩 Support এর সাথে যোগাযোগ করুন:

<b>${config.SUPPORT_USERNAME}</b>`,

            {
                parse_mode: "HTML"
            }

        );

        await ctx.editMessageReplyMarkup({
            inline_keyboard: []
        });

        return ctx.answerCbQuery("Rejected ❌");

    });

}

module.exports = {

    registerRequest

};
