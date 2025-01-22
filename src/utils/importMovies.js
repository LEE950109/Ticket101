const mysql = require('mysql2/promise');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: '192.168.0.16',
  port: 3306,
  user: 'myuser',
  password: 'welcome1!',
  database: 'ticket_system',
  maxAllowedPacket: 1073741824 // 1GB로 설정
};

async function importMovies() {
  const connection = await mysql.createConnection(dbConfig);
  const movies = [];
  let currentId = 1;

  try {
    const csvPath = path.join(__dirname, '..', 'Data', 'movies.csv');
    
    // 스트림 옵션 추가
    const streamOptions = { 
      highWaterMark: 1024 * 1024, // 1MB 버퍼
    };

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath, streamOptions)
        .pipe(csv.parse({ 
          headers: true,
          maxRows: 0 // 행 제한 제거
        }))
        .on('data', (row) => {
          if (row.title && row.genre && row.genre_number) {
            movies.push({
              id: currentId++,
              title: row.title || '',
              genre: row.genre || '',
              genre_number: row.genre_number || 0,
              production_country: row.production_country || '',
              release_year: row.release_year || null,
              director: row.director || '',
              plot: row.plot || ''
            });
          } else {
            console.log('데이터 누락:', row);
          }
        })
        .on('error', (error) => {
          console.error('CSV 파일 읽기 오류:', error);
          reject(error);
        })
        .on('end', () => {
          console.log('CSV 파일 읽기 완료. 총 레코드 수:', movies.length);
          resolve();
        });
    });

    // 기존 데이터 삭제
    await connection.execute('TRUNCATE TABLE movies');

    // 배치 처리
    const batchSize = 1000;
    for (let i = 0; i < movies.length; i += batchSize) {
      const batch = movies.slice(i, i + batchSize);
      const values = batch.map(movie => [
        movie.id,
        movie.title,
        movie.genre,
        movie.genre_number,
        movie.production_country,
        movie.release_year,
        movie.director,
        movie.plot
      ]);
      
      await connection.query(
        'INSERT INTO movies (id, title, genre, genre_number, production_country, release_year, director, plot) VALUES ?',
        [values]
      );
      
      console.log(`${i + batch.length}/${movies.length} 레코드 처리 완료`);
    }

    console.log(`${movies.length}개의 영화 데이터가 성공적으로 추가되었습니다.`);
  } catch (error) {
    console.error('데이터 import 중 오류 발생:', error);
    console.error('오류 상세:', error.message);
  } finally {
    await connection.end();
  }
}

importMovies(); 