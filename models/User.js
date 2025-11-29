
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'db', 'wadeboxxd.db'));

module.exports = {
  create({ username, passwordHash }) {
    const stmt = db.prepare('INSERT INTO users (username, passwordHash, createdAt) VALUES (?, ?, ?)');
    const info = stmt.run(username, passwordHash, new Date().toISOString());
    return info.lastInsertRowid;
  },

  findByUsername(username) {
    const stmt = db.prepare('SELECT id, username, passwordHash, createdAt FROM users WHERE username = ?');
    return stmt.get(username);
  },

  findById(id) {
    const stmt = db.prepare('SELECT id, username, createdAt FROM users WHERE id = ?');
    return stmt.get(id);
  }
};
