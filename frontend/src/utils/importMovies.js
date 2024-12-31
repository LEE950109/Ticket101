const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '192.168.0.11',
    user: 'myuser',
    password: 'welcome1!',
    database: 'ticket_system'
});

const results = [];

// CSV 파일의 경로를 frontend 폴더 기준으로 수정
fs.createReadStream('./src/Data/movies.csv')  // Data 폴더에 movies.csv 파일이 있다고 가정
  .pipe(csv({
    headers: ['id', 'title', 'genre', 'production_country', 'release_year', 'director', 'plot'],
    skipLines: 1
  }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach(movie => {
      const sql = 'INSERT INTO movies (id, title, name, production_country, release_year, director, plot) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [
        movie.id,
        movie.title,
        movie.name,
        movie.production_country,
        movie.release_year || null,
        movie.director,
        movie.plot
      ], (err, result) => {
        if (err) {
          console.error('Error inserting movie:', err);
        } else {
          console.log('Inserted movie:', movie.title);
        }
      });
    });
  }); 