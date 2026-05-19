# Nuxt3 + tailwindcss + DaisyUI Template

프로젝트 URL : https://ddsp-front-end-nuxt3-daisyui-template.k8s.dlab.kr:1443

### Install

- node.js 설치 (현재 18.18.1)
  - [https://nodejs.org/en/download](https://nodejs.org/en/download)
  ```bash
  node -v
  ```
- npm repository 사내 nexus 로 변경 (optional)

```bash
npm config set registry=https://nexus.k8s.dlab.kr:1443/repository/npm-repos/
```

- npx, yarn, pnpm 설치 (기본 = pnpm)

```bash
npm install npx -g
npm install yarn -g
npm install pnpm -g
```

- 기본 패키지 매니저: pnpm 으로 설정

  - Why use pnpm
    - https://jeonghwan-kim.github.io/2023/10/20/pnpm

- Download vscode

  - [https://code.visualstudio.com/download](https://code.visualstudio.com/download)

- vscode extensions (확장) 설치
  - Volar, ESLint, Prettier - Code formatter, tailwind css intellisense, ~~vetur~~, ~~vue3 snippets~~, vue vscode snippets

### Run project

- git clone

```bash
git clone http://dev.dlab.kr:16080/ddsp/front-end/nuxt3-daisyui-template.git
```

- shell 에서 실행

```bash
cd nuxt3-daisyui-template

pnpm install

pnpm run dev
```

- vscode 에서 실행

```bash
code nuxt3-daisyui-template

pnpm install

pnpm run dev
```

- Test
  - curl [http://localhost:3000](http://localhost:3000)
  - 또는 브라우저 실행, 접속

  - 메인페이지 접속 : http://localhost:3000/opendate/home

### Nuxt3 디렉토리 구조

```
├── .nuxt
├── src
│   ├── assets
│   ├── components
│   ├── composables
│   ├── layouts
│   ├── middleware
│   ├── pages
│   ├── plugins
│   └── public
│   └── server
```

- `.nuxt` : Vue 애플리케이션을 생성하는데 필요한 모든 것을 포함하는 디렉토리
  - `.nuxt` 디렉토리에 있는 파일은 변경하지 않아야 한다.
- `assets` : SASS, JS, 이미지 등 컴파일되지 않는 파일을 포함하는 디렉토리
- `components` : 페이지로 가져오는 모든 Vue 컴포넌트를 저장하는 디렉토리
  - 설정 파일에서 컴포넌트 `true`로 설정하면 `<script>`에서 import할 필요 없이 Nuxt가 컴포넌트를 자동으로 가져온다.
- `composables` : 재사용 가능한 함수 등을 저장하는 디렉토리
- `layouts` : 페이지의 구조를 저장하는 디렉토리 (e.g. `header`, `footer`)
- `middleware` : 애플리케이션 전체에 사용자 정의 가능한 경로 미들웨어 프레임워크를 포함할 수 있어 특정 경로를 접근하기 전에 실행하려는 코드를 추출할 수 있다. 이 `middleware`는 Nuxt 애플리케이션의 Vue 부분인 클라이언트 측에서만 실행된다.
  - 경로 미들웨어 3가지
    - 익명 경로 미들웨어 : 사용되는 페이지에서 직접 정의
    - 명명된 라우트 미들웨어 : 미들웨어/디렉토리에 배치, 페이지에서 사용될 때 비동기로 가져와 자동으로 로드
    - 글로벌 라우트 미들웨어 : 미들웨어/디렉토리에 배치, 경로가 변경될 때마다 자동으로 실행
- `pages` : 애플리케이션의 뷰와 경로를 포함하는 디렉토리
  - Nuxt는 이 디렉토리 내의 모든 vue 파일을 라우터로 생성한다.
- `plugins` : 기능을 추가하는 독립형 코드를 담은 디렉토리
  - Nuxt는 플러그인 디렉토리에 있는 파일을 자동으로 읽고 Vue를 생성할 때 로드한다. `plugins` 디렉토리에 있는 모든 플러그인은 자동 등록되므로 `nuxt.config.ts`에 추가할 필요가 없다.
- `public` : 서버 루트에 직접 제공하기 때문에 이름을 유지해야 하는 파일(e.g. `robots.txt`)이나 변경하지 않을 가능성이 높은 파일(e.g. `favicon.ico`)을 포함하는 디렉토리
  - Nuxt 2 버전에서는 `static` 폴더명으로 사용하였다.
- `server` : The server/ directory is used to register API and server handlers to your application.
  - Nuxt automatically scans files inside these directories to register API and server handlers with Hot Module Replacement (HMR) support.

```
-| server/
---| api/
-----| hello.ts      # /api/hello
---| routes/
-----| bonjour.ts    # /bonjour
---| middleware/
-----| log.ts        # log all requests
```
