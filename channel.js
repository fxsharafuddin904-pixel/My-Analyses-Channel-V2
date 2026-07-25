const config = require("./config");
const { getUser, updateUser } = require("./database");
const { joinButton } = require("./buttons");

function registerChannel(bot) {

    bot.command("join", async (ctx) => {

        const user = getUser(ctx.from.id);

        // Reject User
        if (user.status === "rejected") {

            return ctx.reply(

`❌ <b>আপনার Request Reject করা হয়েছে।</b>

🚫 আপনি Channel Join করতে পারবেন না।

📩 Support:
<b>${config.SUPPORT_USERNAME}</b>`,

                {
                    parse_mode: "HTML"
                }

            );

        }

        // Pending User
        if (user.status !== "approved") {

            return ctx.reply(

`⏳ <b>আপনি এখনও Approved নন।</b>

Admin Approval-এর জন্য অপেক্ষা করুন।`,

                {
                    parse_mode: "HTML"
                }

            );

        }

        // আগে থেকেই Join আছে কিনা
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

`✅ <b>আপনি ইতোমধ্যে Channel-এ Join করেছেন।</b>

🎉 এখন থেকে নতুন পোস্টের Notification পাবেন।`,

                    {
                        parse_mode: "HTML"
                    }

                );

            }

        } catch (e) {}

        try {

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

`🎉 <b>Join Link তৈরি হয়েছে।</b>

⏳ Link মাত্র <b>১ ঘণ্টা</b> কার্যকর থাকবে এবং <b>শুধুমাত্র ১ জন</b> ব্যবহার করতে পারবে।`,

                {

                    parse_mode: "HTML",

                    ...joinButton(invite.invite_link)

                }

            );

        } catch (err) {

            console.log(err);

            return ctx.reply(

`❌ Temporary Invite Link তৈরি করা যায়নি।

Bot-কে Channel-এর Admin করুন এবং

<b>Invite Users via Link</b>

Permission দিন।`,

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
