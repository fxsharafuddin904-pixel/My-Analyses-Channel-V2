const { Markup } = require("telegraf");

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

function joinButton(link) {

    return Markup.inlineKeyboard([

        [

            Markup.button.url(
                "📢 Join Channel",
                link
            )

        ]

    ]);

}

module.exports = {

    startButtons,

    adminButtons,

    joinButton

};
