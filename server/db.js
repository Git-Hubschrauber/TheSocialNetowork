const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/users");
}

//
//
//Register Page

module.exports.addRegistration = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
    VALUES ($1,$2,$3, $4) RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params);
};
