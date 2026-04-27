---
title: CM 공통 기능 요구사항 상세 (AN12-1 Phase1 v1.1-r4)
parent: "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
version: 1.1-r4
updated: 2026-04-27
type: 분석
status: review
tags: [wims, 분석, 요구사항정의서, phase1, cm, 공통, admin, auth]
related:
  - "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
  - "[[AN12-1_요구사항정의서_Phase1/sections/00_공통_원칙_ID체계]]"
  - "[[AN12-1_요구사항정의서_Phase1/sections/PM_제품관리]]"
  - "[[DE22-1_화면설계서_v1.6]]"
  - "[[DE24-1_인터페이스설계서_v2.0]]"
  - "[[DE33-1_DB물리스키마_설계서_v1.3]]"
  - "[[AN14-1_요구사항추적표_v1.2]]"
---

# CM 공통 기능 요구사항 상세

> [!abstract]
> 공통(CM) 서브시스템 Phase 1 기능·비기능 요구사항 전체. v1.0 계승 FR 6건 + NFR 24건.
> v1.1 에서 CM 영역 신규·개정 사항은 없음 (전체 계승).
> v1.1-r2 분산 구조 재편 (2026-04-23).
> **v1.1-r3 (2026-04-27):** 관리자 = 일반 사용자 단일 모델 확정. FR-CM-001 본문 수용기준 강화 (JWT TTL·Redis·5회 잠금) + 신규 FR-CM-007 (관리자 인증 = IF-CM-AUTH-001/002/003), FR-CM-008 (비밀번호 정책 bcrypt·10자·5회 잠금), FR-CM-009 (로그인 이력 감사 admin_login_history) 3건 추가. CM FR 6 → **9건**.
> **v1.1-r4 (2026-04-27):** FR-CM-008 비밀번호 정책에 **전송 구간 암호화** 수용기준 추가 — 클라이언트는 IF-CM-AUTH-004 공개키로 RSA-OAEP-SHA256 암호화한 Base64 ciphertext 만 `LoginRequest.password` 로 전송. 평문 전송은 서버에서 거부 ([[DE24-1_인터페이스설계서_v2.0]] §3.2.6).

## 1. 개요

### 1.1 CM 서브시스템 범위

WIMS 2.0 **공통(Common)** 서브시스템은 전 서브시스템(PM/ES/OM/MF/FS) 이 공유하는 **인증·권한·UI 공통·시스템관리·오류수정·반응형** 을 관할한다. 로그인(JWT) / RBAC / 다중 창 / 코드·설정 마스터 / 현행 시스템 오류 11건 통합 수정 / 태블릿 이상 반응형(768px+) 을 포함한다.

### 1.2 화면·API 대응 (요약)

