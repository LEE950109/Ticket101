FROM node:18-alpine

WORKDIR /usr/src/app

# package.json 복사 및 의존성 설치
COPY auth/package*.json ./
RUN npm install --only=production

# 소스 코드 복사
COPY auth/src/ ./src/

# shared 디렉토리 복사
COPY ./shared /usr/src/app/shared

EXPOSE ${AUTH_PORT}
CMD ["node", "src/app.js"]
