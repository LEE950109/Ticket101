FROM node:18-alpine

WORKDIR /usr/src/app

# 패키지 파일 복사 및 의존성 설치
COPY package.json ./
RUN npm install --only=production
RUN npm install -g @aws-amplify/cli
RUN npm install -g @aws-sdk/lib-dynamodb

ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

ARG ACCESS_KEY_ID
ENV ACCESS_KEY_ID=$ACCESS_KEY_ID

ARG SECRET_ACCESS_KEY
ENV SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY
# AWS SDK 설치


RUN npm install aws-sdk

# 소스 코드 복사
COPY . .

# 환경 변수 파일 포함
# COPY .env .env

EXPOSE 5002
CMD ["node", "app.js"]

