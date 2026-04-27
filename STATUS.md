# STATUS — WIMS 2.0 진행 상황

> CLAUDE.md 에서 자주 변동되는 현황 정보를 분리한 파일. 스프린트 진행에 따라 수시 갱신한다.

## 현재 시점 (2026-04-27)

- **2026-04-27 로그인 비밀번호 전송 암호화 도입:** `/api/auth/login` 의 `password` 필드를 **RSA-OAEP-SHA256 + Base64** 로 암호화 전송하도록 도입 (TLS 위 이중 방어). 신규 엔드포인트 **IF-CM-AUTH-004** `GET /api/auth/public-key` (X.509 DER Base64, RSA-2048 / SHA-256 / MGF1-SHA-256). 키 쌍은 서버 시작 시 메모리 생성·재시작 회전 (디스크 미저장). 복호화 실패 → `400 INVALID_PASSWORD_CIPHER`, 평문 길이 < 10자 → `400 PASSWORD_POLICY`. 코드: `RsaKeyService` 신설 + `AuthController.publicKey` + `AdminAuthService.login` 복호화 단계 삽입. 산출물 갱신: **DE24-1 v2.0-r2 → v2.0-r3** (§3.2.6 신설 + 클라이언트 가이드 JS/Kotlin / §5.2.1 IF-CM-AUTH-001 password 필드 정의 갱신·에러 카탈로그 +2 / IF-CM-AUTH-004 신설 / §8 IF-ID 매트릭스 +1) / **AN12-1 P1 v1.1-r3 → v1.1-r4** (FR-CM-008 수용기준 6·7번 추가).
- **2026-04-27 admin 인증 사양 확정:** **관리자 = 일반 사용자 단일 모델** 결정 (별도 일반 사용자 개념 없음). IF-CM-AUTH-001/002/003 (`/api/auth/login`·`/refresh`·`/logout`) 가 그대로 admin 엔드포인트. JWT HS256 access **1h** / refresh **24h** (DEC-03 정합) + Redis (refresh `refresh:{adminId}:{jti}` / 중복 로그인 방지 `session:{adminId}` / 로그아웃 blacklist `bl:{jti}`) + bcrypt + 10자 정책 + 5회 실패 시 `status='SUSPENDED'` 자동 전환 + `IF-EVT-USR-001` 발행. 신설 엔티티 2종(`admin` / `admin_login_history`). 산출물 갱신: **DE33-1 v1.2→v1.3** (엔티티 23→25, FK 31→32, 인덱스 48→52, Flyway V107·V108 추가) / **DE24-1 v2.0→v2.0-r2** (§3.2.1 JWT 1h/24h·secret env var 강제 명문화, §5.2.1 IF-CM-AUTH-001/002/003 본문 강화 + DTO 표) / **AN12-1 P1 v1.1-r2→v1.1-r3** (CM FR 6→9, 신규 FR-CM-007/008/009) / AN12-1 v1.5 md 미러 갱신.
- **2026-04-24 전체 프로세스 교차검증 사이클 종결:** 9 에이전트 병렬 교차검증(A1~A6 수직 + B1~B3 횡단) → 이슈 56건을 의사결정 10단위(DEC-01~10)로 집약 → 추천안 전면 승인 후 **77건 자동 적용 (1차 16·2차 15·3차 46)**. 영향 14 파일.
    - **완료 8단위**: DEC-02(CM NFR 카탈로그 AN12-1 정본 동기화, AN14-1 §4 13행 재작성 + 총계 51→57) · DEC-03(NFR 수치 SOT 확정: 동시접속 30명·MES p95 500ms·최적절단 30초·비밀번호 10자·세션 2h/14일·NFR-PF-PM-006/FS-003 분리 신설) · DEC-04(ES 섹션 §1.4 Phase 1 참조 엔티티 박스 + FR-ES-005/007/009/016 BOM 용어 재기술) · DEC-05(OM/MF/FS 경계: 이벤트형 API 통일·2단계 검증·MES 하이브리드·**FR-MF-011 공정진행 추적 신설**·거래처 SOT=PM·PO-R{n} 채번) · DEC-06(**DE11-1 §7.3 ROLE 사전 SOT 신설** 7 표준 ROLE + 레거시 마이그레이션 맵 + 4 문서 일괄 정렬) · DEC-07(BOM_RULE_HISTORY: FR-PM-021 수용기준·SCR-PM-022 [이력] 탭·DE24-1 §5.3.11.1 엔드포인트 + IF-PM-DTB-002) · DEC-08(AN14-1 v1.3 TODO 갱신) · DEC-09(8건 단발 배치)
    - **보류 2단위**: DEC-01 xlsx 정본 개정(BA 환경 필요, md 미러 완료) · DEC-10 P2 잔여 24건(Gate 1 docx 생성 시 일괄)
    - 산출 문서 변경 요약: DE11-1 v1.2→**v1.3-r1**(§7.3 ROLE 사전 신설, §11 API·MES 500ms) / DE24-1 v2.0→**v2.0-r1**(§3.2.5 ROLE 재편·§5.3.11.1 이력 API·§8 IF-PM-DTB-002) / AN14-1 v1.2→**v1.2-r2**(NFR-CM 카탈로그 동기화·v1.3 TODO 확장) / AN12-1 P1 CM v1.1-r2 내부 갱신(FR-CM-002 ROLE 목록·NFR-SC-CM-001 세션 2h/14일·NFR-PF-CM-002 30명) / AN12-1 P1 PM v1.1-r2 내부(**FR-PM-021 이력 조회 수용기준·NFR-PF-PM-006 신설**) / AN12-1 P2 ES/OM/MF/FS 섹션 대규모 개정(**MF FR 10→11건, FR-MF-011 공정진행 추적 신설**) / DE22-1 §05 05_BOM관리 (SCR-PM-022 이력 탭·frozen 이중방어 callout·5컬럼 매핑) / AN12-1_요구사항목록_v1.5.md PM 17→27건 md 미러 확장
    - **검증 산출물 정리**: 레거시 V1~V6 + CX1~CX3 9 리포트, 2026-04-24 A1~A6 + B1~B3 9 에이전트 리포트, 종합·변경로그까지 모두 삭제. 감사 추적은 git log 로 (폴더 `docs/참고자료/분석/검증/` 전체 제거)
