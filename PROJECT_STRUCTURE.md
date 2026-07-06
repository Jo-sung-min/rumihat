# Rumihat Hat Shop Project Structure

## Goal

Vercel에 배포할 Next.js 프론트엔드와 PostgreSQL을 사용하는 Spring Boot API를 분리한 모자 판매 쇼핑몰을 만든다. UI는 제공된 세 장의 Sebs 스타일 레퍼런스를 기준으로 한다.

## Visual Direction

- Top utility ribbon: 얇은 베이지 띠에 반복 문구를 배치한다.
- Header: 중앙 로고, 좌측 `STORE`/`LOOK`, 우측 아이콘/계정/장바구니 링크.
- Product list: 흰 배경, 검정 1px 라인, 4열 상품 그리드, 큰 제품 이미지, 하트 버튼, 작은 라벨.
- Main page: 큰 이미지 히어로, 3열 editorial/product 혼합 그리드, 하단 대형 라이프스타일 이미지.
- Detail page: 좌측 대형 제품 이미지와 착용 이미지 스트립, 우측 구매 패널, 아래 긴 상세 콘텐츠.
- Footer: 연핑크 배경, 얇은 칸막이 라인, 회사/가이드/고객센터 정보.

## Monorepo Layout

```text
rumihat/
  PROJECT_STRUCTURE.md
  README.md
  docker-compose.yml
  infra/
    schema.sql
  apps/
    web/
      app/
        page.tsx
        admin/page.tsx
        login/page.tsx
        store/page.tsx
        products/[slug]/page.tsx
        products/light-purple/page.tsx
        globals.css
        layout.tsx
      components/
        Header.tsx
        Footer.tsx
        AuthStatus.tsx
        HomeContent.tsx
        ProductCard.tsx
        ProductVisual.tsx
        StoreGrid.tsx
      lib/
        admin-store.ts
        products.ts
      public/reference/
        main-page.png
        product-list.png
        product-detail.png
      next.config.js
      package.json
      tsconfig.json
      vercel.json
    api/
      src/main/java/com/rumihat/shop/
        RumihatShopApplication.java
        product/
        cart/
        order/
      src/main/resources/
        application.yml
      build.gradle
      settings.gradle
```

## Frontend

- Framework: Next.js App Router
- Deployment: Vercel
- Styling: CSS modules 없이 `app/globals.css`에서 브랜드 레이아웃 토큰 관리
- Primary routes:
  - `/`: 메인/editorial 홈
  - `/login`: 관리자 로그인
  - `/admin`: 상품 등록/수정/숨김 관리
  - `/store`: 상품 리스트
  - `/products/[slug]`: 일반 상품 상세
  - `/products/light-purple`: 상품 상세 샘플
- API endpoint environment:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
  - production에서는 Spring API 배포 URL로 교체

## Backend

- Framework: Spring Boot 3
- DB: PostgreSQL
- ORM: Spring Data JPA
- API prefix: `/api`
- Initial endpoints:
  - `GET /api/products`
  - `GET /api/products/{slug}`
  - `POST /api/products`
  - `POST /api/admin/login`
  - `POST /api/carts`
  - `POST /api/orders`

## Database Model

- `products`: 판매 상품의 기본 정보
- `product_images`: 상품별 이미지 목록
- `product_options`: 색상/사이즈/재고/추가금
- `admin_users`: 관리자 계정
- `carts`: 익명 또는 회원 장바구니
- `cart_items`: 장바구니 항목
- `orders`: 주문 헤더
- `order_items`: 주문 상세

## Deployment Notes

- Vercel은 `apps/web`을 루트 디렉터리로 지정한다.
- Spring API는 Render, Railway, Fly.io, AWS, GCP 등 JVM 실행 가능한 환경에 배포한다.
- PostgreSQL은 Neon, Supabase, Railway, RDS 중 하나를 사용한다.
- 결제 연동 전까지는 주문 생성 API를 보류/목업 처리한다.

## Admin Flow

- 임시 관리자 계정: `admin@rumihat.local` / `admin1234`
- 현재 프론트 상품 관리 구현은 Vercel 미리보기에서 바로 확인할 수 있도록 브라우저 `localStorage`에 저장한다.
- 메인 페이지 이미지는 `apps/web/components/HomeContent.tsx`의 `HOME_AREAS` 배열에서 하드코딩으로 관리한다.
- 운영 전환 시 `/api/admin/login`, `/api/products`를 연결하고 상품 이미지 업로드는 S3, Cloudflare R2, Supabase Storage 같은 오브젝트 스토리지로 분리한다.
