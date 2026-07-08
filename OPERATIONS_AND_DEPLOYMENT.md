# Rumihat 운영 및 배포 가이드

이 문서는 이 프로젝트를 로컬에서 실행하고, 프론트엔드/백엔드/DB를 운영 환경에 배포할 때 따라야 할 절차를 정리한다.

## 1. 프로젝트 구성

현재 저장소는 하나의 Git 저장소 안에 프론트엔드와 백엔드가 같이 있는 모노레포 구조다.

```text
darim/
  apps/
    web/  Next.js 프론트엔드
    api/  Spring Boot API 서버
  infra/  DB 초기 스키마
  docker-compose.yml
```

역할은 다음처럼 나뉜다.

| 영역 | 위치 | 역할 | 배포 위치 |
| --- | --- | --- | --- |
| Frontend | `apps/web` | 쇼핑몰 화면, 관리자 화면 | Vercel |
| Backend API | `apps/api` | 상품 API, 관리자 로그인 API, 주문/장바구니 API | Render, Railway, Fly.io, AWS, GCP 등 |
| Database | PostgreSQL | 상품/주문/장바구니 데이터 저장 | Neon, Supabase, Railway, RDS 등 |

중요: `apps/api/bin/main/*` 파일은 빌드 결과물이다. 설정을 수정할 때는 `apps/api/src/main/resources/application.yml` 또는 `.env`를 수정해야 한다.

## 2. 결론: Vercel에는 무엇을 올려야 하나?

Vercel에는 **프론트엔드만 배포**한다.

이 프로젝트를 GitHub에 통째로 올리는 것은 괜찮다. 다만 Vercel 프로젝트는 저장소 전체를 가져오더라도 빌드 대상은 `apps/web`이어야 한다.

선택지는 두 가지다.

1. GitHub에는 프로젝트 전체를 올리고, Vercel에서 Root Directory를 `apps/web`으로 지정한다.
2. GitHub에는 프로젝트 전체를 올리고, 루트의 `vercel.json` 설정으로 `apps/web`만 빌드하게 둔다.

현재 저장소에는 루트 `vercel.json`이 있으므로 2번 방식도 가능하다. 그래도 Vercel UI에서 Root Directory를 `apps/web`으로 명시하는 방식이 관리하기 가장 쉽다.

Spring Boot API는 Vercel에 같이 배포하지 않는다. Vercel은 Next.js 프론트엔드 배포에 적합하고, 이 프로젝트의 Spring Boot 서버처럼 계속 떠 있어야 하는 JVM 서버는 별도 백엔드 호스팅에 배포해야 한다.

## 3. DB는 따로 띄워야 하나?

예. 운영 환경에서는 PostgreSQL DB를 별도로 준비해야 한다.

로컬 개발에서는 `docker-compose.yml`로 PostgreSQL을 띄울 수 있다.

운영 배포에서는 다음 중 하나를 선택한다.

| 서비스 | 특징 |
| --- | --- |
| Neon | 서버리스 PostgreSQL, Vercel과 조합하기 쉬움 |
| Supabase | PostgreSQL + Storage/Auth 등 확장 기능 |
| Railway | API 서버와 DB를 같이 운영하기 쉬움 |
| AWS RDS | 실서비스 운영에 적합하지만 설정이 무거움 |

초기에는 Neon, Supabase, Railway 중 하나가 편하다.

## 4. 로컬 실행 절차

### 4.1 환경 변수 준비

루트의 `example.env` 또는 `.env.example`을 복사해서 `.env`를 만든다.

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/rumihat
DATABASE_USERNAME=rumihat
DATABASE_PASSWORD=your-local-password
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

주의: 실제 비밀번호가 들어간 `.env`는 Git에 올리면 안 된다.

### 4.2 PostgreSQL 실행

Docker가 설치되어 있다면 루트에서 실행한다.

```bash
docker compose up -d db
```

기본 DB 정보는 `docker-compose.yml` 기준으로 다음과 같다.

