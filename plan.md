# Rumihat 구현 계획

Rumihat은 처음에는 감도 있는 모자 쇼핑몰로 시작하고, 운영 데이터와 브랜드 톤이 쌓이면 의류까지 확장하는 방향으로 만든다. 초반 목표는 많은 기능을 얇게 넣는 것이 아니라, 상품을 예쁘게 보여주고 실제 주문까지 받을 수 있는 작고 단단한 쇼핑몰을 완성하는 것이다.

## 1. 제품 방향

### 1.1 초기 콘셉트

- 메인 상품군: 볼캡, 워싱 캡, 코튼 캡, 협업 라인
- 톤: 미니멀하지만 평범하지 않은 스트리트/편집숍 감성
- 화면 느낌: 흰 배경, 검정 라인, 큰 이미지, 에디토리얼 컷, 브랜드 문구 반복
- 핵심 경험: 제품을 빠르게 훑고, 디테일 이미지를 보고, 옵션을 고르고, 장바구니/주문으로 이어지는 흐름

### 1.2 확장 방향

모자에서 시작하되 상품 구조는 처음부터 의류 확장을 고려한다.

- 1차 카테고리: `CAP`
- 2차 카테고리: `BEANIE`, `HAT`
- 확장 카테고리: `TOP`, `BOTTOM`, `OUTER`, `BAG`, `ACCESSORY`
- 의류 확장 시 필요한 정보: 사이즈, 핏, 소재, 세탁법, 모델 착용 정보, 재고 옵션

## 2. 우선순위 요약

| 단계 | 목표 | 상태 |
| --- | --- | --- |
| Phase 1 | 운영 가능한 상품/관리자/DB 기반 만들기 | 진행 중 |
| Phase 2 | 로그인, 장바구니, 주문 흐름 완성 | 진행 중 |
| Phase 3 | 결제, 배송, 주문 관리 연결 | 진행 필요 |
| Phase 4 | 이미지 업로드, 상세 페이지 고도화 | 진행 필요 |
| Phase 5 | 의류 카테고리 확장 구조 적용 | 이후 진행 |

## 3. Phase 1: 쇼핑몰 운영 기본기

### 3.1 상품 데이터 구조 정리

현재 상품은 모자 중심이지만, 의류 확장을 위해 `products`를 범용 상품 모델로 정리해야 한다.

필요 구현:

- 상품 카테고리 필드 추가: 완료
- 상품 상태 추가: `draft`, `active`, `hidden`, `sold_out`: 완료
- 대표 이미지와 상세 이미지 분리: 기본 구조 완료
- 가격, 할인 가격, 뱃지, 노출 순서 관리: 완료
- 소재, 세탁법, 상세 설명 필드 정리: 완료
- 상품 옵션 테이블 분리: 기본 구조 완료
- 이미지 파일 업로드 스토리지 연결: 남음

권장 상품 구조:

```text
products
  id
  slug
  category
  name
  summary
  description
  price
  sale_price
  badge
  status
  display_order
  material
  care
  created_at
  updated_at

product_images
  id
  product_id
  image_url
  image_type
  sort_order

product_options
  id
  product_id
  color_name
  size_name
  stock_quantity
  extra_price
```

### 3.2 관리자 상품 관리

관리자 화면은 실제 운영자가 매일 쓰는 도구가 되어야 한다.

필요 구현:

- 상품 등록: 완료
- 상품 수정: 완료
- 상품 숨김/노출: 완료
- 상품 삭제 대신 비활성화 처리: 완료
- 대표 이미지 업로드: 브라우저 파일 읽기 방식 완료, 외부 스토리지 연결 남음
- 상세 이미지 여러 장 업로드: 브라우저 파일 읽기 방식 완료, 외부 스토리지 연결 남음
- 옵션별 재고 등록: 완료
- 상품 순서 변경: 숫자 입력 방식 완료
- 카테고리 선택: 완료

중요:

- 브라우저 `localStorage` fallback은 개발 편의용으로만 유지한다.
- 운영에서는 반드시 API + DB 기준으로 상품이 저장되어야 한다.

### 3.3 이미지 업로드

현재 이미지 데이터 URL 저장 방식은 운영에 맞지 않다. 이미지 파일은 별도 스토리지에 저장하고 DB에는 URL만 저장한다.

후보:

- Supabase Storage
- Cloudflare R2
- AWS S3

초기 추천:

