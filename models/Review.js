
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'db', 'wadeboxxd.db'));

module.exports = {
  add(review) {
    const stmt = db.prepare(`INSERT INTO reviews (userId, username, movieId, movieTitle, rating, comment, createdAt)
      VALUES (@userId, @username, @movieId, @movieTitle, @rating, @comment, @createdAt)`);
    const info = stmt.run(review);
    return info.lastInsertRowid;
  },

  getAll() {
    const stmt = db.prepare('SELECT * FROM reviews ORDER BY createdAt DESC');
    return stmt.all();
  },

  getByMovie(movieId) {
    const stmt = db.prepare('SELECT * FROM reviews WHERE movieId = ? ORDER BY createdAt DESC');
    return stmt.all(movieId);
  },

  getByUser(username) {
    const stmt = db.prepare('SELECT * FROM reviews WHERE username = ? ORDER BY createdAt DESC');
    return stmt.all(username);
  }
};
