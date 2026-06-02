# codex_ex01_codespaces202606

Express 기반 자동차 목록 API 예제입니다. 서버는 메모리에 자동차 데이터를 저장하며, 재시작하면 초기 데이터로 돌아갑니다.

## 현재 구성

```text
.
├── server.js
├── package.json
├── package-lock.json
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── .gitignore
└── README.md
```

## 파일 설명

- `server.js`: Express 서버와 자동차 CRUD/search/filter 라우트를 정의하고, 빌드된 React 앱을 정적 파일로 제공합니다.
- `package.json`: 백엔드 실행, 프론트엔드 설치/빌드 스크립트와 Express 의존성을 정의합니다.
- `frontend/`: Vite 기반 React 프론트엔드입니다. `/api/cars` 요청을 Express의 `/cars`로 프록시합니다.
- `README.md`: 저장소 개요와 사용 방법을 설명하는 문서입니다.
- `.gitignore`: Node.js 및 프론트엔드 개발 환경에서 자주 생성되는 로그, 캐시, 빌드 결과물, 환경 변수 파일 등을 Git 추적에서 제외합니다.

## 시작하기

백엔드 API 서버를 실행합니다.

```bash
npm install
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

프론트엔드 개발 서버는 다른 터미널에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

Vite 개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다. React 앱은 `/api/cars`로 요청하고, `frontend/vite.config.js`의 프록시가 Express API의 `/cars`로 전달합니다.

통합 실행용 React 빌드를 만듭니다.

```bash
npm run frontend:install
npm run build
npm start
```

빌드 후에는 Express가 `http://localhost:3000`에서 REST API와 React 화면을 함께 제공합니다.

## API 사용 예시

전체 자동차 목록을 조회합니다.

```bash
curl http://localhost:3000/cars
```

특정 제조사의 자동차만 검색합니다.

```bash
curl "http://localhost:3000/cars/search?company=HYUNDAI"
```

`company` 값을 생략하면 전체 목록을 반환합니다.

```bash
curl http://localhost:3000/cars/search
```

가격 범위에 맞는 자동차만 필터링합니다.

```bash
curl "http://localhost:3000/cars/filter?minPrice=2000&maxPrice=3000"
curl "http://localhost:3000/cars/filter?minPrice=2500"
curl "http://localhost:3000/cars/filter?maxPrice=2500"
```

자동차를 추가합니다.

```bash
curl -X POST http://localhost:3000/cars \
  -H "Content-Type: application/json" \
  -d '{"_id":4,"name":"Avante","price":2100,"company":"HYUNDAI","year":2024}'
```

## Git 무시 규칙

현재 `.gitignore`는 다음과 같은 항목을 제외하도록 설정되어 있습니다.

- 로그 파일
- `node_modules/`
- 프론트엔드 빌드 결과물
- 캐시 디렉터리
- `.env` 환경 변수 파일
- TypeScript, Vite, Next.js, Nuxt, SvelteKit 등에서 생성되는 임시 파일