- **2026-04-24 유니크시스템 BOM 보완본 수령·분석:** 유니크시스템이 [[DHS-AE225-D-1_유니크시스템_질의서|Q1~Q19 질의서]](2026-04-14)에 대한 보완본 `유니크시스템 BOM_26.04.24.xlsx` (41MB / 31시트) 전달. [[7_유니크시스템BOM_26.04.24_분석|전수 분석]] 완료 — Q 전수 대응(완전 해소 13/체계 변경 3/부분 1/N/A 1: **Q19-b 표준 작업시간 = 현업 원천 미관리 확정**) + 질의에 없던 9대 추가 수확(Level 5단 표준·공정 순서 표준·위치구분 10종·자재 마스터 87종·협력업체 11개사·파생 포함관계·제품 카탈로그 25종·(전)대조본·커튼월 Phase 1 편입). 후속 문서 반영 4건(용어사전 v1.4 Level/위치 카탈로그·DE35-1 v1.5→**v1.6** 카탈로그 반영·DE22-1 04_제품관리 §5.5 신설·본 STATUS) 동일 일자 일괄 적용.
- **스프린트:** S1 종료 예정, S2 진입 직전 — Gate 1 md 개정 완료, S2 선행 설계 산출물 작성 중
- **다음 Gate:** Gate 2 (S2 말) — DE 산출물 최종 확정 + Flyway DDL 인계
- **Vault 연결 정비 (2026-04-22):** 깨진 wikilink 11건 수정(파일명 오타·frontmatter supersedes·본문 구버전 참조), 잔존 DE32-1 v1.0 파일 삭제, 참조문서_인덱스.md 허브 재구성(50+ 문서 단계별 wikilink 화, 고아 14건 흡수). 회의록·V/CX 검증 리포트의 시점 스냅샷 참조는 역사적 기록으로 유지. 그래프뷰 10 그룹 색상 적용.
- **최근 변화 (04.15~04.22):** 유니크시스템 참고자료 5건 분석 → BOM 도메인 용어사전 v1.0 → v1.1 → v1.2 → **v1.3** 진화 → 후속 6개 설계 문서 일괄 개정 → 6관점 검증(V1~V6) + 3관점 크로스체크(CX1~CX3) + P0/P1/P2 정정 완료. **BOM 옵션별규칙 관리 UI 설계 (3뷰 체계) 신규 스펙 → 용어사전 v1.4 + 하위 6개 문서 r2 개정. 2026-04-21 Gate 1 잔여 작업 완료 — AN14-1 RTM v1.1 개정 (137건) + BOM 고찰(부록 D) v1.4 개정 (용어사전 v1.3/v1.4 정합)**
- **2026-04-22 종합 검증·개정 (v1.6 일괄 배포):** 화면설계 교차검증(요구사항·업무흐름·API·DB·UI/UX 3 관점) 실행 → DE22-1 v1.5-r2 → **v1.6** 전면 개정. 통폐합 4건(PM-005→004, PM-008/009→007, CM-004→003) + 승격 3건(PM-021/022/023: FR-PM-025/026/027) + 공통 섹션 대폭 보강(LNB 상세·⌘K Command Palette·알림 카탈로그·a11y WCAG 2.1 AA·공통 컴포넌트 HierarchyFilter/NotificationBell/EmptyState·글로벌 검색 6대상) + BOM 트리 가상스크롤·미니맵·3뷰 동기화·Wizard/Expert 모드·resolvedBomId 노출 + Phase 2 탭 숨김·GNB 공정관리 독립 승격. 화면 수 28→**27**. 동반 개정: AN14-1 v1.1→**v1.2** (SCR 재매핑), DE24-1 v1.8→**v1.9** (PM 도메인 31 엔드포인트 신설, 이후 v2.0/v2.0-r2 으로 재편), DE33-1 v1.1→**v1.2** (Flyway V100~V106 확정, 엔티티 21→23, v1.3 에서 25 로 확장).
- **2026-04-22 와이어프레임 완전 동기화:** claude_ai_wireframe MCP 31 WF → 30 WF (삭제 4·신규 3·재편 23). DE22-1 v1.6 SCR 체계와 100% 정합.
- **2026-04-23 Vault 인덱스 분산 재구성:** 단일 참조문서_인덱스.md(181줄) → 루트 허브(80줄) + 단계별 하위 인덱스 4개(1_PP/2_AN/3_DE/참고자료 분석·V·CX). 응집도↑ 결합도↓.
- **2026-04-23 DE24-1 통합본 v2.0 배포:** MES 전용(v1.9)에서 **통합 인터페이스 설계서**로 전면 개편. 2,475 라인 / 103KB / 13장 + 부록 3. §4 외부(MES+S3+SSO+Email/Slack) + §5 내부(CM 6군+PM 13군) + §6 이벤트·비동기 + §7 데이터 인터페이스 + §8 IF-ID 매트릭스(55+) + §12 NFR 매핑 신설. 부록 A 에 MES 서명용 발췌본 분리.
- **2026-04-23 대형 문서 분산 관리 정책 적용:** 크기 기반 판단(1,500+ 라인 분리 검토, 2,500+ 라인 강력 검토) 후 AN12-1 Phase 1·2 를 DE22-1 sections/ 패턴으로 일관 분리. **Phase 1 v1.1 (724줄 단일)** → 메인 인덱스(139) + sections 3 (00 공통·PM·CM, v1.0 계승 13 FR 본문 통합). **Phase 2 v1.0 (2,802줄 단일)** → 메인 인덱스(196) + sections 6 (00 공통·ES·OM·MF·FS·NFR 공통, FR 53 전원 이전). DE24-1 (2,475) · DE33-1 (1,382) · DE11-1 (1,072) 등은 통합 시각·교차참조 가치로 유지 권장.