- DB를 Supabase로 선택하면 Supabase Storage
- DB를 Neon으로 선택하면 Cloudflare R2 또는 S3

필요 구현:

- 관리자 이미지 업로드 API
- 이미지 파일 용량 제한
- 이미지 타입 검증
- 업로드 후 URL 저장
- 대표 이미지/상세 이미지 구분

## 4. Phase 2: 회원, 로그인, 장바구니

### 4.1 로그인 구조

현재 구성:

- 이메일/비밀번호 관리자 로그인
- Google OAuth 구성
- Kakao OAuth 구성

추가 필요:

- 일반 고객 회원 테이블: 남음
- 관리자 계정 테이블
- OAuth 로그인 사용자 저장: 브라우저 세션 프로필 기본 구조 완료, DB 저장 남음
- JWT 또는 세션 기반 인증: 임시 토큰 저장 구조 완료, 서버 검증 남음
- 관리자 권한과 일반 고객 권한 분리: 남음

권장 구조:

```text
users
  id
  email
  name
  phone
  role
  provider
  provider_id
  created_at
  updated_at

admin_users
  id
  email
  password_hash
  role
  created_at
```

운영 전 필수:

- 관리자 비밀번호 해시 처리
- 임시 UUID 토큰 제거
- API 권한 체크 적용
- `/api/admin/**` 보호

### 4.2 장바구니

장바구니는 비회원과 회원 모두 사용할 수 있어야 한다.

필요 구현:

- 상품 옵션 선택 후 장바구니 담기: 완료
- 장바구니 수량 변경: 완료
- 장바구니 상품 삭제: 완료
- 품절/재고 부족 검증
- 로그인 후 비회원 장바구니 병합: 로컬 장바구니 유지 방식으로 기본 처리, 서버 병합 남음

### 4.3 마이페이지

초기에는 최소 기능만 만든다.

필요 구현:

- 주문 내역: 로그인 사용자 이메일 헤더 기준 서버 주문 조회 + 로컬 fallback 완료
- 배송지 정보: checkout 입력 흐름 및 주문 저장 완료, 주소록 관리 남음
- 회원 정보: 로그인 세션 프로필 표시 완료
- 로그아웃: 완료

### 4.4 관리자 결제 요청 처리

필요 구현:

- 결제 요청 목록 조회: 완료
- 주문 상태 변경: 완료
- Excel 다운로드용 CSV export: 완료
- 관리자 권한으로 주문 API 보호: 남음

## 5. Phase 3: 주문, 결제, 배송

### 5.1 주문 생성

필요 구현:

- 주문자 정보 입력
- 배송지 입력
- 상품 금액 계산
- 배송비 계산
- 할인 금액 계산
- 최종 결제 금액 계산
- 주문 번호 생성

주문 테이블:

```text
orders
  id
  order_number
  user_id
  buyer_name
  buyer_phone
  receiver_name
  receiver_phone
  shipping_address
  subtotal_amount
  shipping_fee
  discount_amount
  total_amount
  payment_status
  order_status
  created_at

order_items
  id
  order_id
  product_id
  option_id
  product_name
  option_name
  quantity
  unit_price
  total_price
```

### 5.2 결제 연동

한국 쇼핑몰 기준으로 선택지:

- Toss Payments
- PortOne
- Naver Pay
- Kakao Pay

초기 추천:

- Toss Payments 또는 PortOne

필요 구현:

- 결제 요청 생성
- 결제 성공 검증
- 결제 실패 처리
- 결제 취소/환불 처리
- 주문 상태 업데이트

### 5.3 배송 관리

초기에는 수동 배송 관리로 시작해도 된다.

필요 구현:

- 관리자 주문 목록
- 주문 상태 변경
- 운송장 번호 입력
- 고객 주문 상태 표시

주문 상태 예시:

```text
pending_payment
paid
preparing
shipped
delivered
cancelled
refunded
```

## 6. Phase 4: 브랜드 경험 고도화

### 6.1 메인 페이지

느낌 있는 쇼핑몰은 상품 목록만으로 완성되지 않는다. 메인 페이지는 브랜드 룩북처럼 보여야 한다.

필요 구현:

- 시즌 캠페인 이미지 관리
- 메인 히어로 이미지 관리
- 에디토리얼 섹션 관리
- 추천 상품 섹션
- 신상품 섹션
- 모바일에서 이미지 비율 최적화

