const mysql = require('mysql2');

class Database {
  constructor(config) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306')
    }).promise();
  }

  async query(sql, params) {
    try {
      const [results] = await this.connection.query(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getConnection() {
    return this.connection;
  }
}

module.exports = Database;