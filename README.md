# Rumihat Hat Shop

모자 판매 사이트용 Next.js + Spring Boot + PostgreSQL 모노레포입니다.

## Run locally

먼저 루트의 [example.env](example.env)을 복사해서 `.env`를 만들고 DB/OAuth 정보를 입력하세요. `.env`는 git에 올라가지 않습니다.

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/rumihat
DATABASE_USERNAME=rumihat
DATABASE_PASSWORD=your-password
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

```bash
cd apps/web
npm install
npm run dev
```

루트에서 실행할 때는 아래 명령을 사용할 수 있습니다.

```bash
npm run dev
```

API도 루트에서 실행할 수 있습니다.

```bash
npm run dev:api
```

## Vercel

루트 디렉터리로 import해도 `vercel.json`이 `apps/web`을 빌드하도록 설정되어 있습니다. Vercel 프로젝트 설정에서 Root Directory를 직접 지정한다면 `apps/web`으로 지정해도 됩니다.

```bash
docker compose up -d db
cd apps/api
.\gradlew.bat bootRun
```

로컬 DBeaver/PostgreSQL에 직접 만든 DB를 사용할 때 기본 연결값은 아래와 같습니다.

```text
host: localhost
port: 5432
database: rumihat
username: rumihat
password: rumihat
```

다른 계정으로 만들었다면 `.env`의 `DATABASE_USERNAME`, `DATABASE_PASSWORD`를 바꾸면 됩니다. `npm run dev:api` 또는 `apps/api/gradlew.bat -p apps/api bootRun`은 루트 `.env`를 자동으로 읽습니다.

프론트는 기본으로 `http://localhost:8080` API를 봅니다. 필요하면 [apps/web/.env.local.example](apps/web/.env.local.example)을 복사해서 `apps/web/.env.local`을 만들고 아래 값을 넣습니다.

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Structure

전체 구조와 DB/API 계획은 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)를 참고하세요.

## Admin

- URL: `/login`, `/admin`
- 임시 계정은 `.env`의 `ADMIN_EMAIL`, `ADMIN_PASSWORD`로 설정합니다.
- 현재 상품 등록 데이터는 브라우저 `localStorage`에 저장됩니다.
- 메인 페이지 이미지는 `apps/web/components/HomeContent.tsx`의 `HOME_AREAS`에서 직접 수정합니다.