## 완료된 산출물

### S0 (PP 단계)
- PP11-1 TFT 구성계획서 v2.3 (md) / v2.2 (docx) — md / docx
- PP12-1 방법론 테일러링 결과서 v2.1 — md / docx
- PP13-1 개발환경 구성 결과서 v1.0 — md / docx
- PP-SCH-001 프로젝트 일정표 v1.0 — md / docx

### S0~S1 (AN 단계)
- AN11-1 사전설문조사서 v1.0 — md / docx
- AN11-2 사전설문조사 결과서 v1.0 — md / docx
- AN12-1 요구사항목록 v1.5 — md / xlsx
- AN12-1-P1 요구사항정의서 Phase1 **v1.1-r4** — md (**2026-04-27 v1.1-r4 갱신** — FR-CM-008 비밀번호 정책에 전송 구간 RSA-OAEP-SHA256 암호화 수용기준 (수용기준 6·7번) 추가. 평문 password 네트워크 전송 금지 명문화. DE24-1 v2.0-r3 §3.2.6 정합. FR/NFR 총량 변동 없음). v1.1-r3 (2026-04-27) — CM 섹션 신규 FR 3건 (FR-CM-007 관리자 인증·FR-CM-008 비밀번호 정책·FR-CM-009 로그인 이력 감사). FR-CM-001 본문 수용기준 강화. CM FR 6→9, Phase 1 합계 70→**73건**. AN12-1 v1.5 md 미러 동시 갱신 (xlsx 본 보류, DEC-01 정책)). v1.1-r2 (2026-04-23) — 분산 구조. v1.1-r1 (2026-04-16) — FR-PM-025/026/027 신설
- AN12-1-P2 요구사항정의서 Phase2 v1.0 — md / docx
- AN21 총괄 업무흐름도 v1.0 — md
- AN21-1~5 서브시스템별 업무흐름도 v1.0 — md
- AN21 현행시스템 사이트맵 v1.0 — md / docx / xlsx
- AN22-1 현행 데이터 분석서 v1.0 — md / docx
- AN14-1 요구사항 추적표(RTM) **v1.2** — md (**2026-04-22 v1.2 개정 완료** — DE22-1 v1.6 SCR 재편 반영. 통폐합 4건(PM-005/008/009/CM-004 결번 처리) + 승격 3건(PM-021/022/023 독립 매핑). 총 화면 28→27. 결번 관리 섹션 신설. 관련 wikilink 일괄 v1.6/v1.9/v1.2 갱신. v1.1 파일 제거)
- AN41-1 총괄 테스트 계획서 **v1.1** — md (2026-04-22, v1.0 본문 보존 + 증분 개정. BOM_RULE 3뷰 기능 테스트 32건(GAL 9+DT 9+EXP 7+SIM 7), 성능 NFR 10건(PM-003/004/005), 신뢰성 14건(frozen 이중방어 DB 트리거+APP @PreUpdate), 유지보수성 7건(AST 캐시 warm-up), 감사·이력 7건(BOM_RULE_HISTORY) 총 70 신규 TC. 추적 매트릭스 + 신규 식별자 9계열 신설. v1.0 파일 제거)

