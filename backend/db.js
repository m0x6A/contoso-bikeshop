import Database from 'better-sqlite3';

export function createDb(dbPath = './contoso-bikes.db') {
  const db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (count === 0) {
    const insert = db.prepare(
      'INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)'
    );

    const seedProducts = [
      [
        'Contoso Trail Blazer',
        'A rugged mountain bike built for the toughest trails. Full suspension, hydraulic disc brakes, and 29-inch wheels.',
        1299.99,
        '/images/mountain.svg',
        'Mountain',
      ],
      [
        'Contoso Speedster Pro',
        'Lightweight carbon frame road bike designed for speed. Shimano 105 groupset with aerodynamic drop bars.',
        1899.99,
        '/images/road.svg',
        'Road',
      ],
      [
        'Contoso City Cruiser',
        'Comfortable city bike with an upright riding position. Includes fenders, rack, and built-in lights.',
        699.99,
        '/images/city.svg',
        'City',
      ],
      [
        'Contoso Volt E-Bike',
        'Powerful electric bike with a 500W motor and 60-mile range. Perfect for commuting and leisure rides.',
        2499.99,
        '/images/electric.svg',
        'Electric',
      ],
      [
        'Contoso Little Rider',
        'Fun and safe kids bike with training wheel compatibility. Lightweight aluminum frame in bright colors.',
        349.99,
        '/images/kids.svg',
        'Kids',
      ],
      [
        'Contoso Gravel King',
        'Versatile gravel bike that handles road and off-road equally well. Tubeless-ready wide tires and flared drop bars.',
        1599.99,
        '/images/gravel.svg',
        'Gravel',
      ],
    ];

    const insertMany = db.transaction((products) => {
      for (const p of products) {
        insert.run(...p);
      }
    });

    insertMany(seedProducts);
  }

  return db;
}
