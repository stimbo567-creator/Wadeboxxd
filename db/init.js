
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'wadeboxxd.db');

if (fs.existsSync(DB_PATH)) {
  console.log('Database exists — skipping recreate. Delete db/wadeboxxd.db to recreate.');
} else {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE movies (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      year INTEGER,
      genre TEXT
    );

    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE reviews (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      username TEXT,
      movieId INTEGER,
      movieTitle TEXT,
      rating INTEGER,
      comment TEXT,
      createdAt TEXT,
      FOREIGN KEY(movieId) REFERENCES movies(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);

  const movies = [
    ["The Godfather", 1972, "Crime"],
    ["The Shawshank Redemption", 1994, "Drama"],
    ["Pulp Fiction", 1994, "Crime"],
    ["The Dark Knight", 2008, "Action"],
    ["Forrest Gump", 1994, "Drama"],
    ["Inception", 2010, "Sci-Fi"],
    ["Fight Club", 1999, "Drama"],
    ["The Matrix", 1999, "Sci-Fi"],
    ["Interstellar", 2014, "Sci-Fi"],
    ["Parasite", 2019, "Thriller"],
    ["The Lord of the Rings: The Fellowship of the Ring", 2001, "Fantasy"],
    ["The Lord of the Rings: The Two Towers", 2002, "Fantasy"],
    ["The Lord of the Rings: The Return of the King", 2003, "Fantasy"],
    ["The Social Network", 2010, "Drama"],
    ["Gladiator", 2000, "Action"],
    ["La La Land", 2016, "Musical"],
    ["Whiplash", 2014, "Drama"],
    ["The Grand Budapest Hotel", 2014, "Comedy"],
    ["Mad Max: Fury Road", 2015, "Action"],
    ["The Prestige", 2006, "Thriller"],
    ["Django Unchained", 2012, "Western"],
    ["Once Upon a Time in Hollywood", 2019, "Comedy"],
    ["Blade Runner 2049", 2017, "Sci-Fi"],
    ["The Truman Show", 1998, "Drama"],
    ["A Clockwork Orange", 1971, "Drama"],
    ["The Silence of the Lambs", 1991, "Thriller"],
    ["City of God", 2002, "Crime"],
    ["Alien", 1979, "Horror"],
    ["Back to the Future", 1985, "Sci-Fi"],
    ["The Lion King", 1994, "Animation"]
  ];

  const insert = db.prepare('INSERT INTO movies (title, year, genre) VALUES (?, ?, ?)');
  const insertMany = db.transaction((rows) => {
    for (const r of rows) insert.run(r[0], r[1], r[2]);
  });
  insertMany(movies);

  console.log('Database created and seeded at', DB_PATH);
  db.close();
}
