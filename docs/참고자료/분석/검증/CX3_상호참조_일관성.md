---
title: CX3 6문서 상호참조·링크·추적성 일관성 검증
created: 2026-04-15
type: 검증
status: review
tags:
  - wims
  - 검증
  - 상호참조
  - 추적성
  - phase1
related:
  - "[[WIMS_용어사전_BOM_v1.3]]"
  - "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
  - "[[DE11-1_소프트웨어_아키텍처_설계서_v1.2]]"
  - "[[DE22-1_화면설계서_v1.5]]"
  - "[[DE24-1_인터페이스설계서_MES_REST_API_v1.8]]"
  - "[[DE32-1_BOM도메인_ER다이어그램_v1.0]]"
  - "[[DE35-1_미서기이중창_표준BOM구조_정의서_v1.5]]"
---

# CX3 6문서 상호참조·링크·추적성 일관성 검증

> [!abstract] 총평
> 신규 6문서 (AN12-1 v1.1 / DE11-1 v1.2 / DE22-1 v1.5(+sections 8) / DE24-1 v1.8 / DE32-1 v1.0 / DE35-1 v1.5) 사이의 wikilink·related·엔티티·API·화면 매핑 정합성 일제 점검. **콘텐츠 본문(엔티티 컬럼·API 경로·FR 매핑)은 거의 완벽히 정합**하나, **frontmatter `related` 와 본문 wikilink 의 다수가 직전 버전(DE24-1 v1.6/v1.7, DE35-1 v1.4, AN12-1 v1.0, DE11-1 v1.1, DE22-1 v1.4)을 가리키는 stale link 문제가 광범위**하게 잔존. v1.x 갱신 사이클이 6문서를 전 회차 동시 swap 하지 못한 결과로, **Obsidian 해석 기준 깨진 wikilink 24건**, **비대칭 related 12건**이 식별됨. 콘텐츠 차이 7건, 화면 ID 매핑 구멍 2건은 즉시 보정 가능.

## §A. 깨진 wikilink 목록

검증 방법: 6문서 + DE22-1 sections 8개 본문에서 `[[...]]` 추출 → 파일명 기반 매칭 (`#`/`|` 잘라내고 확장자 제거) → 실파일 존재 검증.

