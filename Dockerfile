# 1단계: Node.js를 사용해 React 앱을 빌드
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install -g @aws-amplify/cli
RUN npm install ajv ajv-keywords
RUN npm install amazon-cognito-identity-js
RUN npm install jwt-decode

ARG REACT_APP_AWS_USER_POOLS_ID
ARG REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID
ARG REACT_REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID
ARG REACT_APP_AWS_PROJECT_REGION
ARG BACKEND_API_URL

ENV REACT_APP_AWS_USER_POOLS_ID=$REACT_APP_AWS_USER_POOLS_ID
ENV REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID=$REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID
ENV REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=$REACT_REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID
ENV REACT_APP_AWS_PROJECT_REGION=$REACT_APP_AWS_PROJECT_REGION
ENV BACKEND_API_URL=$BACKEND_API_URL

COPY . .

RUN npm run build

# 2단계: Nginx를 사용해 정적 파일 제공
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
