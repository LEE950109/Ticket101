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

async function importArtists() {
  const connection = await mysql.createConnection(dbConfig);
  const artists = [];
  let currentId = 1;

  try {
    const csvPath = path.join(__dirname, '..', 'Data', 'artists.csv');
    
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
          if (row.artist_name && row.genre && row.genre_number) {
            artists.push({
              id: currentId++,
              artist_name: row.artist_name,
              genre: row.genre,
              genre_number: row.genre_number
            });
          } else {
            console.log('데이터 누락:', row);
          }
        })
        .on('error', reject)
        .on('end', () => {
          console.log('CSV 파일 읽기 완료. 총 레코드 수:', artists.length);
          resolve();
        });
    });

    // 기존 데이터 삭제
    await connection.execute('TRUNCATE TABLE artists');

    // 배치 처리로 변경
    const batchSize = 1000;
    for (let i = 0; i < artists.length; i += batchSize) {
      const batch = artists.slice(i, i + batchSize);
      const values = batch.map(artist => 
        [artist.id, artist.artist_name, artist.genre, artist.genre_number]
      );
      
      await connection.query(
        'INSERT INTO artists (id, artist_name, genre, genre_number) VALUES ?',
        [values]
      );
      
      console.log(`${i + batch.length}/${artists.length} 레코드 처리 완료`);
    }

    console.log(`${artists.length}개의 아티스트 데이터가 성공적으로 추가되었습니다.`);
  } catch (error) {
    console.error('데이터 import 중 오류 발생:', error);
  } finally {
    await connection.end();
  }
}

importArtists(); 