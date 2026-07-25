const { Markup } = require("telegraf");

/* =========================================
   START BUTTONS
========================================= */

function startButtons() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "📩 Send Request",
                "send_request"
            )
        ],

        [
            Markup.button.callback(
                "❌ No Thanks",
                "no_thanks"
            )
        ]

    ]);

}

/* =========================================
   ADMIN BUTTONS
========================================= */

function adminButtons(userId) {

    return Markup.inlineKeyboard([

        [

            Markup.button.callback(
                "✅ Approve",
                `approve_${userId}`
            ),

            Markup.button.callback(
                "❌ Reject",
                `reject_${userId}`
            )

        ]

    ]);

}

/* =========================================
   JOIN CHANNEL BUTTON
========================================= */

function joinButton(link) {

    return Markup.inlineKeyboard([

        [

            Markup.button.url(
                "📢 Join Private Channel",
                link
            )

        ]

    ]);

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

    startButtons,

    adminButtons,

    joinButton

};
