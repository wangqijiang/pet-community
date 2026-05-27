const mysql = require('mysql2/promise');

async function migrate() {
  let connection;
  try {
    // 使用正确的数据库配置
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'pet_community'
    });

    console.log('Connected to database');

    // 添加新字段（逐个添加，避免 IF NOT EXISTS 语法问题）
    const columns = [
      'gender VARCHAR(10) COMMENT "性别"',
      'color VARCHAR(50) COMMENT "毛色"',
      'weight DECIMAL(5,2) COMMENT "体重(kg)"',
      'size VARCHAR(20) COMMENT "体型"',
      'neutered TINYINT(1) DEFAULT 0 COMMENT "是否绝育"',
      'vaccinated VARCHAR(20) COMMENT "疫苗接种情况"',
      'health_certificate TINYINT(1) DEFAULT 0 COMMENT "是否有健康证明"',
      'personality VARCHAR(200) COMMENT "性格特点"',
      'habits TEXT COMMENT "特殊习惯"',
      'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间"'
    ];

    for (const col of columns) {
      try {
        await connection.execute(`ALTER TABLE pets ADD COLUMN ${col}`);
        console.log(`Added column: ${col.split(' ')[0]}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${col.split(' ')[0]} already exists, skipping`);
        } else {
          throw err;
        }
      }
    }
    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();