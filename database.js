const fs = require("fs");

const DB_FILE = "./users.json";

function loadUsers() {

    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, "[]");
    }

    return JSON.parse(
        fs.readFileSync(DB_FILE, "utf8")
    );

}

function saveUsers(users) {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(users, null, 2)
    );

}

function getUser(id) {

    const users = loadUsers();

    let user = users.find(
        x => x.id == id
    );

    if (!user) {

        user = {

            id,

            name: "",

            username: "",

            approved: false,

            joined: false,

            requested: false,

            createdAt: Date.now()

        };

        users.push(user);

        saveUsers(users);

    }

    return user;

}

function updateUser(id, data) {

    const users = loadUsers();

    const index = users.findIndex(
        x => x.id == id
    );

    if (index === -1) return;

    users[index] = {

        ...users[index],

        ...data

    };

    saveUsers(users);

}

function getAllUsers() {

    return loadUsers();

}

module.exports = {

    getUser,

    updateUser,

    getAllUsers

};
