const mysql = require('mysql2/promise');

async function addPhotosColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'pet_community'
  });
  try {
    await connection.execute('ALTER TABLE pets ADD COLUMN photos TEXT COMMENT "照片列表"');
    console.log('Added photos column successfully');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column photos already exists');
    } else {
      throw err;
    }
  } finally {
    await connection.end();
  }
}
addPhotosColumn();