const { startButtons } = require("./buttons");
const { getUser, updateUser } = require("./database");
const config = require("./config");

function registerStart(bot) {

    // /start
    bot.start(async (ctx) => {

        const user = getUser(ctx.from.id);

        updateUser(ctx.from.id, {

            name: ctx.from.first_name || "",

            username: ctx.from.username || "",

            requested: user.requested || false,

            approved: user.approved || false,

            joined: user.joined || false

        });

        // যদি Approved থাকে
        if (user.approved) {

            return ctx.reply(

`🎉 <b>আবারও স্বাগতম!</b>

✅ আপনার Request ইতোমধ্যে Approved হয়েছে।

📢 Channel Join করার জন্য নিচের কমান্ড ব্যবহার করুন।

<code>/join</code>

⚡ নতুন পোস্ট হলে আপনি Notification পাবেন।`,

                {
                    parse_mode: "HTML"
                }

            );

        }

        // Welcome Message
        return ctx.reply(

`👋 <b>${ctx.from.first_name} স্বাগতম!</b>

━━━━━━━━━━━━━━━━━━

📚 আপনি যদি <b>Trading</b> শিখতে চান, তাহলে Admin-এর কাছে Request পাঠান।

✅ Request পাঠাতে নিচের <b>📩 Send Request</b> Button-এ ক্লিক করুন।

❌ আগ্রহী না হলে <b>No Thanks</b> চাপুন।

━━━━━━━━━━━━━━━━━━

🔥 আপনার Request Approved হলে Private Channel Join করার সুযোগ পাবেন।`,

            {

                parse_mode: "HTML",

                ...startButtons()

            }

        );

    });

    // No Thanks Button
    bot.action("no_thanks", async (ctx) => {

        try {

            await ctx.editMessageReplyMarkup({
                inline_keyboard: []
            });

        } catch (e) {}

        return ctx.answerCbQuery("ধন্যবাদ ❤️");

    });

}

module.exports = {

    registerStart

};
