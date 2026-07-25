const { startButtons, joinButton } = require("./buttons");
const { getUser, updateUser } = require("./database");
const config = require("./config");

function registerStart(bot) {

    bot.start(async (ctx) => {

        const user = getUser(ctx.from.id);

        updateUser(ctx.from.id, {

            name: ctx.from.first_name || "",

            username: ctx.from.username || ""

        });

        // Approved User
        if (user.status === "approved") {

            try {

                const member = await ctx.telegram.getChatMember(

                    config.CHANNEL_ID,

                    ctx.from.id

                );

                if (
                    member.status === "member" ||
                    member.status === "administrator" ||
                    member.status === "creator"
                ) {

                    updateUser(ctx.from.id, {

                        joined: true

                    });

                    return ctx.reply(

`🎉 <b>আবারও স্বাগতম!</b>

━━━━━━━━━━━━━━

✅ আপনি ইতোমধ্যে Approved।

📢 আপনি Channel-এ Join করে আছেন।

🔥 নতুন পোস্ট হলে Notification পাবেন।`,

                        {

                            parse_mode: "HTML"

                        }

                    );

                }

            } catch (e) {}

            const invite =
                await ctx.telegram.createChatInviteLink(

                    config.CHANNEL_ID,

                    {

                        member_limit: 1,

                        expire_date:
                            Math.floor(Date.now() / 1000) + 3600

                    }

                );

            return ctx.reply(

`🎉 <b>আপনার Request Approved।</b>

নিচের Button থেকে Channel Join করুন।`,

                {

                    parse_mode: "HTML",

                    ...joinButton(invite.invite_link)

                }

            );

        }

        // Rejected User
        if (user.status === "rejected") {

            return ctx.reply(

`❌ <b>আপনার Request Reject করা হয়েছে।</b>

🚫 আপনি নতুন Request পাঠাতে পারবেন না।

📩 Support:

<b>${config.SUPPORT_USERNAME}</b>`,

                {

                    parse_mode: "HTML"

                }

            );

        }

        // Pending User
        if (user.status === "pending") {

            return ctx.reply(

`⏳ <b>আপনার Request Review-এ আছে।</b>

Admin Approval-এর জন্য অপেক্ষা করুন।`,

                {

                    parse_mode: "HTML"

                }

            );

        }

        // New User
        return ctx.reply(

`👋 <b>${ctx.from.first_name} স্বাগতম!</b>

━━━━━━━━━━━━━━

📚 আপনি যদি Trading শিখতে চান,

তাহলে Admin-এর কাছে Request পাঠান।

✅ নিচের Button-এ ক্লিক করুন।

━━━━━━━━━━━━━━`,

            {

                parse_mode: "HTML",

                ...startButtons()

            }

        );

    });

    // No Thanks
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
