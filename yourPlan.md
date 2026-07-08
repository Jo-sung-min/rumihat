# Your Plan

## Phase 3에서 직접 진행해야 하는 외부 연동

아래 작업은 외부 서비스 계정, 운영 도메인, API 키가 필요해서 코드만으로 완결할 수 없습니다.

### 1. 실제 결제 PG 연동

- Toss Payments 또는 PortOne 중 하나를 선택합니다.
- 상점 관리자 콘솔에서 테스트/운영 API 키를 발급합니다.
- 프론트 환경변수에 client key를 넣습니다.
- API 서버 환경변수에 secret key를 넣습니다.
- 결제 승인 콜백 URL과 실패 URL을 운영 도메인 기준으로 등록합니다.
- 서버에서 결제 승인 API를 호출해 금액, 주문번호, 결제키를 검증해야 합니다.
- 검증 성공 시 `orders.payment_status`를 `PAID`, `orders.status`를 `PAID`로 바꿉니다.
- 검증 실패 시 주문을 `CANCELLED` 또는 `PAYMENT_FAILED` 상태로 처리합니다.

### 2. 카카오페이 직접 연동

- Kakao Developers에서 애플리케이션을 만들고 KakaoPay 권한/가맹 설정을 완료합니다.
- CID, admin key, approval/cancel/fail URL을 준비합니다.
- 결제 ready 요청, redirect, approve 요청을 서버 API로 구현합니다.
- 승인 금액과 주문 금액이 같은지 서버에서 검증합니다.

### 3. 카카오 OAuth 운영 설정

- Kakao Developers에 운영 도메인을 등록합니다.
- Redirect URI를 `https://운영-api도메인/login/oauth2/code/kakao`로 등록합니다.
- `.env`에 `KAKAO_OAUTH_CLIENT_ID`, `KAKAO_OAUTH_CLIENT_SECRET`, `OAUTH_REDIRECT_BASE_URL`을 운영값으로 설정합니다.
- 로그인 성공 후 프론트 이동 주소 `FRONTEND_AUTH_SUCCESS_URL`도 운영 도메인으로 바꿉니다.

### 4. 배송 관리 고도화

- 택배사 코드와 송장번호 입력 필드를 주문 테이블에 추가합니다.
- 관리자에서 배송상태 변경 시 고객 마이페이지에 바로 반영되게 합니다.
- 문자/카카오 알림톡 발송은 별도 알림 서비스 계정이 필요합니다.

## 지금 코드에서 완료된 범위

- 상세페이지 `BUY NOW`가 checkout으로 이동합니다.
- 상세페이지 `KakaoPay` 버튼도 checkout으로 이동하며 결제수단을 `KAKAO_PAY`로 저장합니다.
- checkout은 외부 결제 승인 전 단계의 결제 요청 주문을 생성합니다.
- 관리자 주문 목록에서 결제수단과 결제상태를 확인할 수 있습니다.
