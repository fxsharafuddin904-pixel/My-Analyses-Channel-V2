const config = require("./config");
const { getUser, updateUser } = require("./database");
const { joinButton } = require("./buttons");

/* =========================================
   REGISTER CHANNEL SYSTEM
========================================= */

function registerChannel(bot) {

    /* ==========================
       /join
    ========================== */

    bot.command("join", async (ctx) => {

        const user = getUser(ctx.from.id);

        // Approve Check
        if (!user.approved) {

            return ctx.reply(
`❌ <b>আপনি এখনও Approved নন।</b>

📩 আগে Request পাঠান এবং Admin-এর Approval-এর জন্য অপেক্ষা করুন।`,
                {
                    parse_mode: "HTML"
                }
            );

        }

        try {

            // Check Member
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
`✅ <b>আপনি ইতোমধ্যে Channel-এ Join করেছেন।</b>

🎉 এখন থেকে নতুন পোস্ট হলে Notification পাবেন।`,
                    {
                        parse_mode: "HTML"
                    }
                );

            }

        } catch (err) {
            // User এখনও Join করেনি
        }

        try {

            // Create Temporary Invite Link
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
`🎉 <b>আপনার নতুন Join Link প্রস্তুত।</b>

⏳ এই Link মাত্র ১ ঘণ্টা কার্যকর থাকবে এবং শুধুমাত্র ১ জন ব্যবহার করতে পারবে।`,
                {
                    parse_mode: "HTML",
                    ...joinButton(invite.invite_link)
                }
            );

        } catch (error) {

            console.log(error);

            return ctx.reply(
`❌ Temporary Join Link তৈরি করা যায়নি।

Bot-কে Channel-এর Admin করুন এবং
<b>Invite Users via Link</b> Permission দিন।`,
                {
                    parse_mode: "HTML"
                }
            );

        }

    });

}

module.exports = {
    registerChannel
};
