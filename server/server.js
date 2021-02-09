const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");

let sessionSecret;
if (process.env.NODE_ENV === "production") {
    sessionSecret = process.env.sessionSecret;
} else {
    sessionSecret = require("./secrets.json").sessionSecret;
}

app.use(
    cookieSession({
        secret: sessionSecret,
        maxAge: 1000 * 60 * 30,
    })
);

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
// app.post("/sendEmail", (req, res) => {
//     sendEmail(x, y, z).then(() => console.log("Email sent"));
// });

//
//
//
//
//

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
