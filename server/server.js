const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");

const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

let sessionSecret;
if (process.env.NODE_ENV === "production") {
    sessionSecret = process.env.sessionSecret;
} else {
    sessionSecret = require("./secrets.json").sessionSecret;
}

const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// app.use(
//     express.urlencoded({
//         extended: false,
//     })
// );
app.use(express.json());

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "..", "server", "uploads")));

//

//
//
//

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    if (
        req.body.first == "" ||
        req.body.last == "" ||
        !req.body.email.includes("@") ||
        req.body.password == ""
    ) {
        console.log("input field check: error");
        res.json({ error: true });
    } else {
        hash(req.body.password)
            .then((hashedPw) => {
                let password = hashedPw;
                db.addRegistration(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    password
                )
                    .then((results) => {
                        console.log("userId: ", results.rows[0].id);
                        req.session.userId = results.rows[0].id;
                        res.json(results.rows[0].id);
                    })
                    .catch((err) => {
                        console.log("err in addRegistration", err);

                        res.json({ error: true });
                    });
            })
            .catch((err) => {
                console.log("err in hashing", err);
                res.json({ error: true });
            });
    }
});

app.post("/login/userlogin", (req, res) => {
    console.log("/login post route here: ", req.body.email);
    db.checkEmailRegistration(req.body.email)
        .then((results) => {
            let checkedEmail = results.rows[0].email;
            let check = checkedEmail == req.body.email;
            if (check) {
                db.getPassword(checkedEmail).then((result) => {
                    let hashFromDB = result.rows[0].password;
                    compare(req.body.password, hashFromDB)
                        .then((match) => {
                            if (match) {
                                db.getRegId(checkedEmail)
                                    .then((results) => {
                                        req.session.userId = results.rows[0].id;

                                        console.log(
                                            "userId in login: ",
                                            results.rows[0].id
                                        );

                                        res.json(results.rows[0].id);
                                    })
                                    .catch((err) => {
                                        console.log("err getting RegID:", err);
                                        res.json({ error: true });
                                    });
                            } else {
                                console.log("err in compare2");
                                res.json({ error: true });
                            }
                        })
                        .catch((err) => {
                            console.log("err in compare:", err);
                            res.json({ error: true });
                        });
                });
            }
        })
        .catch((err) => {
            console.log("err in emailCheck", err);
            res.json({ error: true });
        });
});

app.get("/api/loggedUser", async (req, res) => {
    const userId = req.session.userId;
    // console.log("id in /api/user: ", req.session.userId);
    // console.log("req.body in /api/user: ", req.body);
    // console.log("req.params in /api/user: ", req.params);
    let results = await db.getUserInfo(userId);
    // console.log("/user results: ", results.rows[0]);

    res.json(results.rows[0]);
});

//
//
//
//RESET PW
//

