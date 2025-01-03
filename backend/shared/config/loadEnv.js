const dotenv = require('dotenv');
const path = require('path');

const loadEnv = () => {
  // Docker 환경에서는 환경변수가 이미 설정되어 있으므로 파일 로드 스킵
  if (process.env.NODE_ENV === 'production') {
    return process.env; // production 모드에서도 process.env 반환
  }

  // 개발 환경에서만 .env 파일 로드
  const result = dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
  });

  if (result.error) {
    console.warn('Warning: .env file not found or could not be loaded. Using existing environment variables.');
  }

  return process.env; // process.env 반환
};

module.exports = loadEnv;