| 영역 | 주요 화면 (DE22-1 v1.6) | 주요 API |
|------|------------------------|---------|
| 인증 | SCR-CM-001 (로그인), SCR-CM-002 (비밀번호 변경) | /auth/**, /settings/password |
| 사용자 관리 | SCR-CM-003 (통합: 목록 + 우측 상세 패널) | internal /admin/users/** |
| 그룹·코드·설정 | SCR-CM-005, SCR-CM-006, SCR-CM-007 | internal /admin/groups, /admin/codes, /admin/settings |

> v1.6 결번: `SCR-CM-004` (SCR-CM-003 으로 통폐합) — 본 문서에서 참조 금지.

## 2. 기능 요구사항 (FR-CM)

> FR-CM-001~006 은 `v1.0 계승` (v1.1 에서 정의 변경 없음). FR-CM-001 본문은 v1.1-r3 에서 수용기준 보강(JWT TTL·Redis·5회 잠금). FR-CM-007/008/009 는 v1.1-r3 신규.

#### FR-CM-001 사용자(=관리자) 로그인 및 세션 관리 `v1.0 계승 / v1.1-r3 본문 보강`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 인증 |
| **난이도** | 중 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | 개발계획서, 사이트맵, DEC-03 (NFR 수치 SOT) |
| **관련 요구사항** | FR-CM-002, FR-CM-005, FR-CM-007, FR-CM-008, FR-CM-009, NFR-SC-CM-001, NFR-SC-CM-004 |
| **관련 화면** | SCR-CM-001 (로그인), SCR-CM-002 (비밀번호 변경) |

**개요:** 사용자(=관리자) ID/비밀번호 기반 로그인, JWT (HS256) 기반 세션 관리. WIMS 2.0 Phase 1 은 **관리자 = 일반 사용자 단일 모델**로 운영하며 별도 일반 사용자 테이블 없음 ([[DE33-1_DB물리스키마_설계서_v1.3]] §3.21 `admin`).

**수용기준 (v1.1-r3 강화):**

- 토큰 TTL: **access 1시간 / refresh 24시간** (DEC-03 정합).
- Redis 활용: refresh 저장(`refresh:{adminId}:{jti}`), 중복 로그인 방지(`session:{adminId}` 활성 access jti 1개 유지), 로그아웃 blacklist(`bl:{jti}` TTL=잔여 만료까지).
- 자동 저장(FR-CM-005) 과 연계하여 세션 만료 시 작업 내용 소실 방지(FR-CM-005-09).
- 비밀번호 규칙은 v1.6 에서 체크박스(☐) 제거 → 정적 아이콘(✓/✗/⦿) 표시로 UX 개선.
- 백엔드 SOT: [[DE24-1_인터페이스설계서_v2.0]] §5.2.1 IF-CM-AUTH-001/002/003.

**상세 스펙:** `[[AN12-1_요구사항목록_v1.5]]` 및 v1.0 본문 참조.

---

#### FR-CM-007 관리자 인증 (로그인/리프레시/로그아웃) `v1.1-r3 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 인증 |
| **난이도** | 중 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | DEC-03 (NFR 수치 SOT) + 2026-04-27 admin 인증 사양 확정 |
| **관련 요구사항** | FR-CM-001, FR-CM-008, FR-CM-009, NFR-SC-CM-001/004/005 |
| **관련 인터페이스** | IF-CM-AUTH-001 (`POST /api/auth/login`), IF-CM-AUTH-002 (`POST /api/auth/refresh`), IF-CM-AUTH-003 (`POST /api/auth/logout`) |
| **관련 엔티티** | `admin` ([[DE33-1_DB물리스키마_설계서_v1.3]] §3.21) |
| **관련 화면** | SCR-CM-001 (로그인) |

**개요:** 관리자(=일반 사용자) 인증 3 엔드포인트의 통합 요구사항. JWT HS256 / access 1h / refresh 24h. JWT secret 키는 prod 에서 환경변수 `JWT_SECRET` 강제 주입, dev 는 `application-local.yml` fallback.

**수용기준:**

1. `POST /api/auth/login` — `adminId`+`password` 로 access·refresh 토큰 발급. Response 에 `admin.{id, adminId, name, email, status, latestAt}` 포함.
2. `POST /api/auth/refresh` — refreshToken 검증 (서명 + Redis `refresh:{adminId}:{jti}` 존재 확인) → 새 access 발급. 잔여 < 30분이면 refresh 회전.
3. `POST /api/auth/logout` — access jti → `bl:{jti}` blacklist 등록 + Redis 의 `refresh:*` / `session:*` 삭제.
4. 중복 로그인 방지: `session:{adminId}` 에 활성 access jti 1개만 유지. 신규 발급 시 기존 토큰 invalidate.
5. Spring Security 필터 체인: `/api/auth/**` permitAll, 그 외 `/api/**` `authenticated` (Phase 1 ROLE 분기 미적용; 후속).

---

#### FR-CM-008 관리자 비밀번호 정책 (bcrypt + 10자 + 5회 잠금 + 전송 암호화) `v1.1-r3 신규 / v1.1-r4 보강`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 인증 |
| **난이도** | 중 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | DEC-03 (비밀번호 10자) + NFR-SC-CM-003 (TLS) + NFR-SC-CM-004/005 |
| **관련 요구사항** | FR-CM-007, FR-CM-009, NFR-SC-CM-003, NFR-SC-CM-004, NFR-SC-CM-005 |
| **관련 인터페이스** | IF-CM-AUTH-001 (`POST /api/auth/login`), **IF-CM-AUTH-004 (`GET /api/auth/public-key`)** |
| **관련 엔티티** | `admin.password` (VARCHAR(255), bcrypt 해시) |

**개요:** 관리자 비밀번호 저장·검증·전송 정책. 평문 저장 절대 금지 — bcrypt 해시 (cost 10 권장). DEC-03 정합 **10자 이상**, 영문/숫자/특수문자 3종 이상. 전송 구간은 TLS 위 RSA-OAEP-SHA256 이중 방어.

**수용기준:**

1. `password` 컬럼은 bcrypt 해시 문자열 (`$2a$10$...`) 만 보관.
2. 로그인 시 BCryptPasswordEncoder 검증.
3. 5회 연속 실패 시 `admin.status='SUSPENDED'` 자동 전환 + `IF-EVT-USR-001(USER_LOCKED)` 발행. 실패 카운터는 Redis `loginfail:{adminId}` (TTL = 24h, 성공 시 reset).
4. SUSPENDED 상태에서는 모든 인증 요청을 `403 USER_SUSPENDED` 로 거부.
5. 잠금 해제는 ADMIN 의 수동 unlock 또는 비밀번호 재설정 성공 시.
6. **(v1.1-r4 신규)** **전송 구간 암호화** — 클라이언트는 `GET /api/auth/public-key` (IF-CM-AUTH-004) 로 발급받은 RSA-2048 공개키로 평문 password 를 RSA-OAEP-SHA256 암호화 → Base64 인코딩 → `LoginRequest.password` 필드에 전송. **평문 password 의 네트워크 전송 금지** (서버 측 복호화 실패 시 `400 INVALID_PASSWORD_CIPHER`). 키 쌍은 서버 시작 시 메모리 생성 / 재시작 회전. 정책 상세는 [[DE24-1_인터페이스설계서_v2.0]] §3.2.6.
7. **(v1.1-r4 신규)** 복호화된 평문이 10자 미만이면 `400 PASSWORD_POLICY` 로 거부 — bcrypt 비교 이전 단계에서 정책 검증.

---

#### FR-CM-009 로그인 이력 감사 (admin_login_history) `v1.1-r3 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 감사 |
| **난이도** | 하 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | NFR-MT-CM-002 (변경 이력 감사) + NFR-SC-CM-006 (감사로그 90일) |
| **관련 요구사항** | FR-CM-007, FR-CM-008 |
| **관련 엔티티** | `admin_login_history` ([[DE33-1_DB물리스키마_설계서_v1.3]] §3.22) |

**개요:** 모든 로그인 시도(성공·실패) 를 `admin_login_history` 에 영속 기록. 5회 잠금의 영속 백업 + 보안 감사 추적.

**수용기준:**

1. 모든 로그인 시도 → INSERT 1행 (`admin_id` FK, `login_at`, `ip` (VARCHAR 45 IPv6), `user_agent`, `success`, `fail_reason`).
2. 성공 시 `admin.latest_at` UPDATE.
3. 실패 사유 enum: `INVALID_PASSWORD` / `USER_NOT_FOUND` / `USER_SUSPENDED` / `USER_WITHDRAWN` / `OTHER`.
4. 보존 기간 90일 이상 (NFR-SC-CM-006). 운영 1년차 파티셔닝 검토 ([[DE33-1_DB물리스키마_설계서_v1.3]] 개방이슈 #11).
5. FK `RESTRICT`: admin 탈퇴(WITHDRAWN) 시에도 이력 행은 보존.

---

#### FR-CM-002 역할 기반 접근제어 기능 구현 (RBAC) `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 권한 |
| **난이도** | 중 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | 개발계획서 |
| **관련 요구사항** | FR-CM-004, NFR-SC-CM-002 |
| **관련 화면** | SCR-CM-003 (사용자 관리 — 권한 설정 탭) |

**개요:** 역할(ROLE) 기반 화면·API 접근제어. Phase 1 주요 역할: `ROLE_ADMIN`, `ROLE_PM_ADMIN`, `ROLE_PM_EDITOR`, `ROLE_PM_VIEWER`, `ROLE_RULE_EDITOR`, `ROLE_MES_READER` (**SOT: [[DE11-1_소프트웨어_아키텍처_설계서_v1.2]] §7.3 역할 사전** — 레거시 `SUPER` / `PR_MEM` / `ARCH_MEM` / `MEM` → 표준 ROLE 매핑 포함). 화면 라우트 가드 + 백엔드 Spring Security `@PreAuthorize` 이중 방어. NFR-SC-CM-002 의 접근제어 정책과 쌍을 이룬다(기능 = UI/API 구현, 비기능 = 정책·규칙 정의).

---

#### FR-CM-003 공통 UI 기능 (다중 창) `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > UI공통 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | AN11-2 사용성 |
| **관련 화면** | 전체 화면 공통 |

**개요:** 메인 + 우측 상세 패널 다중 창, 리사이즈(320~600px), 딥링크 지원. v1.6 에서 공통 원칙 `00_공통_원칙_레이아웃` §3.1 으로 일관 적용(SCR-PM-004 거래처·SCR-PM-007 공정·SCR-CM-003 사용자 통폐합 등 목록+우측 패널 패턴).

---

#### FR-CM-004 시스템 관리 (사용자, 코드, 설정) `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 시스템관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | 사이트맵 |
| **관련 요구사항** | FR-CM-002 |
| **관련 화면** | SCR-CM-003 (사용자 관리), SCR-CM-005 (그룹), SCR-CM-006 (코드), SCR-CM-007 (시스템 설정) |

**개요:** 사용자·그룹·코드(CODE_CATALOG)·시스템 설정 관리. SCR-CM-006 코드관리는 제품 분류 L1~L4 값 및 modelCode 세그먼트 값의 공급처 역할(FR-PM-014/015 연계). SCR-CM-007 v1.6: 비밀번호·계정잠금·세션·알림·파일 5 카테고리 12항목 설정 표.

---

#### FR-CM-005 현행 시스템 오류 수정 (11건 통합) `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 오류수정 |
| **난이도** | 중 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | AN11-2 오류 11건 |

**개요:** AN11-2 에서 수집된 현행 시스템 오류 11건을 통합 수정. 하위 번호 FR-CM-005-01 ~ FR-CM-005-11 로 개별 추적. 주요 항목:

| ID | 영역 | 오류 내용 |
|----|------|---------|
| FR-CM-005-01 | 견적설계 | 식별번호 매칭 시 부호 중량 합산 오류 |
| FR-CM-005-02 | 견적설계 | 도면 로딩 시 간헐적 렌더링 실패 |
| FR-CM-005-03 | 견적설계 | 개소 삭제 후 수량 재계산 미반영 |
| FR-CM-005-04 | 견적설계 | 견적서 출력 시 금액 소수점 절사 오류 |
| FR-CM-005-05 | 자재관리 | 자재 코드 중복 등록 가능 (유일성 미검증) — FR-PM-004 연계 |
| FR-CM-005-06 | 자재관리 | 단가 변경 후 기존 견적에 소급 적용 — FR-PM-003 연계 |
| FR-CM-005-07 | 발주 | 절단 계획 수정 후 발주서에 미반영 |
| FR-CM-005-08 | 발주 | 발주서 출력 시 거래처명 누락 |
| FR-CM-005-09 | 공통 | 로그인 세션 만료 후 작업 내용 소실 — FR-CM-001 연계 |
| FR-CM-005-10 | 공통 | 브라우저 뒤로가기 시 데이터 초기화 |
| FR-CM-005-11 | 공통 | 파일 업로드 용량 제한 미안내 |

> 세부 시나리오는 `[[AN12-1_요구사항목록_v1.5]]` 별첨 A 참조.

---

#### FR-CM-006 태블릿·데스크톱 반응형 웹 UI 지원 (768px 이상) `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 공통 > 반응형UI |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | AN11-2 모바일 조회 |
| **관련 화면** | 전체 화면 (태블릿+) |

**개요:** 최소 768px (태블릿) 이상에서 사용 가능한 반응형 레이아웃. 그리드 12컬럼 / 거터 16px / 브레이크포인트(768/1024/1280/1920). Phase 2 모바일 전용 화면(FS 현장실측) 은 별도 요구사항(FR-FS-*) 으로 관리.

## 3. 비기능 요구사항 (NFR-CM)

> v1.0 계승 24건 전체 유효. 카테고리별 주요 항목만 기재 (세부 수치는 `[[AN12-1_요구사항목록_v1.5]]` 정본 참조).

### 3.1 보안 (NFR-SC-CM) — 6건

| ID | 요구사항명 | 목표 |
|----|-----------|------|
| NFR-SC-CM-001 | JWT 기반 인증·토큰 만료 | 액세스 2시간·리프레시 14일 |
| NFR-SC-CM-002 | RBAC 정책·규칙 정의 | FR-CM-002 와 쌍 |
| NFR-SC-CM-003 | HTTPS 전 구간 강제 | TLS 1.2 이상 |
| NFR-SC-CM-004 | 비밀번호 규칙 | 최소 10자·대소문자·숫자·특수문자 중 3종 이상 |
| NFR-SC-CM-005 | 계정잠금 정책 | 5회 실패 시 30분 잠금 |
| NFR-SC-CM-006 | 감사로그 보관 | 90일 이상 |

### 3.2 성능 (NFR-PF-CM) — 4건

- **NFR-PF-CM-001** 화면 초기 로드 p95 ≤ 3.0s (1920×1080 기준)
- **NFR-PF-CM-002** 동시 접속 30명 처리 (Phase 1 기준)
- **NFR-PF-CM-003** 폼 저장 응답 p95 ≤ 1.0s
- **NFR-PF-CM-004** 목록 페이지네이션 p95 ≤ 800ms

### 3.3 사용성 (NFR-US-CM) — 4건

- **NFR-US-CM-001** WCAG 2.1 AA 준수 (포커스·대비 4.5:1·ARIA·키보드)
- **NFR-US-CM-002** 한국어 UI·RFC 3339 시각 표시
- **NFR-US-CM-003** *(결번 — AN12-1 목록 v1.5 기준)*
- **NFR-US-CM-004** 신규 사용자 튜토리얼 툴팁·빈 상태(EmptyState) 안내

### 3.4 신뢰성 (NFR-RL-CM) — 2건

- **NFR-RL-CM-001** 자동 저장 30초 간격 (FR-CM-005 보강)
- **NFR-RL-CM-002** 서비스 가용성 ≥ 99.5% (업무시간 기준)

### 3.5 인터페이스 (NFR-IF-CM) — 4건

- **NFR-IF-CM-001** REST API camelCase, RFC 3339
- **NFR-IF-CM-002** 파일 업로드 용량 한도 (이미지 10MB, 문서 50MB) 안내 표시 — FR-CM-005-11 연계
- **NFR-IF-CM-003** API 오류 응답 RFC 7807 Problem Details 형식
- **NFR-IF-CM-004** 외부 연계 로그 보관 (MES, 추후 외부 단가 시스템)

### 3.6 데이터 (NFR-DA-CM) — 4건

- 백업 일일 / RPO 4h / RTO 8h / 개인정보 마스킹 / MariaDB 10.11 기준

### 3.7 이식성 (NFR-PT-CM) — 2건

- 최신 Chrome / Edge / Safari / Firefox 2 버전 지원
- 태블릿 768px 이상 (FR-CM-006)

### 3.8 유지보수성 (NFR-MT-CM) — 2건

- **NFR-MT-CM-001** 코드 품질: SonarQube Major 이상 0건 유지
- **NFR-MT-CM-002** 감사로그·운영로그 수집(ELK) 및 대시보드 제공

## 4. 요구사항 추적 (RTM 참조)

| 요구사항 ID | 관련 화면 (DE22-1 v1.6) | 관련 API | 관련 엔티티 |
|-----------|---------------------|---------|-----------|
| FR-CM-001 | SCR-CM-001, SCR-CM-002 | /auth/**, /settings/password | admin |
| FR-CM-002 | SCR-CM-003 (권한 탭) | internal /admin/users/**/roles | (Phase 2 ROLE 분기) |
| FR-CM-003 | 전체 | — | — |
| FR-CM-004 | SCR-CM-003/005/006/007 | internal /admin/** | admin, GROUP, CODE_CATALOG, SYSTEM_SETTING |
| FR-CM-005 | 해당 각 화면 | — | — |
| FR-CM-006 | 전체 | — | — |
| **FR-CM-007** | SCR-CM-001 | IF-CM-AUTH-001/002/003 (`/api/auth/login`·`/refresh`·`/logout`) | admin |
| **FR-CM-008** | SCR-CM-001/002 | IF-CM-AUTH-001, **IF-CM-AUTH-004** | admin |
| **FR-CM-009** | (감사 백오피스) | — | admin_login_history |
| NFR-SC-CM-001~006 | SCR-CM-001/002/003 | /auth/**, 감사로그 | admin, admin_login_history |

> 전체 RTM 은 [[AN14-1_요구사항추적표_v1.2]] 정본을 따른다.

## 5. 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| v1.1-r4 | 2026-04-27 | 김지광 | FR-CM-008 비밀번호 정책에 **전송 구간 암호화 수용기준** 추가 (수용기준 6·7번). 클라이언트는 IF-CM-AUTH-004 (`GET /api/auth/public-key`) 의 RSA-2048 공개키로 RSA-OAEP-SHA256 암호화한 Base64 ciphertext 만 `LoginRequest.password` 로 전송. 평문 password 네트워크 전송 금지. 복호화된 평문 길이 10자 미만 시 `400 PASSWORD_POLICY`. DE24-1 v2.0-r3 §3.2.6 정합. |
| v1.1-r3 | 2026-04-27 | 김지광 | 관리자 = 일반 사용자 단일 모델 확정. FR-CM-001 본문 수용기준 강화 (JWT TTL access 1h / refresh 24h, Redis refresh+session+blacklist, 5회 잠금). 신규 FR-CM-007 (관리자 인증 IF-CM-AUTH-001/002/003), FR-CM-008 (비밀번호 정책 bcrypt + 10자 + 5회 잠금), FR-CM-009 (로그인 이력 감사 admin_login_history) 3건 추가. CM FR 6 → **9건**. RTM 표 admin / admin_login_history 엔티티 매핑. |
| v1.1-r2 | 2026-04-23 | 김지광 | 분산 구조 재편 (sections/ 패턴, v1.0 계승 본문 통합). |

## 관련 문서

- [[AN12-1_요구사항정의서_Phase1_v1.1]] — 메인 인덱스 허브
- [[AN12-1_요구사항정의서_Phase1/sections/00_공통_원칙_ID체계|00_공통_원칙_ID체계]] — ID 체계·용어·통계
- [[AN12-1_요구사항정의서_Phase1/sections/PM_제품관리|PM_제품관리]] — PM 서브시스템 요구사항
- [[AN12-1_요구사항목록_v1.5]] — xlsx 정본 (세부 스펙·오류 11건 별첨)
- [[AN14-1_요구사항추적표_v1.2]] — RTM
- [[DE22-1_화면설계서_v1.6]] — 화면설계 27종 (SCR-CM-004 결번 주의)
