DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first !=''),
      last VARCHAR(255) NOT NULL CHECK (last !=''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email !=''),
      password VARCHAR(255) NOT NULL  CHECK (password !=''),
      profile_pic_url VARCHAR(255),
      bio VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email !=''),
    code VARCHAR NOT NULL CHECK (code !=''),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) NOT NULL,
recipient_id INT REFERENCES users(id) NOT NULL,
accepted BOOLEAN DEFAULT false
);


CREATE TABLE chat (
    
    id SERIAL PRIMARY KEY,
    mes_sender_id INT REFERENCES users(id) NOT NULL,
    sent_message VARCHAR NOT NULL,
    sent_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);