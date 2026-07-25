const config = require("./config");
const { getAllUsers } = require("./database");

/* =========================================
   CHANNEL POST NOTIFICATION
========================================= */

function registerNotification(bot) {

    bot.on("channel_post", async (ctx) => {

        const users = getAllUsers();

        let sent = 0;

        for (const user of users) {

            // শুধুমাত্র Approved + Joined User
            if (
                user.status !== "approved" ||
                !user.joined
            ) continue;

            try {

                // User এখনও Channel-এ আছে কিনা
                const member =
                    await ctx.telegram.getChatMember(
                        config.CHANNEL_ID,
                        user.id
                    );

                if (
                    member.status !== "member" &&
                    member.status !== "administrator" &&
                    member.status !== "creator"
                ) {
                    continue;
                }

                await ctx.telegram.sendMessage(

                    user.id,

`📢 <b>নতুন পোস্ট শেয়ার করা হয়েছে!</b>

━━━━━━━━━━━━━━

🔥 Private Channel-এ নতুন একটি পোস্ট প্রকাশ করা হয়েছে।

📖 এখনই দেখে নিন।

━━━━━━━━━━━━━━

🔄 যদি আবার Join Link প্রয়োজন হয়, তাহলে

<code>/start</code>

অথবা

<code>/join</code>

ব্যবহার করুন।`,

                    {
                        parse_mode: "HTML"
                    }

                );

                sent++;

            } catch (err) {

                console.log(
                    `Notification Failed: ${user.id}`
                );

            }

        }

        console.log(`✅ Notification Sent: ${sent}`);

    });

}

module.exports = {

    registerNotification

};
