const path = '/root/cookiechat/';
const db = require(path + 'node_modules/better-sqlite3')(path + 'database.sqlite');
const bcrypt = require(path + 'node_modules/bcryptjs');

const id = 'qa-runa-viewer';
const pass = bcrypt.hashSync('qatest123', 10);

db.prepare('DELETE FROM users WHERE id = ?').run(id);
db.prepare(`
  INSERT INTO users (id, username, password, display_name, bio, city, is_admin, is_premium, rubies, mops_balance)
  VALUES (?, ?, ?, ?, ?, ?, 0, 0, 850, 12.5)
`).run(id, 'qaruna', pass, 'QA Viewer', 'Тестовый профиль для проверки вёрстки', 'Москва');

db.prepare('DELETE FROM user_gifts WHERE to_user_id = ?').run(id);
const gifts = db.prepare('SELECT id, slug, title FROM gifts').all();
console.log('gifts:', JSON.stringify(gifts));
for (const g of gifts) {
  db.prepare('INSERT INTO user_gifts (id, gift_id, from_user_id, to_user_id, message, anonymous, created_at) VALUES (?,?,?,?,?,0,?)')
    .run('qa-ug-' + g.id, g.id, 'admin-id', id, 'Тестовый подарок', new Date().toISOString());
}
console.log('user qaruna ready, gifts:', gifts.length);
console.log('rows:', db.prepare('SELECT count(*) c FROM user_gifts WHERE to_user_id = ?').get(id).c);
