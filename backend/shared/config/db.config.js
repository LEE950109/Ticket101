module.exports = {
    host: process.env.DB_HOST || '192.168.0.11',
    user: process.env.DB_USER || 'myuser',
    password: process.env.DB_PASSWORD || 'welcome1!',
    database: process.env.DB_NAME || 'ticket_system',
    port: parseInt(process.env.DB_PORT || '3306')
  };