```text
host: localhost
port: 5432
database: rumihat
username: rumihat
password: docker-compose.yml의 POSTGRES_PASSWORD 값
```

이미 PC에 직접 설치한 PostgreSQL을 쓴다면 Docker DB를 띄우지 않아도 된다. 대신 `.env`의 `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`가 실제 DB와 맞아야 한다.

### 4.3 API 서버 실행

루트 또는 `apps/api`에서 Spring Boot를 실행한다.

```bash
cd apps/api
gradle bootRun
```

정상 실행되면 API는 기본적으로 아래 주소에서 뜬다.

```text
http://localhost:8080
```

확인 URL:

```text
http://localhost:8080/api/products
```

### 4.4 프론트엔드 실행

루트에서 실행할 수 있다.

```bash
npm install
npm run dev
```

또는 `apps/web`에서 직접 실행할 수 있다.

```bash
cd apps/web
npm install
npm run dev
```

프론트엔드는 기본적으로 아래 주소에서 뜬다.

```text
http://localhost:3000
```

프론트가 호출할 API 주소는 `apps/web/.env.local`에 지정한다.

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 5. 운영 배포 절차

### 5.1 GitHub에 올리기 전 확인

아래 파일은 Git에 올라가면 안 된다.

```text
.env
apps/api/.env
apps/web/.env.local
apps/api/src/main/resources/application-local.yml
```

현재 `apps/api/bin/`, `apps/api/build/`, `.gradle/` 같은 빌드 결과물도 Git에 올릴 필요가 없다.

### 5.2 DB 만들기

Neon, Supabase, Railway, RDS 등에서 PostgreSQL DB를 만든다.

만든 뒤 아래 값을 확보한다.

```text
DB host
DB port
DB name
DB username
DB password
```

Spring Boot의 `DATABASE_URL` 형식은 다음처럼 맞춘다.

```text
jdbc:postgresql://HOST:PORT/DB_NAME
```

예:

```text
DATABASE_URL=jdbc:postgresql://example.neon.tech:5432/rumihat
DATABASE_USERNAME=rumihat_owner
DATABASE_PASSWORD=실제비밀번호
```

### 5.3 Spring Boot API 배포

API 서버는 Render, Railway, Fly.io, AWS, GCP 같은 JVM 실행 가능한 곳에 배포한다.

백엔드 서비스 환경 변수:

```text
DATABASE_URL=jdbc:postgresql://운영DB주소:5432/DB이름
DATABASE_USERNAME=운영DB계정
DATABASE_PASSWORD=운영DB비밀번호
CORS_ALLOWED_ORIGINS=https://프론트도메인.vercel.app
```

빌드/실행 명령은 배포 서비스에 맞춰 설정한다.

```bash
gradle build
```

실행:

```bash
java -jar build/libs/*.jar
```

배포 서비스에서 Root Directory를 지정할 수 있다면 `apps/api`로 지정한다.

### 5.4 Vercel 프론트엔드 배포

Vercel에서 GitHub 저장소를 Import한다.

권장 설정:

```text
Framework Preset: Next.js
Root Directory: apps/web
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Vercel 환경 변수:

```text
NEXT_PUBLIC_API_BASE_URL=https://배포된-api-주소
```

예:

```text
NEXT_PUBLIC_API_BASE_URL=https://rumihat-api.onrender.com
```

주의: `NEXT_PUBLIC_`으로 시작하는 값은 브라우저에 공개된다. API 서버 주소처럼 공개되어도 되는 값만 넣는다.

### 5.5 CORS 설정

프론트가 Vercel에 배포되면 API 서버의 `CORS_ALLOWED_ORIGINS`에 Vercel 도메인을 넣어야 한다.

예:

```text
CORS_ALLOWED_ORIGINS=https://rumihat.vercel.app
```

프리뷰 배포까지 허용하려면 여러 origin을 콤마로 넣는다.

```text
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://rumihat.vercel.app,https://rumihat-git-main-yourname.vercel.app
```

### 5.6 Google/Kakao OAuth 설정

OAuth 로그인은 Spring Boot API에서 시작하고, 성공 후 프론트 로그인 페이지로 돌아온다.

프론트 버튼이 이동하는 주소:

```text
Google: http://localhost:8080/oauth2/authorization/google
Kakao:  http://localhost:8080/oauth2/authorization/kakao
```

로컬 Redirect URI:

```text
Google: http://localhost:8080/login/oauth2/code/google
Kakao:  http://localhost:8080/login/oauth2/code/kakao
```

운영 Redirect URI는 API 배포 도메인 기준으로 등록한다.

```text
Google: https://배포된-api-주소/login/oauth2/code/google
Kakao:  https://배포된-api-주소/login/oauth2/code/kakao
```

API 서버 환경 변수:

```text
GOOGLE_OAUTH_CLIENT_ID=Google에서 발급받은 Client ID
GOOGLE_OAUTH_CLIENT_SECRET=Google에서 발급받은 Client Secret
KAKAO_OAUTH_CLIENT_ID=Kakao REST API 키
KAKAO_OAUTH_CLIENT_SECRET=Kakao Client Secret
OAUTH_REDIRECT_BASE_URL=https://배포된-api-주소
FRONTEND_AUTH_SUCCESS_URL=https://프론트도메인.vercel.app/login
FRONTEND_AUTH_FAILURE_URL=https://프론트도메인.vercel.app/login?oauth=failed
```

Vercel 프론트 환경 변수:

```text
NEXT_PUBLIC_API_BASE_URL=https://배포된-api-주소
```

현재 OAuth 성공 토큰은 임시 UUID다. 운영 전에는 DB 사용자 저장, JWT 발급, 관리자 권한 검증으로 바꿔야 한다.

## 6. 현재 구현 상태에서 주의할 점

관리자 로그인 계정은 `.env`의 `ADMIN_EMAIL`, `ADMIN_PASSWORD`에서 읽는다.

```text
ADMIN_EMAIL=admin@rumihat.local
ADMIN_PASSWORD=change-me
```

운영 전에는 반드시 DB 기반 관리자 계정, 비밀번호 해시, 세션/JWT 인증으로 바꿔야 한다.

상품 관리는 API 호출을 시도하지만, 실패하면 브라우저 `localStorage`에 저장하는 fallback이 있다. 운영에서는 API와 DB가 정상 연결되어야 여러 기기에서 같은 상품 데이터를 볼 수 있다.

이미지 업로드 기능은 아직 별도 스토리지와 연결되어 있지 않다. 운영에서는 S3, Cloudflare R2, Supabase Storage 같은 오브젝트 스토리지에 이미지를 올리고, DB에는 이미지 URL만 저장하는 방식이 적합하다.

## 7. 실행 중인 서버 확인 및 종료

포트 확인:

```powershell
netstat -ano
```

8080을 사용하는 프로세스가 API 서버다.

```text
0.0.0.0:8080 LISTENING PID
```

종료:

```powershell
Stop-Process -Id PID번호
```

예:

```powershell
Stop-Process -Id 7072
```

## 8. 추천 운영 순서

1. 로컬에서 Docker PostgreSQL 실행
2. 로컬에서 Spring Boot API 실행
3. 로컬에서 Next.js 프론트 실행
4. 상품 등록/조회가 DB를 통해 동작하는지 확인
5. 운영 PostgreSQL 생성
6. Spring Boot API를 백엔드 호스팅에 배포
7. Vercel에 `apps/web` 프론트 배포
8. Vercel의 `NEXT_PUBLIC_API_BASE_URL`을 운영 API 주소로 설정
9. API의 `CORS_ALLOWED_ORIGINS`를 Vercel 도메인으로 설정
10. 관리자 인증, 이미지 업로드, 주문/결제 흐름을 운영용으로 보강

## 9. 한 줄 요약

GitHub에는 프로젝트 전체를 올려도 된다. 하지만 배포는 분리한다. `apps/web`은 Vercel, `apps/api`는 별도 Spring Boot 서버, PostgreSQL은 별도 DB 서비스에 올리는 구조가 맞다.
