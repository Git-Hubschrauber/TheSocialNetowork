const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");

let sessionSecret;
if (process.env.NODE_ENV === "production") {
    sessionSecret = process.env.sessionSecret;
} else {
    sessionSecret = require("./secrets.json").sessionSecret;
}

const { hash, compare } = require("./bc");
const csurf = require("csurf");

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

// app.use(csurf());

// app.use(function (req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

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
//

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/registration", (req, res) => {
    console.log("get for /registration");
});

app.post("/registration", (req, res) => {
    console.log("req.body for /registration first");
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
                    req.session.userId = results.rows[0].id;
                    res.cookie("userId", req.session.userId);
                    console.log("userId: ", results.rows[0].id);
                    res.json(results.rows[0].id);
                })
                .catch((err) => {
                    console.log("err in addRegistration", err);

                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("err in hashing", err);
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
