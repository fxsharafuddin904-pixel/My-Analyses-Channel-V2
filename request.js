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

        // যদি আগে Reject করা থাকে
        if (user.status === "rejected") {

            return ctx.answerCbQuery(

`❌ আপনার Request Reject করা হয়েছে।

🚫 আপনি আর নতুন Request পাঠাতে পারবেন না।

📩 Support এর সাথে যোগাযোগ করুন:

${config.SUPPORT_USERNAME}`,

                {
                    show_alert: true
                }

            );

        }

        // যদি Approved থাকে
        if (user.status === "approved") {

            return ctx.answerCbQuery(

"✅ আপনার Request ইতোমধ্যেই Approved হয়েছে।",

                {
                    show_alert: true
                }

            );

        }

        // যদি Pending থাকে
        if (user.status === "pending") {

            return ctx.answerCbQuery(

"⏳ আপনার Request এখনও Review-এ আছে।",

                {
                    show_alert: true
                }

            );

        }

        updateUser(ctx.from.id, {

            requested: true,

            approved: false,

            joined: false,

            status: "pending",

            name: ctx.from.first_name || "",

            username: ctx.from.username || ""

        });

        try {

            await ctx.editMessageReplyMarkup({
                inline_keyboard: []
            });

        } catch (e) {}

        await ctx.reply(

`✅ <b>আপনার Request সফলভাবে পাঠানো হয়েছে।</b>

━━━━━━━━━━━━━━

⏳ Admin Review করার পর আপনাকে Notification দেওয়া হবে।

অনুগ্রহ করে অপেক্ষা করুন।`,

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
<code>${ctx.from.id}</code>

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

        status: "approved",

        approvedAt: Date.now()

    });

    try {

        // ১ ঘণ্টার জন্য ১ জনের Invite Link
        const invite = await ctx.telegram.createChatInviteLink(

            config.CHANNEL_ID,

            {

                member_limit: config.INVITE_MEMBER_LIMIT,

                expire_date:
                    Math.floor(Date.now() / 1000) +
                    config.INVITE_EXPIRE_SECONDS

            }

        );

        await ctx.telegram.sendMessage(

            userId,

`🎉 <b>অভিনন্দন!</b>

━━━━━━━━━━━━━━

✅ আপনার Request Approved হয়েছে।

🔗 নিচের Button থেকে Private Channel-এ Join করুন।

⏳ এই Link মাত্র <b>১ ঘণ্টা</b> কার্যকর থাকবে এবং <b>শুধুমাত্র ১ জন</b> ব্যবহার করতে পারবে।

স্বাগতম! ❤️`,

            {

                parse_mode: "HTML",

                ...joinButton(invite.invite_link)

            }

        );

    } catch (err) {

        console.log("Invite Error:", err);

        await ctx.telegram.sendMessage(

            userId,

`✅ আপনার Request Approved হয়েছে।

কিন্তু Temporary Join Link তৈরি করা যায়নি।

অনুগ্রহ করে Admin-এর সাথে যোগাযোগ করুন।`,

            {

                parse_mode: "HTML"

            }

        );

    }

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

        status: "rejected",

        rejectedAt: Date.now()

    });

    await ctx.telegram.sendMessage(

        userId,

`❌ <b>দুঃখিত!</b>

━━━━━━━━━━━━━━

আপনার Request <b>Reject</b> করা হয়েছে।

🚫 আপনি আর নতুন Request পাঠাতে পারবেন না।

📩 যদি মনে করেন এটি ভুল হয়েছে, তাহলে Support-এর সাথে যোগাযোগ করুন।

<b>${config.SUPPORT_USERNAME}</b>

ধন্যবাদ।`,

        {
            parse_mode: "HTML"
        }

    );

    try {

        await ctx.editMessageReplyMarkup({
            inline_keyboard: []
        });

    } catch (e) {}

    return ctx.answerCbQuery("Rejected ❌");

});

/* =========================================
   EXPORTS
========================================= */

}

module.exports = {

    registerRequest

};
