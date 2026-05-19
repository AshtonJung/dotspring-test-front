# Base image 경량 이미지 사용
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim as base

# Build stage
FROM base as build

# Base dir
WORKDIR /app

# 어플리케이션 소스 도커의 /app/src 로 복사
COPY ./src /app/src

# .gitignore 에 있는 파일 제외한 나머지 /app 에 복사
COPY . /app

# 패키지 업데이트 및 빌드에 필요한 파일 설치
RUN set -ex \
    # Upgrade the package index and install security upgrades
	&& apt-get upgrade -y \
	&& apt-get update -y \
    && apt-get install -y python3 build-essential pkg-config \
	# Remove vulnerability packages
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists \
	#  npm repository 사내 Nexus 바라보도록 추가
	#&& npm config set registry=https://nexus.k8s.dlab.kr:1443/repository/npm-repos/ \
	&& npm install -g pnpm --force \
	&& pnpm install   \
	&& pnpm run build \
	&& pnpm prune 

# Run stage
FROM base

# Base dir
WORKDIR /app

# Port 선언
ENV PORT=3000

# Build stage 에서 생성된 배포본인 .output 만 Docker image 에 복사
COPY --from=build /app/.output /app/.output
COPY --from=build /app/.env /app/.env

# .env load, then setup
RUN set -ex \
	&& export $(cat .env | xargs) \
	&& rm -f /app/.env

# 어플리케이션 실행
CMD [ "node", ".output/server/index.mjs" ]