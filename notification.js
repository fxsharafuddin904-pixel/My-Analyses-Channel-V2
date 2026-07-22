const config = require("./config");
const { getAllUsers } = require("./database");

/* =========================================
   CHANNEL POST NOTIFICATION
========================================= */

function registerNotification(bot) {

    // Channel এ নতুন পোস্ট হলে
    bot.on("channel_post", async (ctx) => {

        try {

            const users = getAllUsers();

            let total = 0;

            for (const user of users) {

                // শুধুমাত্র Approved + Joined User
                if (!user.approved || !user.joined) continue;

                try {

                    // এখনও Channel এ আছে কিনা চেক
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

━━━━━━━━━━━━━━━━━━

🔥 Channel-এ নতুন একটি পোস্ট প্রকাশ করা হয়েছে।

📖 দয়া করে এখনই দেখে নিন।

━━━━━━━━━━━━━━━━━━

⚠️ যদি Channel Link আবার প্রয়োজন হয়, তাহলে Bot-এ

<code>/start</code>

পাঠান।`,

                        {
                            parse_mode: "HTML"
                        }

                    );

                    total++;

                } catch (err) {

                    console.log(
                        "Notification Error:",
                        user.id
                    );

                }

            }

            console.log(
                `Notification Sent : ${total}`
            );

        } catch (error) {

            console.log(error);

        }

    });

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

    registerNotification

};