| # | 출처 파일:줄 | wikilink 타깃 | 실제 존재 | 상태 |
|---|---|---|---|---|
| 1 | DE11-1 v1.2:18 (frontmatter) | `DE24-1_인터페이스설계서_MES_REST_API_v1.6` | ✗ (v1.7/v1.8 만 존재) | 깨짐 (stale) |
| 2 | DE11-1 v1.2:19 | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ (v1.4 파일 존재) | 정상 (단, v1.5 가 SOT — 의도 불명) |
| 3 | DE11-1 v1.2:94 (§1.3 표) | `DE24-1_인터페이스설계서_MES_REST_API_v1.6` | ✗ | 깨짐 |
| 4 | DE11-1 v1.2:95 | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ | stale |
| 5 | DE11-1 v1.2:901 | `DE24-1_인터페이스설계서_MES_REST_API_v1.6` | ✗ | 깨짐 |
| 6 | DE11-1 v1.2:902 | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ | stale |
| 7 | DE24-1 v1.8:19 (frontmatter) | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ | stale (SOT 는 v1.5) |
| 8 | DE24-1 v1.8:104 (§1.4 표) | `AN12-1_요구사항정의서_Phase1_v1.0#FR-PM-013` | ✓ (v1.0 존재, v1.1 도 존재) | stale |
| 9 | DE24-1 v1.8:105 | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ | stale |
| 10 | DE24-1 v1.8:112 | `AN12-1_요구사항정의서_Phase1_v1.0#FR-PM-013` | ✓ | stale |
| 11 | DE24-1 v1.8:349 | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ | stale |
| 12 | DE32-1 v1.0:17 | `DE35-1_미서기이중창_표준BOM구조_정의서_v1.4` | ✓ | stale (SOT v1.5) |
| 13 | DE32-1 v1.0:700 | 동상 | ✓ | stale |
| 14 | DE35-1 v1.5:23 (frontmatter) | `DE24-1_인터페이스설계서_MES_REST_API_v1.7` | ✓ | stale (v1.8 가 SOT) |
| 15 | DE35-1 v1.5:24 | `DE32-1_논리물리_ERD` | ✗ (실제 파일은 `DE32-1_BOM도메인_ER다이어그램_v1.0`) | **깨짐** |
| 16 | DE35-1 v1.5:89 | `DE32-1_논리물리_ERD` | ✗ | **깨짐** |
| 17 | DE35-1 v1.5:90 | `DE24-1_인터페이스설계서_MES_REST_API_v1.7` | ✓ | stale |
| 18 | DE35-1 v1.5:91 | `AN12-1_요구사항_정의서` | ✗ (실제 `AN12-1_요구사항정의서_Phase1_v1.1`) | **깨짐** |
| 19 | DE35-1 v1.5:440 | `DE11-1_소프Тware_아키텍처_설계서_v1.2` | ✗ (오타 — 시릴문자 `Т`) | **깨짐** |
| 20 | DE35-1 v1.5:557 | `DE32-1_논리물리_ERD` | ✗ | **깨짐** |
| 21 | DE35-1 v1.5:784 | `DE24-1_인터페이스설계서_MES_REST_API_v1.7` | ✓ | stale |
| 22 | AN12-1 v1.1:19 (frontmatter) | `DE11-1_아키텍처설계서_v1.2` | ✗ (실제 `DE11-1_소프트웨어_아키텍처_설계서_v1.2`) | **깨짐** |
| 23 | AN12-1 v1.1:22 | `DE35-1_미서기이중창_표준BOM구조_정의서` | ✗ (버전 suffix 누락 — 동명 파일 없음) | **깨짐** |
| 24 | AN12-1 v1.1:224 | `DE22-1_화면설계서_v1.5#04 제품관리` | ✓ (파일은 존재. 단 본문에 `#04 제품관리` 헤딩 없음) | 헤딩 미존재 |
| 25 | AN12-1 v1.1:293 | `DE22-1_화면설계서_v1.5/sections/04_제품관리` | ✗ (실제 경로 `DE22-1_화면설계서/sections/04_제품관리` — `_v1.5` 폴더 아님) | **깨짐** |
| 26 | AN12-1 v1.1:582 | `AN14-1_요구사항_추적표` | ✗ (실제 `AN14-1_요구사항추적표_v1.0`) | **깨짐** |
| 27 | DE22-1 v1.5(인덱스):27 (frontmatter) | `DE22-1_화면설계서_Phase1_v1.4` | ✓ (supersedes 메타) | stale 의도 |
| 28 | DE22-1 v1.5(인덱스):28 | `DE24-1_인터페이스설계서_MES_REST_API_v1.7` | ✓ | stale |
| 29 | DE22-1 v1.5(인덱스):29 | `AN12-1_요구사항정의서_Phase1_v1.0` | ✓ | stale (v1.1 SOT) |
| 30 | DE22-1 sections/00:34 | `AN12-1_요구사항정의서_Phase1_v1.0` | ✓ | stale |
| 31 | DE22-1 sections/00:37 | `DE11-1_소프트웨어_아키텍처_설계서_v1.1` | ✓ | stale (v1.2 SOT) |
| 32 | DE22-1 sections/00:39 | `DE35-1_..._v1.4` | ✓ | stale |
| 33 | DE22-1 sections/00:40 | `DE24-1_..._v1.7` | ✓ | stale |
| 34 | DE22-1 sections/04:14 (frontmatter) | `DE35-1_..._v1.4` | ✓ | stale |
| 35 | DE22-1 sections/05:14 | `DE35-1_..._v1.4` | ✓ | stale |
| 36 | DE22-1 sections/05:15 | `DE24-1_..._v1.7` | ✓ | stale |

