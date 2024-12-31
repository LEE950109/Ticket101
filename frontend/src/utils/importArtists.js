const mysql = require('mysql2/promise');
const csv = require('fast-csv');
const fs = require('fs');

const dbConfig = {
  host: '192.168.0.11',
  port: 3306,
  user: 'myuser',
  password: 'welcome1!',
  database: 'ticket_system'
};

async function importArtists() {
  const connection = await mysql.createConnection(dbConfig);
  const artists = [];

  try {
    // CSV 파일 읽기
    await new Promise((resolve, reject) => {
      fs.createReadStream('artists.csv')
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          // 데이터 유효성 검사 추가
          if (row.name && row.genre) {
            artists.push(row);
          } else {
            console.log('잘못된 데이터:', row); // 문제가 있는 데이터 출력
          }
        })
        .on('error', reject)
        .on('end', resolve);
    });

    console.log('읽어온 데이터:', artists); // 전체 데이터 확인

    // 데이터 삽입
    for (const artist of artists) {
      console.log('삽입 시도:', artist); // 각 삽입 시도 확인
      await connection.execute(
        'INSERT INTO artists (name, genre) VALUES (?, ?)',
        [artist.name, artist.genre]
      );
    }

    console.log(`${artists.length}개의 아티스트 데이터가 성공적으로 추가되었습니다.`);
  } catch (error) {
    console.error('데이터 import 중 오류 발생:', error);
    console.error('오류 발생 시점의 데이터:', artists); // 오류 발생 시점의 데이터 확인
  } finally {
    await connection.end();
  }
}

importArtists(); 