### S1~S2 (DE 단계, 선행 작성)
- DE35-1 미서기이중창 표준 BOM 구조 정의서 **v1.6** — md (**2026-04-24 v1.6 개정** — 유니크시스템 BOM 보완본(26.04.24) 카탈로그 반영: Level 5단 표준·위치구분 10종·자재 마스터 87종·협력업체 11개사·제품 카탈로그 25종. v1.5-r2 기반 BOM_RULE +5컬럼, RULE_TEMPLATE·BOM_RULE_HISTORY 유지.)
- DE32-1 BOM 도메인 ER 다이어그램 **v1.2** — md (2026-04-22, DE33-1 v1.1 정합. **신규 엔티티 2종** `DIES_BOOK_REVISION`, `ITEM_SUPPLIER_HISTORY` + 기존 DIES_SUPPLIER/DIES_BOOK/ITEM_SUPPLIER 컬럼 확장. FK +2건, 인덱스 +7건. Diagram-C Mermaid erDiagram 갱신. 엔티티 19→**21**, 관계 27→29, 인덱스 12→19. 13 파일 wikilink 연쇄 갱신. v1.0 파일 제거)
- DE24-1 인터페이스 설계서 **v2.0-r3** (통합본 + 로그인 비밀번호 전송 암호화) — md (**2026-04-27 v2.0-r3 개정** — `/api/auth/login` password 필드 RSA-OAEP-SHA256 암호화 도입. §3.2.6 신설(키 정책·클라이언트 가이드 JS/Kotlin) / §5.2.1 IF-CM-AUTH-001 password 필드 정의 갱신·에러 +2(`INVALID_PASSWORD_CIPHER`/`PASSWORD_POLICY`) / IF-CM-AUTH-004 (`GET /api/auth/public-key`) 신설 / §8 IF-ID 매트릭스 +1 행. v2.0 본문 보존, 메타만 r3 표기). v2.0-r2 (2026-04-27, admin 인증 강화) — §3.2.1 JWT HS256 access 1h / refresh 24h 명문화 + claims 5필드 표준화 + `JWT_SECRET` env var 강제 (prod) / dev fallback 명시. §3.2.4 admin 단일 모델 claims 정정. §3.2.5 Phase 1 ROLE 분기 미적용 정책 명시. §5.2.1 IF-CM-AUTH-001/002/003 본문 전면 강화 — Redis (`refresh:{adminId}:{jti}` / `session:{adminId}` / `bl:{jti}`) · 중복 로그인 방지 · 5회 실패 SUSPENDED 자동 전환 + IF-EVT-USR-001 발행 · LoginRequest/Response·RefreshRequest/Response DTO 표 추가. DE33-1 wikilink v1.2→v1.3 일괄 치환. v2.0 본문 보존, 메타만 r2 표기). v2.0-r1 (2026-04-24) — DEC-06/07 ROLE 사전·BOM_RULE 이력. v2.0 (2026-04-23) — MES 전용→통합본 전면 개편
- DE22-1 화면설계서 **v1.6** — md **분산 구조** (메인 인덱스 + sections/ 8개. 총 **27 화면** PM 21 + CM 6. **2026-04-22 종합 검증·개정**: 통폐합 4건(PM-005/008/009/CM-004 결번) · 승격 3건(PM-021 템플릿 갤러리 / PM-022 결정표 / PM-023 시뮬레이터 — FR-PM-025/026/027 독립화) · 공통 원칙 대폭 보강(§3.3 LNB 상세 스펙 · §3.4 공통컴포넌트 4종 HierarchyFilter/CommandPalette/NotificationBell/EmptyState · §3.6 글로벌 검색 범위 · §3.7 알림 이벤트 카탈로그 · §4 a11y WCAG 2.1 AA) · BOM 품질(SCR-PM-013 가상스크롤·미니맵·경로 필터 pill · SCR-PM-013B Wizard/Expert 모드 토글 · 3뷰 동기화 규칙 409 optimistic locking · 확정구성표 resolvedBomId 컬럼) · GNB 공정관리 독립 메뉴 승격 · SCR-PM-015 모달 확정 · SCR-PM-016 Phase 2 탭 숨김·배너 대체 · SCR-CM-002 규칙 체크박스→정적 아이콘 · SCR-CM-007 12항목 카테고리 표 · SCR-PM-010 파생 토글·HierarchyFilter 적용 · SCR-PM-017 이중 진입 경로. v1.5 메인 인덱스 파일 제거)
- DE11-1 소프트웨어 아키텍처 설계서 **v1.3** — md (2026-04-16, §11.7 템플릿 컴파일러 / §11.8 시뮬레이터 API(POST /pm/rules/simulate) / §11.9 결정표 API(GET /pm/rules/decision-table) 신설. v1.2 보존)
- DE33-1 DB 물리 스키마 설계서 **v1.3** — md (**2026-04-27 v1.3 개정 완료** — CM 인증 도메인 2 엔티티 신설. §3.21 `admin` (관리자 = 일반 사용자 단일 모델, IF-CM-AUTH-001/002/003 백엔드 SOT, status JOINED/SUSPENDED/WITHDRAWN, bcrypt 해시) + §3.22 `admin_login_history` (로그인 이력 감사, IPv6 대응, 자체 감사 테이블이라 created_at만). Flyway V107·V108 추가. 엔티티 23→**25**, FK 31→32 (Phase 1 활성 29→**30**), 인덱스 48→**52**. v1.2 파일은 git mv 로 v1.3 으로 rename 됨. 개방이슈 #11 (admin_login_history 파티셔닝), #12 (admin↔wims_user Phase 2 정규화) 추가). v1.2 (2026-04-22) — Flyway V100~V106 확정·project_favorite 신설
- WIMS_BOM구성에_대한_고찰 **v1.4** — md (DE35-1 부록D, **2026-04-21 v1.4 개정 완료** — 용어사전 v1.3/v1.4 정합. §3.5 4축 묶음, §5.3 BOM Rule 4동사 스키마, §5.5 데이터 모델 확장(OPTION_VALUE NUMERIC, BOM_RULE +5컬럼, RULE_TEMPLATE·BOM_RULE_HISTORY 신설), §5.6.3 status 흐름 정정, §5.6.4 Resolved BOM 절단속성 8필드, §6 frozen 트리거, §8 3뷰 체계)

### 참고자료 분석 (2026-04-15 신규)
- 유니크시스템 원본 5건 분석 md (`docs/참고자료/분석/`):
  - 1_유니크제품명정리 / 2-1_미서기도면 / 2-2_미서기제작지시서 / 2-3_미서기산식 / 4-2_커튼월다이스북
- 이미지 아카이브 115 PNG (`docs/참고자료/분석/images/`)
- GAP 분석 통합 리포트 — `docs/참고자료/분석/GAP_분석_통합_2026-04-15.md` (v1.2 반영 리비전됨)

### 검증 리포트 (2026-04-16 신규)
- V1~V6 6관점 BOM 설계 검증 — `docs/참고자료/분석/검증/`
  - V1 내부 일관성 / V2 데이터모델 완전성 / V3 기존설계문서 영향도 / V4 비즈니스규칙 수용성 / V5 성능·운영 리스크 / V6 방법론 준수성
- CX1~CX3 6문서 크로스체크 — 동일 폴더
  - CX1 금지어·네이밍 / CX2 v1.3 신규개념 커버리지 / CX3 상호참조 일관성
- 정정 결과: P0 7건 + 1건 + 5건 / P1 화면 3 신설 + SCR 12 치환 / P2 stale 17 + 대칭 12 + 안내 2

### BOM 도메인 용어사전 진화 (이력은 용어사전 내부 §변경이력 참조)
- **v1.4-r1 (2026-04-21, 최신)** — [[WIMS_용어사전_BOM_v1.4]]. 슬림 개정: 용어 정의만 보존, 정책·산식·프로세스·오버레이 평가 규칙·인덱스 설계·시뮬레이터 API 스펙은 설계 문서(DE11-1/DE35-1/DE24-1·BOM-RULE-UI 스펙)로 이관. 총 298줄 → ~180줄. v1.3 이하 스냅샷 파일 제거(문서 내부 변경이력으로 충분).

## S1 Gate 1 산출물 현황 (~04.19 목표, 04.21 진행 중)
- AN22-1 현행 데이터 분석서 — md / docx (완료)
- AN14-1 요구사항 추적표(RTM) **v1.1** — md (**2026-04-21 v1.1 개정 완료**. docx 미생성)
- AN41-1 총괄 테스트 계획서 **v1.1** — md (**2026-04-22 v1.1 개정 완료** — BOM_RULE 3뷰·NFR-PF/RL/MT-PM 테스트 70건 추가. docx 미생성)
- DE24-1 MES REST API 인터페이스 설계서 v1.8 — md (Gate 1 필수, **2026-04-16 v1.8 개정 완료**)
- AN12-1-P1 요구사항정의서 v1.1 — md (Gate 1 필수, **2026-04-16 개정 완료**)
- BOM 고찰(부록 D) **v1.4** — md (**2026-04-21 v1.4 개정 완료**. docx 미생성)

> Gate 1 잔여 md 개정 작업은 모두 완료. docx 산출물은 사업주 검토 요청 시점에 일괄 생성.

## S2 Gate 2 산출물 (선행 완료)
- DE32-1 BOM 도메인 ER 다이어그램 v1.2 (최신)
- DE35-1 표준 BOM 구조 정의서 **v1.6**
- DE11-1 아키텍처 설계서 v1.3
- DE22-1 화면설계서 **v1.6** (분산 구조, 27 화면)
- DE24-1 인터페이스 설계서 **v2.0-r3** (통합본 + admin 인증 + 로그인 비밀번호 전송 암호화, 2,500+ 라인)
- DE33-1 DB 물리 스키마 설계서 **v1.3** (25 엔티티, Flyway V100~V108 확정 — admin 인증 포함)

## BOM 분석 · 질의 상태

- 원본 분석 문서: `docs/참고자료/DHS-AE225-D-1_BOM_정리.md`
- 유니크시스템 질의서 (Q1~Q19): `docs/참고자료/DHS-AE225-D-1_유니크시스템_질의서.docx` — 회신 대기
- 유니크시스템 참고자료 5건 추가 수령(2026-04-15) → 분석 완료, 용어사전 v1.3 으로 정식 흡수
- DE11-1 v1.2 / DE24-1 v1.8 / DE35-1 v1.5 / DE32-1 v1.0 / DE22-1 v1.5 / AN12-1 v1.1 모두 v1.3 정합 (CX1~CX3 검증 통과)
- 미회신 Q (Q9 Phantom, Q11 Level 체계, Q14 자재코드 이중체계, Q16 위치코드 의미 등) 에 대한 확정 해석은 보류 — `[미확정]` / `[검토 중]` 주석으로 표시
- **추가 질의 후보 (2차)** : 우수제품(U-P-*) BOM 20건, PA 단열재 itemCode 부여 규칙, 극단 레이아웃(W6XH1 등) 정의

## 후속 작업 (Gate 1 전후)

### 즉시 (Gate 1 잔여)
- ~~AN14-1 요구사항 추적표(RTM) v1.3/AN12-1 v1.1 반영 갱신~~ — **2026-04-21 v1.1 완료**
- ~~BOM 고찰(부록 D) v1.3 반영 보강~~ — **2026-04-21 v1.4 완료**

> Gate 1 의무 md 개정 모두 완료. 남은 선택 작업: docx 산출물 일괄 생성 (사업주 검토 요청 시점).

### Gate 1 직후
- ~~Flyway 마이그레이션 스크립트 작성~~ — **2026-04-22 DE33-1 v1.2 확정** (23 엔티티 · V1~V9 + V100~V106). 실제 .sql 파일 작성은 소스 레포에서 BE 진행
- ~~DE22-1 신설 화면(SCR-PM-017~020) FE 구현 설계 보완~~ — **완료** (DE22-1 v1.5-r2 → v1.6)
- RuleEngine `wims-rule-engine` 모듈 BE 구현 착수 (DE11-1 §11 명세, §11.7 템플릿 컴파일러 포함)
- **BOM 옵션별규칙 UI 3뷰 체계 FE/BE 구현 착수** — 시뮬레이터 API / 결정표 API / 템플릿 컴파일러. v1.6 에서 **SCR-PM-021/022/023 독립 SCR 승격 완료**. 화면별 URL: `/rules/templates`, `/rules/decision-table`, `/rules/simulate`. DE24-1 v2.0 §5.3.10~12 엔드포인트 스펙 참조
- ~~개방 이슈 (스펙 §개방 이슈 6건)~~ — **2026-04-22 BOM-RULE-UI 스펙 v1-r1 개정 완료**. 6건 모두 결정
- ~~DE33-1 v1.1 개정~~ — **2026-04-22 v1.2 확정**. 개방이슈 #4 (PRODUCT↔DIES_BOOK FK) Phase 2 CR 로 이관
- ~~DE22-1 종합 검증·개정~~ — **2026-04-22 v1.6 완료**. 통폐합 4 + 승격 3 + 공통 보강. 후속: docx 산출물 일괄 생성(사업주 검토 요청 시점)
- **신규 후속:** `project_favorite` Phase 2 FK 적용 타이밍 확정 / SCR-PM-011 modelCode 세그먼트 규칙 변경 시 기존 제품 마이그레이션 정책(FR 추가 후보) / SCR-CM-007 시스템 설정 변경 감사이력 FR 추가 후보 / 글로벌 검색·알림 센터 BE 스펙 별도 정의 필요 (v1.7 후속)
- **2026-04-27 admin 인증 사양 후속:**
  - **Spring Security 전 도메인 ROLE 적용 (Phase 2)** — Phase 1 은 `/api/auth/**` permitAll + 그 외 `/api/**` `authenticated` 까지만. `ROLE_ADMIN`/`ROLE_PM_*`/`ROLE_RULE_EDITOR` 등 세분 ROLE 분기는 Phase 2 사용자/역할 정규화 (DE11-1 §7.3) 와 함께 활성화.
  - **JWT secret rotation 정책** — `JWT_SECRET` 회전 시 무중단 전환 절차 (이중 키 검증 윈도우, kid claim 도입, refresh 강제 만료 정책) 후속 정의 필요.
  - **RSA 공개키 회전 정책 (IF-CM-AUTH-004)** — 현재 정책: 서버 시작 시 메모리 생성 / 재시작마다 자동 회전 / 디스크 저장 X. 후속 결정 필요 항목: (1) 다중 인스턴스 환경에서 sticky session vs 인스턴스별 독립 키 (현재 = 독립 키, SPA 가 매 mount 마다 재발급 권장), (2) 명시적 회전 트리거 엔드포인트 (보안 사고 대응) 필요성, (3) 클라이언트 SDK 의 stale 키 자동 재발급 + 재시도 패턴 표준화, (4) 서버 부팅 지연 (RSA-2048 키 생성 ~수백 ms) 모니터링.
  - **클라이언트 SDK / FE 라이브러리** — Web Crypto API (브라우저) / Java Cipher (Android) / Apple Security framework (iOS) 별 RSA-OAEP-SHA256 암호화 헬퍼 표준화. DE24-1 §3.2.6 의 JS/Kotlin 예시를 SDK 모듈로 추출 검토.
  - **Redis 클러스터 전환** — Phase 1 단일 노드 Redis 운영 가정. 동시접속 30명 이상 / NFR-PF-CM-002 상향 시 Sentinel/Cluster 전환 검토.
  - **`admin_login_history` 파티셔닝 / 보존정책** — 운영 1년차에 연 단위 `login_at` 파티셔닝 vs 단일 테이블 결정 (DE33-1 v1.3 개방이슈 #11). 90일 이상 보관 (NFR-SC-CM-006).
  - **`admin` ↔ `wims_user` 정규화** — Phase 2 사용자 정규화 시점에 `admin` 단일 테이블을 `wims_user` 테이블의 ROLE_ADMIN 행으로 흡수할지 / 별도 테이블 유지할지 결정 (DE33-1 v1.3 개방이슈 #12).

### 변경 관리
- v1.0→v1.3 직접 반영 절차에 PP11-1 §8 변경관리 CR 등록·PM 확인 기록 보완 권장 (V6 지적)
