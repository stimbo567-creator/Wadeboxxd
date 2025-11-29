
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'db', 'wadeboxxd.db'));

module.exports = {
  getAll() {
    const stmt = db.prepare('SELECT id, title, year, genre FROM movies ORDER BY title');
    return stmt.all();
  },
  getById(id) {
    const stmt = db.prepare('SELECT id, title, year, genre FROM movies WHERE id = ?');
    return stmt.get(id);
  },
  search(q) {
    const stmt = db.prepare('SELECT id, title, year, genre FROM movies WHERE title LIKE ? ORDER BY title');
    return stmt.all(`%${q}%`);
  }
};
