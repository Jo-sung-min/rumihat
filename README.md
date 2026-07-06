# Rumihat Hat Shop

모자 판매 사이트용 Next.js + Spring Boot + PostgreSQL 모노레포입니다.

## Run locally

```bash
cd apps/web
npm install
npm run dev
```

```bash
docker compose up -d db
cd apps/api
./gradlew bootRun
```

## Structure

전체 구조와 DB/API 계획은 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)를 참고하세요.

## Admin

- URL: `/login`, `/admin`
- 임시 계정: `admin@rumihat.local` / `admin1234`
- 현재 상품 등록 데이터는 브라우저 `localStorage`에 저장됩니다.
- 메인 페이지 이미지는 `apps/web/components/HomeContent.tsx`의 `HOME_AREAS`에서 직접 수정합니다.