관리자에서 바꿀 수 있어야 하는 것:

- 메인 히어로 이미지
- 히어로 링크
- 섹션 제목
- 노출 상품
- 룩북 이미지

### 6.2 상품 상세 페이지

모자 사이트의 상세 페이지는 착용감과 분위기가 중요하다.

필요 구현:

- 대표 이미지
- 착용 이미지
- 상세 이미지
- 소재/사이즈/세탁 정보
- 옵션 선택
- 재고 표시
- 관련 상품
- 최근 본 상품

의류 확장 시 추가:

- 사이즈 차트
- 모델 키/몸무게/착용 사이즈
- 핏 정보
- 색상별 이미지

### 6.3 검색과 필터

초기에는 단순 필터부터 만든다.

필요 구현:

- 카테고리 필터
- 가격대 필터
- 색상 필터
- 신상품/인기/가격순 정렬
- 검색어 기반 상품 검색

## 7. Phase 5: 의류 확장

의류를 팔기 시작할 때 가장 중요한 것은 옵션과 상세 정보다. 모자는 색상 중심 옵션으로 충분하지만, 의류는 사이즈와 핏 정보가 필요하다.

### 7.1 카테고리 확장

카테고리 구조:

```text
CAP
HAT
BEANIE
TOP
BOTTOM
OUTER
BAG
ACCESSORY
```

URL 구조:

```text
/store
/store?category=cap
/store?category=top
/products/[slug]
```

나중에 카테고리 페이지가 커지면 아래처럼 분리할 수 있다.

```text
/categories/cap
/categories/top
/categories/outer
```

### 7.2 사이즈 시스템

의류 확장을 위해 옵션을 유연하게 만든다.

예:

```text
모자: color
상의: color + size
하의: color + waist_size
아우터: color + size
```

필요 구현:

- 옵션명 자유 입력
- 옵션 조합별 재고
- 품절 옵션 비활성화
- 사이즈 가이드 관리

### 7.3 의류 상세 정보

추가 필드:

- size_chart
- model_info
- fit
- fabric
- season
- country_of_origin

## 8. 운영 전 반드시 해야 할 것

### 8.1 보안

- `.env` 실제 값 Git 제외 확인
- 관리자 비밀번호 해시 처리
- 관리자 API 인증 적용
- CORS 운영 도메인만 허용
- OAuth redirect URI 운영 도메인으로 등록
- 이미지 업로드 파일 검증

### 8.2 데이터

- 상품 저장이 DB 기준으로 동작하는지 확인
- 브라우저 localStorage fallback 제거 또는 개발 모드 전용 처리
- 운영 DB 백업 정책 정하기
- 상품 삭제는 soft delete로 처리

### 8.3 배포

- Vercel에는 `apps/web`만 배포
- Spring Boot API는 별도 서버에 배포
- PostgreSQL은 별도 DB 서비스 사용
- Vercel 환경변수 `NEXT_PUBLIC_API_BASE_URL` 설정
- API 환경변수 `DATABASE_*`, `CORS_ALLOWED_ORIGINS`, OAuth 값 설정

## 9. 추천 작업 순서

1. DB 상품 모델을 의류 확장 가능한 구조로 정리
2. 상품 API를 DB 기준으로 안정화
3. 관리자 상품 등록/수정/노출 관리 완성
4. 이미지 업로드를 외부 스토리지로 분리
5. 로그인/JWT/관리자 권한 보호 완성
6. 장바구니 API와 화면 구현
7. 주문 생성 API와 주문 화면 구현: 기본 완료
8. 결제 연동
9. 관리자 주문 관리 구현
10. 메인 페이지와 룩북 관리 기능 구현
11. 검색/필터/정렬 구현
12. 의류 카테고리와 사이즈 차트 확장

## 10. 당장 다음에 할 작업

가장 먼저 해야 할 작업은 상품과 관리자 기능을 운영 가능한 수준으로 만드는 것이다.

다음 작업 묶음:

- `products` 모델에 `category`, `status`, `displayOrder` 추가
- `product_images`, `product_options` 테이블/API 구현
- 관리자 화면에서 카테고리, 상태, 상세 이미지, 옵션 재고 관리
- 관리자 API 보호
- 이미지 업로드 스토리지 선택

이 묶음이 끝나면 쇼핑몰은 “보이는 사이트”에서 “운영 가능한 사이트”로 넘어간다.
