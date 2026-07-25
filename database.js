const fs = require("fs");

const DB_FILE = "./users.json";

/* =========================================
   LOAD USERS
========================================= */

function loadUsers() {

    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, "[]");
    }

    return JSON.parse(
        fs.readFileSync(DB_FILE, "utf8")
    );

}

/* =========================================
   SAVE USERS
========================================= */

function saveUsers(users) {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(users, null, 2)
    );

}

/* =========================================
   GET USER
========================================= */

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

            requested: false,

            joined: false,

            status: "none", // none | pending | approved | rejected

            createdAt: Date.now(),

            approvedAt: null,

            rejectedAt: null,

            joinedAt: null

        };

        users.push(user);

        saveUsers(users);

    }

    return user;

}

/* =========================================
   UPDATE USER
========================================= */

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

/* =========================================
   GET ALL USERS
========================================= */

function getAllUsers() {

    return loadUsers();

}

/* =========================================
   DELETE USER
========================================= */

function deleteUser(id) {

    const users = loadUsers().filter(
        x => x.id != id
    );

    saveUsers(users);

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

    getUser,

    updateUser,

    getAllUsers,

    deleteUser

};