app.post("/password/reset/start", (req, res) => {
    console.log("PW reset start route here");

    const emailToReset = req.body.email;
    console.log("email to reset: ", emailToReset);

    db.checkEmailRegistration(emailToReset)
        .then((results) => {
            console.log("email from db: ", results.rows[0].email);
            let checkedEmail = results.rows[0].email;
            let check = checkedEmail == emailToReset;

            if (check) {
                console.log("email EXISTS: ", check);
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("secretCode for PWreset:", secretCode);
                db.saveSecretCode(emailToReset, secretCode)
                    .then(() => {
                        console.log("Insert code into db");
                        const message =
                            "Please enter the following code: " + secretCode;
                        const subject = "Password reset for your account";
                        sendEmail(emailToReset, message, subject);
                    })
                    .then(() => {
                        console.log("Email sent");
                        res.json(secretCode);
                    })
                    .catch((err) => {
                        console.log("err in sendEmail", err);
                        res.json({ error: true });
                    });
            } else {
                console.log("email DOES NOT EXISTS: ", check);
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err in resetPW start", err);
            res.json({ error: true });
        });

    //
});

app.post("/password/reset/verify", (req, res) => {
    console.log("PW reset verify route here");
    console.log(req.body);
    const { code, email, newPassword } = req.body;
    db.checkCode(code, email)
        .then((result) => {
            console.log("result for codeCheck", result.rows);
            if (!result.rows) {
                console.log("err2 in checkCod2e");
                return res.json({ error: true });
            } else {
                hash(newPassword)
                    .then((hashedPw) => {
                        let password = hashedPw;
                        db.insertNewPW(email, password)
                            .then(() => {
                                res.json({ error: false });
                            })
                            .catch((err) => {
                                console.log("err1 in checkCode1", err);
                                res.json({ error: true });
                            });
                    })
                    .catch((err) => {
                        console.log("err1 in checkCode1", err);
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.log("err in checkCode", err);
            res.json({ error: true });
        });
    //
});

//
app.post("/upload", uploader.single("file"), async (req, res) => {
    const userId = req.session.userId;
    console.log("id in /upload: ", userId);
    console.log("filename in /upload: ", req.file.filename);
    console.log("/upload here");

    const url = req.file.filename;
    console.log("url in /upload: ", url);

    if (req.file) {
        await db.insertImageUrl(userId, url);
        let results2 = await db.getUserInfo(userId);
        console.log("upload results: ", results2.rows);

        res.json({
            url: results2.rows[0].profile_pic_url,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.post("/deleteProfilePicture", async (req, res) => {
    const userId = req.session.userId;
    const def = ["/default.png"];
    console.log("id in /delete: ", userId);
    console.log("/delete here");

    await db.deleteImage(userId, def);

    res.json({
        sucess: true,
    });
});

app.post("/api/deleteAccount", async (req, res) => {
    const userId = req.session.userId;

    console.log("/delete account here");

    try {
        await db.deleteAccountChat(userId);
        await db.deleteAccountFriendships(userId);
        await db.deleteAccountUsers(userId);

        req.session = null;

        console.log("account deletion successful");

        return res.redirect("/welcome");
    } catch (err) {
        console.log("error in server deleteAccount: ", err);
    }
});

//
//
//

app.post("/editBio", async (req, res) => {
    console.log("/editBio here");
    const userId = req.session.userId;
    console.log("id in /editBio: ", userId);
    console.log("req.body in /editBio: ", req.body);

    console.log("bio in /editBio: ", req.body.bio);
    await db.insertBio(userId, req.body.bio);
    let results = await db.getUserInfo(userId);
    console.log("editBio results: ", results.rows[0]);
    const resBio = results.rows[0].bio;
    console.log("editBio resBio: ", resBio);
    res.json(resBio);
});
//
//
app.post("/api/logout", (req, res) => {
    req.session.userId = null;
    req.session = null;
    res.redirect("/welcome");
});
//
//
app.get("/api/user/:id", async (req, res) => {
    const userId = req.session.userId;
    const recipient_id = req.params.id;
    try {
        const results1 = await db.getUserInfo(req.params.id);
        const results2 = await db.getFriendshipStatus(userId, recipient_id);

        return res.json({
            userInfo: results1.rows[0],
            error: false,
            loggedUser: userId,
            friendship: results2.rows[0],
        });
    } catch (err) {
        console.log("err in /api/user/:id", err);
        res.json({ error: true });
    }
});
//
//

app.post("/api/users", async (req, res) => {
    console.log("/api/users here");
    const results = await db.getNewUsers();

    // console.log("server: recentlyJoined: ", results.rows);
    res.json(results.rows);
});

//
//
//
//

app.post("/api/searchUsers/:searchedUser", async (req, res) => {
    console.log("req.body: ", req.body);
    console.log(" req.params.searchedUser: ", req.params.searchedUser);

    let val = req.params.searchedUser;
    let results = await db.searchUsers(val);
    console.log("/searchuser results: ", results.rows);

    res.json(results.rows);
});
//
//
//

app.post("/api/userInvitation/:id", async (req, res) => {
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    try {
        const results = await db.makeFriendship(sender_id, recipient_id);

        console.log("friendship invitation results: ", results);
        res.json(results.rows);
    } catch (err) {
        console.log("err in /userInvitation", err);
        res.json({ error: true });
    }
});

app.post("/api/acceptInvitation/:id", async (req, res) => {
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    try {
        await db.acceptFriendship(recipient_id, sender_id);
        const results = await db.getFriendshipStatus(sender_id, recipient_id);

        console.log("accept invitation results: ", results.rows);
        res.json(results.rows);
    } catch (err) {
        console.log("err in /acceptInvitation", err);
        res.json({ error: true });
    }
});

app.post("/api/cancelInvitation/:id", async (req, res) => {
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    try {
        await db.cancelFriendship(sender_id, recipient_id);
        res.json({ error: false });
    } catch (err) {
        console.log("err in /cancelInvitation", err);
        res.json({ error: true });
    }
});

app.get("/api/friends/", async (req, res) => {
    const loggedId = req.session.userId;

    try {
        const { rows } = await db.getFriendsandRequests(loggedId);

        res.json({ friendships: rows, loggedUser: loggedId });
    } catch (err) {
        console.log("err in /friends", err);
        res.json({ error: true });
    }
});

app.get("/api/friend/:id", async (req, res) => {
    try {
        const { rows } = await db.getUserInfo(req.params.id);
        console.log("results in /friends/id", rows);

        res.json(rows);

        // console.log("friends: ", friends);
        // res.json({ results: friends });
    } catch (err) {
        console.log("err in /friend/id", err);
        res.json({ error: true });
    }
});

app.get("/api/viewFriends/:id", async (req, res) => {
    try {
        const { rows } = await db.getOthersFriends(req.params.id);
        // console.log("server results in /viewfriends", rows);
        res.json(rows.reverse());
    } catch (err) {
        console.log("err in /friends", err);
        res.json({ error: true });
    }
});

//
//
//

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

//
//
//

// app.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
let onlineUsers = {};

io.on("connection", function (socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    const userId = socket.request.session.userId;

    if (!socket.request.session.userId) {
        console.log("socket disconnected");

        return socket.disconnect(true);
    }

    //
    //
    //
    onlineUsers[socket.id] = userId;
    console.log("onlineUsers in server: ", Object.values(onlineUsers));
    let onlineUsersIds = Object.values(onlineUsers);
    let otherOnlineUsersIds = [
        ...new Set(onlineUsersIds.filter((element) => element !== userId)),
    ];

    console.log("otherOnlineUsers in server: ", otherOnlineUsersIds);
    db.getOnlineUsers(otherOnlineUsersIds).then(({ rows }) => {
        console.log("OtheronlineUsers Data: ", rows);
        socket.emit("whoElseIsOnline", rows);
    });

    if (!onlineUsersIds.includes(userId)) {
        console.log("newUser joined: ", userId);
        db.getUserInfo(userId).then(({ rows }) => {
            console.log("server - new user joined: ", rows);
            let newUserInfo = rows;
            io.emit("newUserJoined", newUserInfo);
        });
    }

    //
    //

    db.getLastMessages().then((results) => {
        io.emit("chatMessages", results.rows.reverse());
    });

    //
    //

    socket.on("chatMessage", async (msg) => {
        try {
            console.log("msg-data: ", msg);
            await db.insertMessage(userId, msg);
            const { rows } = await db.getLastMessageInfo();
            console.log("sender Info: ", rows[0]);
            io.emit("newMessage", rows[0]);
        } catch (err) {
            console.log("err in server socket chatMessage", err);
        }
    });

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        console.log(
            "onlineUsers in server after a disconnect: ",
            Object.values(onlineUsers)
        );
        onlineUsersIds = Object.values(onlineUsers);
        otherOnlineUsersIds = [
            ...new Set(onlineUsersIds.filter((element) => element !== userId)),
        ];
        db.getOnlineUsers(otherOnlineUsersIds).then(({ rows }) => {
            console.log("OtheronlineUsers Data: ", rows);
            socket.emit("whoElseIsOnline", rows);
        });
        console.log(`Socket with id: ${socket.id} just DISCONNECTED!!!!`);
    });
});
