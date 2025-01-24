#!/bin/bash

# 스크립트 중단 조건 설정
set -e  # 에러 발생 시 중단
set -u  # 선언되지 않은 변수 사용 시 중단

# 변수 정의
PROJECT_ROOT=$(pwd)  # 현재 작업 디렉토리
SERVICES=("auth" "search" "favorite" "performance" "survey")  # 서비스 목록
DOCKER_COMPOSE_FILE="docker-compose.yaml"

# Docker Compose 빌드 및 실행
echo "Building and starting services..."
for SERVICE in "${SERVICES[@]}"; do
    echo "Deploying ${SERVICE}..."
    (
        cd "${PROJECT_ROOT}/${SERVICE}"
        docker-compose down --remove-orphans
        docker-compose up --build -d
    )
done

# 실행 상태 확인
echo "Checking running containers..."
docker ps

# 테스트 엔드포인트
echo "Testing service health endpoints..."
for SERVICE in "${SERVICES[@]}"; do
    case $SERVICE in
        auth)
            PORT=5002
            ;;
        search)
            PORT=5006
            ;;
        favorite)
            PORT=5004
            ;;
        performance)
            PORT=5005
            ;;
        survey)
            PORT=5003
            ;;
        *)
            echo "Unknown service: ${SERVICE}"
            exit 1
            ;;
    esac

    echo "Testing ${SERVICE} on port ${PORT}..."
    if curl -fsS "http://localhost:${PORT}/health" > /dev/null; then
        echo "${SERVICE} is healthy!"
    else
        echo "Health check failed for ${SERVICE}."
        exit 1
    fi
done

echo "All services are up and running successfully!"