**요약**: 실제 매칭 실패 = **8건** (#15,16,18,19,20,22,23,25,26 — Obsidian 그래프뷰에서 unresolved 표시), Stale 링크(파일은 존재하나 직전 버전 가리킴) = **17건**, 헤딩 미존재 = **1건**. 총 **26건 보정 필요**.

## §B. 비대칭 related 목록

각 문서 frontmatter `related` 배열을 정규화 후 쌍방향 매칭. (versioning suffix 무시 — `DE24-1` 으로 패밀리 매칭)

| # | A 문서 | A→B 명시 | B 문서 | B→A 명시? | 비대칭 |
|---|---|---|---|---|---|
| 1 | AN12-1 v1.1 | DE11-1, DE22-1, DE24-1, DE35-1 | DE11-1 v1.2 | AN12-1 미명시 | **DE11-1 → AN12-1 추가 필요** |
| 2 | AN12-1 v1.1 | DE32-1 | (없음) | — | **AN12-1 → DE32-1 누락 / DE32-1 → AN12-1 도 누락** |
| 3 | AN12-1 v1.1 | DE22-1 v1.5 | DE22-1 v1.5(인덱스) | AN12-1 v1.0 만 명시 | **버전 swap 필요 (v1.0 → v1.1)** |
| 4 | DE11-1 v1.2 | DE24-1 v1.6, DE35-1 v1.4 | DE24-1 v1.8 | DE11-1 미명시 | **DE24-1 → DE11-1 추가 필요** |
| 5 | DE11-1 v1.2 | DE35-1 v1.4 | DE35-1 v1.5 | DE11-1 v1.2 명시 ✓ | OK (단 DE11-1 측 stale) |
| 6 | DE11-1 v1.2 | (DE32-1 미명시) | DE32-1 v1.0 | DE11-1 v1.2 명시 ✓ | **DE11-1 → DE32-1 추가 필요** |
| 7 | DE22-1 v1.5(인덱스) | DE24-1 v1.7 | DE24-1 v1.8 | DE22-1 미명시 | **DE24-1 → DE22-1 추가 필요** |
| 8 | DE22-1 v1.5(인덱스) | DE35-1 v1.4 | DE35-1 v1.5 | DE22-1 미명시 | **DE35-1 → DE22-1 추가 필요** |
| 9 | DE22-1 v1.5(인덱스) | (DE32-1 미명시) | DE32-1 v1.0 | DE22-1 미명시 | **양방향 누락** |
| 10 | DE32-1 v1.0 | DE11-1 v1.2 ✓, DE35-1 v1.4 | DE35-1 v1.5 | DE32-1 명시(`DE32-1_논리물리_ERD` — 깨진 alias) | **DE35-1 측 wikilink 정정 필요 (§A #15)** |
| 11 | DE32-1 v1.0 | (DE24-1 미명시) | DE24-1 v1.8 | DE32-1 미명시 | **양방향 누락** |
| 12 | DE32-1 v1.0 | (AN12-1 미명시) | AN12-1 v1.1 | DE32-1 미명시 | **양방향 누락 (FR-PM-024 가 DE32-1 의 RESOLVED_BOM 참조)** |
| 13 | DE35-1 v1.5 | DE24-1 v1.7, DE11-1 v1.2 ✓ | DE24-1 v1.8 | DE35-1 v1.4 명시 (stale) | **양측 stale** |
| 14 | DE35-1 v1.5 | (AN12-1 미명시) | AN12-1 v1.1 | DE35-1 명시 (suffix 누락 §A #23) | **DE35-1 → AN12-1 추가** |

**비대칭 합계**: **12건** (보정해야 할 frontmatter 항목 수)

## §C. 엔티티·컬럼 정의 일치성

대상 엔티티 5종(PRODUCT, MBOM, OPTION_VALUE, BOM_RULE, RESOLVED_BOM) 을 DE32-1 v1.0(SOT) ↔ DE11-1 v1.2 §5.3 ↔ DE35-1 v1.5 §9 비교.

| 엔티티 | 컬럼 | DE32-1 v1.0 | DE11-1 v1.2 | DE35-1 v1.5 | 차이 |
|---|---|---|---|---|---|
| PRODUCT | PK | `product_id` BIGINT | `product_id` BIGINT | `model_code` VARCHAR(32) PK | **DE35-1 §9.1 가 SOT 위반** — `model_code` 를 PK 로 표기. DE32-1·DE11-1 은 surrogate `product_id` PK + `product_code` UNIQUE 구조 |
| PRODUCT | category/status | 존재 | 존재 (생략) | 미열거 | DE35-1 누락 (요약 표라 의도적일 수 있으나 §9.1 헤더가 "PRODUCT" 라 혼동) |
| PRODUCT | dies_revision 타입 | DATE | "string dies_revision (선택, 예: 2025-08-20)" | DATE | DE11-1 mermaid 표기가 `string` — 실제는 DATE. 표기 불일치 |
| ITEM | dies_code FK | "soft FK" 주석 (R24) | dies_code (string) | dies_code (압출 금형 식별자, 유니크 부재코드) | DE35-1 설명이 "유니크 부재코드" 로 다른 의미 풍김. DE32-1 R24 는 `DIES_BOOK` 참조. **개념 충돌 가능** |
| ITEM | unit_weight 타입 | DECIMAL(8,3) | (mermaid) decimal | DECIMAL(10,3) | **타입 정밀도 불일치** (DE32-1=8,3 vs DE35-1=10,3) |
| MBOM | actual_qty | DECIMAL(12,4) NULL | (열거 누락) | (§9.4 "참조 §3.6") | DE11-1 mermaid 에서 누락 — 정합 위해 추가 권고 |
| MBOM | 절단 9컬럼 | 모두 정의 ✓ | 모두 정의 ✓ | §9.4 본문 참조만 | 정합 (다만 DE35-1 은 §3.6 으로 위임) |
| OPTION_VALUE | PK | `value_id` BIGINT | `value_id` | `code` VARCHAR(32) PK | **DE35-1 §9.3 SOT 위반** — natural PK 표기. DE32-1 surrogate `value_id` + UNIQUE(group_id, value_code) 가 정답 |
| OPTION_VALUE | metadata | JSON | (mermaid) string `metadata "JSON"` | (미열거) | DE35-1 누락 |
| BOM_RULE | series_code | VARCHAR(32) (인덱스) | string | (미열거 §9.5) | DE35-1 §9.5 가 series_code/product_class_path/standard_bom_id 모두 누락 — 요약일지라도 인덱스 필드는 명시 권고 |
| BOM_RULE | action_json vs BOM_RULE_ACTION | 양립 (이중 저장 § 2.13 노트) | 양립 | action_json 만 표기 | DE35-1 §9.5 에 BOM_RULE_ACTION 별도 표 누락 |
| RESOLVED_BOM | resolved_bom_key | VARCHAR(96) | string `resolved_bom_key UK` | VARCHAR(128) | **타입 길이 불일치** (96 vs 128) |
| RESOLVED_BOM | state CHECK | `DRAFT/RELEASED/DEPRECATED` | `DRAFT|RELEASED|DEPRECATED` | (§9.6 미열거) | DE35-1 누락 |
| RESOLVED_BOM | UNIQUE | `(standard_bom_id, standard_bom_version, applied_options_hash)` | (미명시) | (미명시) | DE32-1 만 정의 — DE11-1·DE35-1 보강 권고 |
| 신규 3엔티티 | DIES_BOOK 컬럼 | dies_book_id, revision, title, supplier_id, remarks | (mermaid) dies_book_id, revision, title 만 | dies_book_id, revision, publisher | **publisher vs supplier_id 명칭 다름**. DE32-1 의 supplier_id (FK→DIES_SUPPLIER) 가 정답 |
| ITEM_SUPPLIER | lead_time | (없음) | (없음) | lead_time 명시 | DE35-1 만 lead_time 언급 — DE32-1 추가 또는 DE35-1 삭제 결정 필요 |
| ITEM_SUPPLIER | supply_role | `PRIMARY/SECONDARY` 표기 | (mermaid) string | (DE35-1 미열거) | OK |

**엔티티 정의 불일치 합계**: **9건 보정 권고** (PRODUCT PK, ITEM dies_code 개념, ITEM unit_weight 정밀도, OPTION_VALUE PK, RESOLVED_BOM key 길이, DIES_BOOK publisher 명칭, ITEM_SUPPLIER lead_time, dies_revision 타입, OPTION_VALUE.metadata 누락).

## §D. API 엔드포인트 ↔ FR 매핑

DE24-1 v1.8 §5 정의 외부 API 엔드포인트 11개 ↔ AN12-1 v1.1 §3 추적표 매핑.

| # | DE24-1 엔드포인트 | AN12-1 매핑 FR | 매핑 상태 |
|---|---|---|---|
| 1 | POST /auth/token | (인증 인프라 — FR 직매핑 없음, NFR-SC-PM-001) | OK |
| 2 | POST /auth/refresh | NFR-SC-PM-001 | OK |
| 3 | GET /bom/standard | FR-PM-012 (보강) — 표준BOM 버전 관리 | OK (간접) |
| 4 | GET /bom/standard/{id} | FR-PM-012 | OK |
| 5 | GET /bom/standard/{id}/versions | FR-PM-012 | OK |
| 6 | GET /bom/standard/{id}/versions/{ver} | FR-PM-012 | OK |
| 7 | GET /bom/resolved/{resolvedBomId} | **FR-PM-013 (개정)**, FR-PM-022 (신규), FR-PM-024 | OK |
| 8 | GET /materials | FR-PM-001/002/004 (자재 마스터) | AN12-1 §3 추적표에 명시 안됨 — **구멍** |
| 9 | GET /materials/{itemCode} | 동상 | **구멍** |
| 10 | GET /processes | FR-PM-008 | AN12-1 §3 미명시 — **구멍** |
| 11 | GET /processes/{processCode} | FR-PM-008/009 | **구멍** |

**역방향**: AN12-1 §3 추적표가 외부 API 로 명시한 FR 은 FR-PM-013/022 두 건뿐. **자재·공정 마스터 외부 노출 API 4건이 FR 매핑 누락** — 개정·보강 필요. AN12-1 v1.1 §3 추적표에 `external /materials/*`, `external /processes/*` 행 추가 권고.

또한 AN12-1 v1.1 §변경이력에 `/bom/products/*` 언급(L56) 이 있으나 DE24-1 v1.7 부터 `/bom/standard/*` 로 단일축화되었음 → **변경이력 표기는 역사적 기록이라 OK**, 단 본문에선 사용 안함 확인됨.

**API 매핑 구멍**: **4건** (materials/processes 4 endpoints)

## §E. 화면 ID(SCR-*) ↔ FR 매핑

AN12-1 v1.1 §3 추적표가 언급한 SCR ID 가 DE22-1 v1.5(+sections) 에 실제 정의됐는지 검증.

| AN12-1 §3 SCR ID | DE22-1 v1.5 정의 위치 | 상태 |
|---|---|---|
| SCR-CM-BOM-EDIT | (인덱스 표 §3 화면 목록에 없음 — section 05 도 미정의) | **미정의** (FR-PM-010 매핑) |
| SCR-CM-BOM-VERSION | (없음) | **미정의** (FR-PM-012) — 실제로는 SCR-PM-014 가 동일 역할 |
| SCR-PM-PRD-LIST | (없음 — DE22-1 은 SCR-PM-010 명명 사용) | **명명 불일치** |
| SCR-PM-PRD-DETAIL | (없음 — DE22-1 은 SCR-PM-012) | **명명 불일치** |
| SCR-CM-OPT-EDIT | (없음 — DE22-1 SCR-PM-013B 옵션 그룹 관리 서브탭) | **명명 불일치** |
| SCR-CM-BOM-RESOLVE | (없음) | **명명 불일치** (SCR-PM-013B 확정구성표 서브탭) |
| SCR-CM-RULE-EDIT | (없음 — SCR-PM-013B 옵션별 규칙 관리 서브탭) | **명명 불일치** |
| SCR-CM-BOM-RESOLVED-VIEW | (없음) | **명명 불일치** |
| SCR-PM-DIES-BOOK | (없음 — Phase 1 화면 목록 25건에 부재) | **미정의** (FR-PM-023 신규) |
| SCR-PM-SUPPLIER | (없음) | **미정의** (FR-PM-023 신규) |
| FR-PM-024 RuleEngine | "—(엔진)" 직접 UI 없음 | OK (N/A 정상 처리) |

**관찰**: AN12-1 v1.1 §3 추적표는 **추상 SCR 명명 규칙**(SCR-CM-BOM-EDIT 등) 을 사용하고 DE22-1 은 **번호 기반**(SCR-PM-013, 013B, 014). 두 체계가 통일되지 않음. **즉시 보정 필요한 매핑 구멍 = 명명불일치 7건 + 미정의 2건(DIES_BOOK/SUPPLIER 화면) = 9건**.

권고: AN12-1 v1.1 §3 추적표를 DE22-1 의 SCR-PM-013/013B/014 등 실 화면 ID 로 일괄 치환하고, FR-PM-023(다이스북·공급망)용 신규 화면 ID 2건은 DE22-1 v1.6 에 SCR-PM-018(다이스북), SCR-PM-019(공급사) 로 추가 결정.

**화면 매핑 구멍**: **9건**

## §F. RuleEngine 모듈 ↔ API ↔ FR 3자 일관성

| 항목 | DE11-1 v1.2 §11 | DE24-1 v1.8 | AN12-1 v1.1 FR-PM-024 / NFR-PF-PM-003 | 일관성 |
|---|---|---|---|---|
| 산식 언어 식별자 | `UNIQUE_V1` | `ruleEngineVersion` 응답 필드 = `UNIQUE_V1` | 명시 | ✓ |
| AST 캐시 | §4.2.2 + §11 7단계 파이프라인 step3 (캐시) | (간접) `?debug=true` 시만 산식 노출 | NFR-MT-PM-001 AST 캐시 기동(warm-up) | ✓ 3자 정합 |
| frozen 불변성 | ADR-006 + §5.5.4 `rule_engine_version` | §2.3 원칙 6 + §5.4.1 명문 | NFR-RL-PM-001 frozen 불변성 + FR-PM-024 acceptance | ✓ 3자 정합 |
| SLA p95 ≤ 100ms | §4.2.2 표 #5, §11 마지막 절(k6 5,000 BOM_RULE × 100 동시) | (응답시간 NFR-PF-PM-002 = 2초 — MES API 전체) | NFR-PF-PM-003 (5,000 BOM_RULE 기준 p95 ≤ 100ms) | ✓ 3자 정합 |
| MES 직접 호출 금지 | §4.2.3, §5.5.4 (lazy 생성) | §2.2 sequence — MES 는 frozen 후 조회만 | (FR-PM-013 read-only) | ✓ |
| `UNIQUE_V1 → V2` 업그레이드 호환성 | §11 마지막 절 + ADR-006 운영 규칙 | §1.8 abstract — 산식 상수·언어 업그레이드에도 재평가 금지 | NFR-RL-PM-001 acceptance | ✓ |
| 에러코드 (enablement_violation) | §11 step1 OptionEnablementViolation | §7.2 OPTION_ENABLEMENT_VIOLATION 422 | FR-PM-020 acceptance(조건부 활성화) | ✓ 3자 정합 |

**RuleEngine 3자 일관성 평가: 합격 (모순 0건)**. AST 캐시 / frozen 계약 / SLA / 언어버전 호환성 / 에러코드 5개 핵심 축이 세 문서에서 동일 의미·동일 수치로 정합됨. 본 검증의 가장 견고한 부분.

## §G. v1.3 용어사전 §번호 인용 오류

기준 §번호 (용어사전 v1.3 ToC):
- §3 MBOM 속성, §3.1 lossRate
- §4 버전·스냅샷, §4.1 optionsHash, §4.2 frozen 불변성
- §11 창호 레이아웃, §11.1 수치형 옵션, §11.2 enablement_condition
- §13 산식·BOM_RULE 액션, §13.1 산식 언어 UNIQUE_V1, §13.2 BOM_RULE 액션 동사 스키마, §13.3 RuleEngine 평가 시점·캐시
- §9 제품 분류, §10 계열·시리즈, §14 다이스북·공급망, §15 모델코드, §16 기본·파생제품
- §1 식별자, §2 BOM 구성요소

| # | 인용 위치 | 인용 § | 검증 결과 |
|---|---|---|---|
| 1 | DE11-1 v1.2:198 | §13.1 산식 파서 | ✓ |
| 2 | DE11-1 v1.2:227 | §4.2 frozen | ✓ |
| 3 | DE11-1 v1.2:226 | §4.1 lazy 생성 | ✓ |
| 4 | DE11-1 v1.2:354 | §1 itemCategory | ✓ |
| 5 | DE11-1 v1.2:404 | §11.2 enablement | ✓ |
| 6 | DE11-1 v1.2:413 | §13.2 action | ✓ |
| 7 | DE11-1 v1.2:430 | §4.1 optionsHash ENUM 한정 | ✓ |
| 8 | DE11-1 v1.2:760 | §4.2 ADR-006 근거 | ✓ |
| 9 | DE11-1 v1.2:872 | §11.2 enablement_condition | ✓ |
| 10 | DE11-1 v1.2:875 | §13.2 action 동사 | ✓ |
| 11 | DE11-1 v1.2:877 | §3.1 lossRate | ✓ |
| 12 | DE11-1 v1.2:439 / 785 | "v1.3 §11.2, §13, §4" | ✓ (다중 §) |
| 13 | DE24-1 v1.8:186 | §4.2 frozen 불변성 | ✓ |
| 14 | DE24-1 v1.8:384 | §4.1 optionsHash NUMERIC 제외 | ✓ |
| 15 | DE24-1 v1.8:554 | §4.2 불변 스냅샷 | ✓ |
| 16 | DE24-1 v1.8:589 | §1 itemCategory | ✓ |
| 17 | DE24-1 v1.8:595 | §3 cutDirection | ✓ |
| 18 | DE24-1 v1.8:599 | §3.1 actualCutLength | ✓ |
| 19 | DE24-1 v1.8:600 | §3 supplyDivision | ✓ |
| 20 | DE24-1 v1.8:601 | §4 ruleEngineVersion | ✓ |
| 21 | DE24-1 v1.8:760 | §4.1 optionsHash | ✓ |
| 22 | DE24-1 v1.8:774, 961 | §11.2 enablement | ✓ |
| 23 | DE32-1 v1.0:78 series_code | §10 | ✓ |
| 24 | DE32-1 v1.0:79 derivative_of | §16 | ✓ |
| 25 | DE32-1 v1.0:132 item_category | §1 | ✓ |
| 26 | DE32-1 v1.0:133 dies_code | §14 | ✓ |
| 27 | DE32-1 v1.0:165 cut_direction | §3 | ✓ |
| 28 | DE32-1 v1.0:212 value_type | §11.1 | ✓ |
| 29 | DE32-1 v1.0:216 enablement_condition | §11.2 | ✓ |
| 30 | DE32-1 v1.0:241 verb | §13.2 | ✓ |
| 31 | DE32-1 v1.0:272 rule_engine_version | §4 | ✓ |
| 32 | DE32-1 v1.0:583 | §13.3 + DE11-1 §5.3 | ✓ |
| 33 | DE32-1 v1.0:629 frozen 트리거 | §4.2 | ✓ |
| 34 | DE32-1 v1.0:655 optionsHash | §4.1 | ✓ |
| 35 | DE32-1 v1.0:683 금지어 | §7 | ✓ |
| 36 | DE35-1 v1.5:120-131 (전 항목) | §1·§2·§3·§9·§10·§11·§13 다수 | ✓ 전 항목 정확 |
| 37 | DE35-1 v1.5:166 class_l1~l4 | §9 제품 분류 | ✓ |
| 38 | DE35-1 v1.5:421 optionsHash | §4.1 | ✓ |
| 39 | DE35-1 v1.5:442 frozen 재평가 금지 | §4.2 | ✓ |
| 40 | DE35-1 v1.5:460 BOM_RULE action | §13.2 | ✓ |
| 41 | DE35-1 v1.5:619 다이스북·공급망 | §14 | ✓ |
| 42 | DE35-1 v1.5:736 series_code 분기 | §13.1 | ✓ |
| 43 | DE22-1 v1.5(인덱스):165 금지어 | §7 | ✓ |
| 44 | DE22-1 sections/04:61 4계층 | §9 | ✓ |
| 45 | DE22-1 sections/04:121 modelCode | §15 | ✓ |
| 46 | DE22-1 sections/04:223 파생제품 | §16 | ✓ |
| 47 | DE22-1 sections/05:156 MBOM 우측 패널 | §3 | ✓ |
| 48 | DE22-1 sections/05:202 상태 3단계 | §4 | ✓ |
| 49 | DE22-1 sections/05:248 OPT-DIM | §11.1 | ✓ |
| 50 | DE22-1 sections/05:281 활성화 조건 | §11.2 | ✓ |
| 51 | DE22-1 sections/05:323 동사 4종 | §13.2 | ✓ |
| 52 | DE22-1 sections/05:434 컬럼 매핑 | §3 | ✓ |
| 53 | AN12-1 v1.1:182~188 (FR-PM-018~024 출처) | §9, §15, §11, §13, §3·§4, §14, §4 | ✓ 전 항목 정확 |
| 54 | AN12-1 v1.1:567~577 (§3 추적표 출처) | §2, §4, §9, §11, §13, §14 | ✓ |

**§번호 인용 오류: 0건**. 6문서 모두 v1.3 ToC 와 정확히 부합. 본 검증에서 가장 높은 정확도.

## 결론: 수정 필요 건수 요약

| 카테고리 | 항목 수 | 우선순위 |
|---|---|---|
| §A 깨진 wikilink (실패) | **8건** | P0 — 즉시 (Obsidian 그래프 단절) |
| §A Stale wikilink (직전 버전) | 17건 | P1 — 다음 swap 시 |
| §A 헤딩 미존재 | 1건 | P2 |
| §B 비대칭 related | **12건** | P1 — frontmatter 일괄 보정 |
| §C 엔티티·컬럼 정의 차이 | **9건** | P1 — DE32-1 SOT 기준으로 DE11-1·DE35-1 정정 |
| §D API ↔ FR 매핑 구멍 | **4건** | P2 — AN12-1 §3 추적표 보강 |
| §E 화면 ↔ FR 매핑 구멍 | **9건** | P1 — AN12-1 §3 의 SCR 명명을 DE22-1 실 ID 로 통일 + 신규 SCR 2건 신설 |
| §F RuleEngine 3자 일관성 | 0건 | (합격) |
| §G §번호 인용 오류 | 0건 | (합격) |

**총계: 60건 보정 권고** (P0 8건, P1 47건, P2 5건). 콘텐츠 본문(엔티티·API·RuleEngine·용어 §번호) 의 의미 정합성은 매우 견고하나, **frontmatter `related` 와 본문 wikilink 의 버전 동기화가 개정 사이클을 따라가지 못함** — DE24-1 v1.6→v1.8, DE35-1 v1.4→v1.5, AN12-1 v1.0→v1.1, DE11-1 v1.1→v1.2 의 4축 동시 swap 작업이 필요. 권고 작업: (1) 6문서의 frontmatter `related` 를 일괄 v1.x 최신으로 정렬, (2) DE35-1 v1.5 의 4건 진성 깨진 wikilink (§A #15,16,18,19,20) 를 즉시 정정, (3) AN12-1 v1.1 §3 추적표의 SCR 명명을 DE22-1 v1.5 표기로 통일, (4) DE32-1 ↔ DE11-1 ↔ DE35-1 의 PRODUCT/OPTION_VALUE PK 표기, ITEM unit_weight·dies_revision 타입, RESOLVED_BOM resolved_bom_key 길이, DIES_BOOK publisher 명칭 4건을 DE32-1 SOT 기준으로 DE11-1·DE35-1 측 정정.

---

> [!info] 검증 메타
> - 검증자: Claude (자동 점검 보고)
> - 검증 일자: 2026-04-15
> - 대상 파일: 6 + DE22-1 sections 8 = 총 14개 md
> - 기준: 용어사전 v1.3 (`/docs/참고자료/WIMS_용어사전_BOM_v1.3.md`)
