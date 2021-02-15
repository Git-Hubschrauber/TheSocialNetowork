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
    ORDER BY created_at DESC LIMIT 3`;
    return db.query(q);
};

module.exports.searchUsers = (val) => {
    const q = `SELECT * FROM users WHERE first ILIKE ($1) ORDER BY first ASC LIMIT 5`;
    const params = [val + "%"];
    return db.query(q, params);
};
