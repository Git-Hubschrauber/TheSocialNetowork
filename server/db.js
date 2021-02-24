const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/users");
}

//
//
//Register

module.exports.addRegistration = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1,$2,$3, $4) RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

//Login Page

module.exports.checkEmailRegistration = (email) => {
    const q = `SELECT email FROM users where email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getPassword = (email) => {
    const q = `SELECT password FROM users where email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getRegId = (email) => {
    const q = `SELECT id FROM users where email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.saveSecretCode = (email, secretCode) => {
    const q = `INSERT INTO reset_codes (email, code)
    VALUES ($1,$2)`;
    const params = [email, secretCode];
    return db.query(q, params);
};

module.exports.checkCode = (code, email) => {
    const q = `SELECT * FROM reset_codes
    WHERE code = ($1) AND email = ($2) AND (CURRENT_TIMESTAMP - timestamp < INTERVAL '10 MINUTES')`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.insertNewPW = (email, password) => {
    const q = `UPDATE users SET password = ($2) WHERE email =($1)`;
    const params = [email, password];
    return db.query(q, params);
};

module.exports.insertImageUrl = (id, url) => {
    const q = `UPDATE users SET profile_pic_url = ($2) WHERE id =($1)`;
    const params = [id, url];
    return db.query(q, params);
};

module.exports.getUserInfo = (id) => {
    const q = `SELECT * FROM users
    WHERE id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.insertBio = (id, bio) => {
    const q = `UPDATE users SET bio = ($2) WHERE id =($1)`;
    const params = [id, bio];
    return db.query(q, params);
};

module.exports.deleteImage = (id, def) => {
    const q = `UPDATE users SET profile_pic_url = ($2) WHERE id =($1)`;
    const params = [id, def];
    return db.query(q, params);
};

module.exports.getNewUsers = () => {
    const q = `SELECT * FROM users
    ORDER BY id DESC LIMIT 3`;
    return db.query(q);
};

module.exports.searchUsers = (val) => {
    const q = `SELECT * FROM users WHERE first ILIKE ($1) ORDER BY first ASC LIMIT 5`;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.getFriendshipStatus = (sender_id, recipient_id) => {
    const q = `SELECT * FROM friendships WHERE (recipient_id = ($1) AND sender_id = ($2)) OR (recipient_id = ($2) AND sender_id = ($1))`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.makeFriendship = (sender_id, recipient_id) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES (($1),($2), FALSE)`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.acceptFriendship = (sender_id, recipient_id) => {
    const q = `UPDATE friendships SET accepted = TRUE WHERE (sender_id = ($1) AND recipient_id = ($2))`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.cancelFriendship = (sender_id, recipient_id) => {
    const q = `DELETE FROM friendships WHERE (recipient_id = ($1) AND sender_id = ($2)) OR (recipient_id = ($2) AND sender_id = ($1))`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.getFriends = (id) => {
    const q = `Select * FROM friendships WHERE (sender_id = ($1) AND accepted = TRUE) OR (recipient_id = ($1) AND accepted = TRUE)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getOnlineUsers = (elem) => {
    const q = `Select * FROM users WHERE id = ANY($1)`;
    const params = [elem];
    return db.query(q, params);
};

module.exports.getFriendsandRequests = (id) => {
    const q = `SELECT users.id, first, last, profile_pic_url, accepted, sender_id, recipient_id 
    FROM friendships
    JOIN users
    ON (recipient_id = $1 AND sender_id = users.id)
    OR (sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getOthersFriends = (id) => {
    const q = `SELECT users.id, first, last, profile_pic_url, accepted, sender_id, recipient_id 
    FROM friendships
    JOIN users
    ON (recipient_id = $1 AND sender_id = users.id AND accepted = TRUE)
    OR (sender_id = $1 AND recipient_id = users.id AND accepted = TRUE)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getLastMessages = () => {
    const q = `SELECT first, last, profile_pic_url, chat.id, mes_sender_id, sent_message, sent_timestamp
    FROM chat
    JOIN users ON (mes_sender_id = users.id) ORDER BY chat.id DESC LIMIT 10`;
    return db.query(q);
};

module.exports.insertMessage = (sender_id, message) => {
    const q = `INSERT INTO chat (mes_sender_id, sent_message) VALUES (($1),($2))`;
    const params = [sender_id, message];
    return db.query(q, params);
};

module.exports.getLastMessageInfo = () => {
    const q = `SELECT first, last, profile_pic_url, chat.id, mes_sender_id, sent_message, sent_timestamp
    FROM chat
    JOIN users ON (mes_sender_id = users.id) ORDER BY chat.id DESC LIMIT 1`;
    return db.query(q);
};

module.exports.deleteAccountChat = (id) => {
    const q = `DELETE
    FROM chat
    WHERE  mes_sender_id =  ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteAccountFriendships = (id) => {
    const q = `DELETE
    FROM friendships
    WHERE  recipient_id = ($1) OR sender_id =  ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteAccountUsers = (id) => {
    const q = `DELETE
    FROM users
    WHERE  id = ($1)`;
    const params = [id];
    return db.query(q, params);
};
