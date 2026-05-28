const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pet_community'
});

connection.connect((err) => {
  if (err) {
    console.error('连接数据库失败:', err);
    process.exit(1);
  }
  
  const alterTable = `
    ALTER TABLE comments 
    ADD COLUMN reply_to_id INT DEFAULT NULL, 
    ADD FOREIGN KEY (reply_to_id) REFERENCES comments(id) ON DELETE CASCADE, 
    ADD INDEX idx_comments_reply_to_id (reply_to_id);
  `;
  
  connection.query(alterTable, (err, results) => {
    if (err) {
      console.error('修改表结构失败:', err);
      connection.end();
      process.exit(1);
    }
    
    console.log('表结构修改成功，已添加 reply_to_id 字段');
    connection.end();
  });
});