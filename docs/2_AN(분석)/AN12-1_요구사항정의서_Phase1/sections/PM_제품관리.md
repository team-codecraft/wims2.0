---
title: PM 제품관리 요구사항 상세 (AN12-1 Phase1 v1.1-r2)
parent: "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
version: 1.1-r2
updated: 2026-04-23
type: 분석
status: review
tags: [wims, 분석, 요구사항정의서, phase1, pm, 제품관리]
related:
  - "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
  - "[[AN12-1_요구사항정의서_Phase1/sections/00_공통_원칙_ID체계]]"
  - "[[AN12-1_요구사항정의서_Phase1/sections/CM_공통]]"
  - "[[DE22-1_화면설계서_v1.6]]"
  - "[[DE24-1_인터페이스설계서_v2.0]]"
  - "[[DE35-1_미서기이중창_표준BOM구조_정의서_v1.5]]"
  - "[[AN14-1_요구사항추적표_v1.2]]"
  - "[[WIMS_용어사전_BOM_v1.4]]"
---

# PM 제품관리 요구사항 상세

> [!abstract]
> 제품관리(PM) 서브시스템 Phase 1 기능·비기능 요구사항 전체. v1.0 계승 FR 17건 + v1.1 신규 FR 10건 + v1.1 개정 FR 4건 = **24건** (FR-PM-007 불수용 별도) + NFR 13건.
> 각 FR 에는 `v1.0 계승` · `v1.1 개정` · `v1.1 신규` 배지로 차수 구분.
> v1.1-r2 분산 구조 재편 (2026-04-23).

## 1. 개요

### 1.1 PM 서브시스템 범위

WIMS 2.0 **제품관리(Product Management)** 서브시스템은 자재·거래처·공정·제품·표준 BOM(EBOM/MBOM/Config)·옵션별규칙(BOM_RULE)·확정구성표(Resolved BOM)·파생제품·다이스북·공급망·프로젝트 기본 CRUD 를 관할한다. MES 외부 시스템의 단방향 조회 창구(`/api/external/v1/**`) 도 PM 도메인에 포함된다.

### 1.2 화면·API 대응 (요약)

| 영역 | 주요 화면 (DE22-1 v1.6) | 주요 API (DE24-1 v2.0) |
|------|------------------------|-----------------------|
| 자재관리 | SCR-PM-001/002/003 | internal /materials/** |
| 거래처·단가 | SCR-PM-004/006 | internal /partners/**, /materials/{code}/prices |
| 공정관리 | SCR-PM-007 (통합) | internal /processes/** |
| 제품관리 | SCR-PM-010/011/012/017 | internal /products/** |
| 공급망 | SCR-PM-018/019/020 | internal /dies-books/**, /suppliers/**, /items/{code}/suppliers |
| BOM 관리 | SCR-PM-013/013B/014 | internal /bom/**, external /bom/resolved/** |
| 옵션별규칙 | SCR-PM-021/022/023 | internal /bom/rules/**, /bom/rules/simulate |
| 프로젝트 | SCR-PM-015/016 | internal /projects/** |

## 2. 기능 요구사항 (FR-PM)

> 배지 표기: `v1.0 계승` — v1.0 정의 불변 / `v1.1 개정` — v1.1 에서 정의 변경 / `v1.1 신규` — v1.1 에서 최초 추가

### 2.1 자재관리 FR

#### FR-PM-001 원자재 규격 정보 등록·관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 |
| **난이도** | 하 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | AN11-2, 개발계획서 §3.2① |
| **관련 화면** | SCR-PM-001, SCR-PM-002, SCR-PM-003 |
| **관련 요구사항** | FR-PM-003, FR-PM-004, FR-PM-023 |

**개요:** 커튼월·창호 원자재(프로파일·유리·하드웨어 등) 의 규격 정보(재질·치수·단위·중량·제조사)를 등록·수정·조회한다. 자재코드 `itemCode` 단일 체계. 상세 스펙은 `[[AN12-1_요구사항목록_v1.5]]` 및 v1.0 본문 참조.

---

#### FR-PM-002 부자재 규격 정보 등록·관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 |
| **난이도** | 하 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-001 (부자재 탭), SCR-PM-002, SCR-PM-003 |

**개요:** 실리콘·가스켓·스크류 등 부자재를 원자재와 동일한 `itemCode` 체계로 관리. `itemCategory ∈ {PROFILE, GLASS, HARDWARE, CONSUMABLE, SEALANT, SCREEN}` 분류.

---

#### FR-PM-003 구매 단가 이력 관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-003, SCR-PM-006 |
| **관련 요구사항** | FR-PM-023 (공급망 연계) |

**개요:** 자재별·거래처별 구매 단가 이력을 effective_from/effective_to 시점 축으로 관리. 소급 적용 차단(FR-CM-005-06 오류 수정 연계).

---

#### FR-PM-004 자재 코드 체계 표준화 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | AN11-2 만족도 1.33점 |

**개요:** 기존 무질서한 자재 코드를 표준 체계(카테고리 + 시리즈 + 일련번호) 로 통일. 중복 등록 차단 유일성 검증(FR-CM-005-05 오류 수정 연계).

---

#### FR-PM-005 자재 등록 간소화 및 복사 기능 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 |
| **난이도** | 하 / **우선순위** 중 / **수용여부** 수용 |

**개요:** 기존 자재를 복사하여 신규 자재 등록 시 공통 속성을 자동 승계. AN11-2 핵심 요청#9 반영.

---

#### FR-PM-006 자재 필요수량 자동 산출 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 (견적설계와 연계) |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-013 |

**개요:** BOM 계층 + 제품 수량 기반으로 자재 필요수량을 자동 산출. Phase 2 ES(견적설계) 의 발주 탭과 연계.

---

#### ~~FR-PM-007 자재 단가 자동 업데이트~~ `불수용`

| 항목 | 내용 |
|------|------|
| **수용여부** | **불수용** (외부 연동 시스템 미정의, MES 자재단가 미관리) |

**사유:** 외부 단가 시스템이 미정의 상태이며, MES 는 자재단가를 관리하지 않음. 향후 Phase 2 이후 재검토 가능.

### 2.2 공정관리 FR

#### FR-PM-008 공정 유형별 등록 및 관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 공정관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-007 (v1.6 통합 화면, GNB 독립 메뉴) |

**개요:** 절단·가공·조립·검사 등 공정 유형별 기본 정보(공정코드·공정명·설명)를 등록·관리.

---

#### FR-PM-009 공정별 규격 및 제조 단가 관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 공정관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-007 (상세 [규격·단가] 탭) |

**개요:** 공정별 표준 시간·단가·거래처(외주 공정) 등 규격 정보를 관리. Phase 2 MF(제조관리) 작업 시간 산출의 기초.

### 2.3 BOM 관리 FR

#### FR-PM-010 다단계 제조 BOM 구성 `v1.1 개정`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 |
| **난이도** | 상 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | 개발계획서 §3.2①, DE35-1 v1.5, 용어사전 v1.4 §2 |
| **관련 요구사항** | FR-PM-011, FR-PM-012, FR-PM-013, FR-PM-020, FR-PM-021, FR-PM-022, FR-PM-024 |
| **관련 화면** | SCR-PM-013 (BOM 트리뷰), SCR-PM-013B (옵션 구성/확정 구성표), SCR-PM-014 (버전 관리) |

**v1.1 개정 포인트:**
- v1.0 의 "BOM" 단일 개념을 용어사전 v1.4 §2 에 따라 **표준 BOM = 자재구성(EBOM) + 공정구성(MBOM) + 옵션구성(Config) 불가분 묶음** 으로 재정의
- UI 용어 통일: EBOM → "자재구성" / MBOM → "공정구성" / Config → "옵션구성" / BOM_RULE → "옵션별규칙" / Resolved → "확정구성표"
- `EBOM_MBOM_MAP` 을 통한 기능군(구조부/유리부/개폐부/밀봉부/방충부) ↔ 공정 노드 다대다 매핑 명시
- `isPhantom=TRUE` Phantom Explosion 지원

**계승된 v1.0 요구사항:** 최대 5단계 계층, 드래그&드롭 편집, 자재 명세, 공정 정보 통합 (v1.0 §FR-PM-010 본문 유효).

---

#### FR-PM-011 BOM 계층 구조 트리 뷰 GUI `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 |
| **난이도** | 상 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-013 (v1.6 가상스크롤·검색·미니맵 추가) |

**개요:** BOM 계층을 트리 뷰 GUI 로 탐색·편집. v1.6 에서 가상스크롤(`@tanstack/react-virtual`)·전체 검색 하이라이트·경로 필터 pill·미니맵 보강.

---

#### FR-PM-012 표준 BOM 버전 관리 및 변경 이력 추적 `v1.1 개정`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **관련 요구사항** | FR-PM-010, FR-PM-011, FR-PM-013, FR-PM-022, FR-PM-024 |
| **관련 화면** | SCR-PM-014 |

**v1.1 보강 포인트 (v1.0 단일 버전축 모델 계승 + 확장):**
- RESOLVED_BOM 상태값 명시: `DRAFT` (편집, MES 미노출) / `RELEASED` (MES 조회 가능, 구조 변경 불가) / `DEPRECATED` (신규 바인딩 불가, 이력 조회만)
- frozen 전환 트리거 3종 명시: T1 견적서 CONFIRMED / T2 작업지시 RELEASED / T3 PM UI 명시적 "확정" 버튼
- `resolvedBomId = RBOM-{standardBomId}-sbv{N}-{optionsHash}` 결정적 생성, `optionsHash` 는 ENUM 옵션만으로 계산 (NUMERIC 옵션은 해시 제외 — 카디널리티 폭발 차단)
- `ruleEngineVersion` 을 Resolved 에 기록 (frozen 후 산식 언어 업그레이드 대비)
- **v1.1-r1 추가:** `BOM_RULE` 확장 5컬럼(template_id, template_instance_id, slot_values, scope_type, estimate_id) — 용어사전 v1.4 §13.4, DE35-1 §6.5.2 근거. DRAFT → RELEASED 전환은 EBOM·MBOM·Config·BOM_RULE 를 원자 번들로 묶어 수행
- **scope_type=ESTIMATE 오버레이 원칙:** PM 마스터 규칙 + 견적 예외 규칙을 동일 `BOM_RULE` 테이블의 `scope_type` 축으로 저장. RuleEngine resolve 시 MASTER 평가 후 ESTIMATE 오버레이 (Phase 2 ES 서브시스템 상세 설계에서 확정)

---

#### FR-PM-013 MES 연동 BOM 데이터 인터페이스 `v1.1 개정`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 > MES 연동 |
| **난이도** | 상 / **우선순위** 최상 / **수용여부** 수용 |
| **관련 요구사항** | FR-PM-010, FR-PM-012, FR-PM-022, NFR-IF-PM-001, NFR-PF-PM-002 |

**v1.1 개정 포인트 (DE24-1 v1.8 기준):**

1. **응답 DTO 확장 — 8개 신규 필드:**

| 필드 | 타입 | 의미 |
|------|------|------|
| `cutDirection` | String? | 절단 방향 enum (W/H/W1/H1/H2/H3) |
| `cutLength` | BigDecimal? | 1차 절단 길이 평가값 (mm) |
| `cutLength2` | BigDecimal? | 2차 절단 길이 평가값 (유리 세로 등) |
| `cutQty` | BigDecimal? | 절단 개수 평가값 |
| `actualCutLength` | BigDecimal? | `cutLength × (1 + lossRate)` |
| `supplyDivision` | String? | 공통 / 외창 / 내창 (폐기 용어 대체) |
| `frozen` | Boolean | snapshot 불변 여부 |
| `itemCategory` | enum | PROFILE/GLASS/HARDWARE/CONSUMABLE/SEALANT/SCREEN |

2. **쿼리 파라미터 지원:**
   - `GET /api/external/v1/bom/resolved/{resolvedBomId}?supplyDivision=외창`
   - 추가: `?itemCategory=PROFILE,GLASS` 자재 카테고리 필터

3. **`/cutting-bom/{cuttingBomKey}` 엔드포인트 철회:** v1.1 의 신설안은 철회, 기존 `/bom/resolved/{resolvedBomId}` 에 절단 속성 포함 반환.

4. **단방향 읽기 전용 원칙 유지:** POST/PUT/DELETE 엔드포인트 제공 안 함.

5. **MES 권한:** `ROLE_MES_READER` — GET 전용, 외부 경로(`/api/external/v1/**`) 만 허용.

### 2.4 제품관리 FR

#### FR-PM-014 제품 분류 체계 관리 `v1.1 개정`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 제품관리 |
| **난이도** | 하 / **우선순위** 상 / **수용여부** 수용 |
| **관련 요구사항** | FR-PM-015, FR-PM-016, FR-PM-018 |
| **관련 화면** | SCR-PM-010, SCR-CM-006 (코드 공급처) |

**v1.1 개정 포인트 (용어사전 v1.4 §9):**
- **분류 체계를 자유 계층이 아닌 4축 고정 구조**로 확정: `productClassPath = L1 대분류 / L2 계약구분 / L3 유리사양 / L4 치수크기`
- 값 예시:
  - L1 ∈ {`미서기`, `커튼월`}
  - L2 ∈ {`마스`, `우수`}
  - L3 ∈ {`삼중`, `복층`}
  - L4 ∈ {`특대(165)`, `대(135)`, `중(105)`, `소(75)`} (커튼월) / {`160`, `225`, `226`} (미서기)
- 저장 위치: `PRODUCT` 엔티티의 `class_l1 ~ class_l4` 4개 컬럼 (또는 `product_class_path` 단일 파생 필드) — **별도 분류 엔티티 불필요**
- v1.0 의 "자유 3단계 트리" 조항 폐기 → FR-PM-018 의 체크박스 트리 필터로 흡수

---

#### FR-PM-015 제품 코드 부여 및 관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 제품관리 |
| **난이도** | 하 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-010, SCR-PM-011 |

**개요:** 제품 코드 `modelCode` (예: `DHS-AE225-D-1`) 부여 규칙 표준화. 세그먼트 값은 SCR-CM-006 코드관리(`CODE_CATALOG`) 에서 공급.

---

#### FR-PM-016 제품 메타 정보 등록·조회 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 제품관리 |
| **난이도** | 하 / **우선순위** 중 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-012 |

**개요:** 제품 설명·이미지·스펙 등 메타 정보 관리.

---

#### FR-PM-017 프로젝트 등록·수정·삭제·상태관리 `v1.0 계승`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 프로젝트 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **관련 화면** | SCR-PM-015, SCR-PM-016 (v1.6: Phase 2 탭 숨김·배너) |

**개요:** 프로젝트 CRUD 및 상태(전체/내/관심/종료) 관리. Phase 2 견적·발주·실행예산 탭은 Phase 1 빌드에서 숨김 처리.

---

#### FR-PM-018 제품 4계층 분류 체계 관리 및 트리 필터 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 제품관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | 용어사전 v1.3 §9, DE22-1 v1.5 §4, V3 §2.1 |
| **관련 요구사항** | FR-PM-014, FR-PM-015, FR-PM-016, FR-PM-019 |
| **관련 화면** | SCR-PM-010 (제품 목록), SCR-PM-012 (제품 상세) |

**상세 설명:** 제품 50모델을 **4축 체크박스 트리** 로 필터링·분류하며, `modelCode` 의 코드 세그먼트를 자동 디코딩하여 상세 화면에 표시한다.

**주요 기능:**
1. **체크박스 트리 필터:** 제품 목록 화면 좌측에 L1→L2→L3→L4 4단 체크박스 트리 제공. 하위 축 미체크 시 상위 축 전체 선택으로 해석
2. **modelCode 세그먼트 디코딩:** `DHS-AE225-D-1` → `{brand: DHS, series: AE225, class: D, variant: 1}` 자동 분해하여 상세 화면 표시
3. **productClassPath 자동 산출:** L1~L4 컬럼을 "`/`" 로 연결한 파생 필드 (예: `미서기/마스/복층/225`)
4. **신규 축 값 등록:** 관리자는 각 축의 값 목록을 마스터 코드 테이블에서 확장 가능

**비즈니스 규칙:** 4축 모두 NULL 불가 (신규 제품 등록 시 L1~L4 필수 입력)

**수용 사유:** 용어사전 v1.4 §9 에서 제품 50모델이 4축 계층 분류에 속함이 확정. 현행 무질서한 분류를 표준화하여 검색·리포팅 효율을 확보한다.

---

#### FR-PM-019 파생제품 등록·조회 및 Variant BOM 자동 상속 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 제품관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | 용어사전 v1.4 §15, DE35-1 v1.5 |
| **관련 요구사항** | FR-PM-010, FR-PM-018, FR-PM-021 |
| **관련 화면** | SCR-PM-017 (파생제품 등록/조회) |

**상세 설명:** 원본 제품을 기반으로 1MM 편차·커버 교체·강화유리·방화 43MM 등의 **파생제품(Variant)** 을 등록하고, 원본 BOM 을 자동 상속한 후 차이점만 BOM_RULE 로 덧쓴다.

**주요 기능:**
1. **파생제품 등록:** `derivativeOf = {원본 productCode}`, `derivativeKind ∈ {1MM, CAP_TO_HIDDEN, TEMPERED, FIRE_43MM}` 입력
2. **Variant BOM 자동 상속:** 원본 제품의 EBOM/MBOM/Config 를 복사하여 파생 제품 BOM 초기화
3. **차이 편집:** 파생 제품에 대해 BOM_RULE 만 추가하여 편차 표현 (원본 BOM 재작성 불필요)
4. **역추적 조회:** 원본 제품 상세 화면에서 파생 제품 목록 표시 (v1.6: 빠른 참조 5건 + 전체보기)

**비즈니스 규칙:** 원본 제품이 `DEPRECATED` 상태로 전환되면 파생 제품에 영향 경고 표시. 파생 depth 1 제한.

**수용 사유:** 유니크시스템 실제 제품에 1MM 편차·화재등급 등 파생 계열 다수 존재. BOM 중복 관리 공수 절감.

---

#### FR-PM-020 NUMERIC 옵션 입력 및 조건부 활성화 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 옵션관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | 용어사전 v1.4 §11, DE22-1 v1.6 §5 |
| **관련 요구사항** | FR-PM-010, FR-PM-021, FR-PM-022, FR-PM-024 |
| **관련 화면** | SCR-PM-013B (옵션 그룹 관리·확정 구성표 서브탭) |

**상세 설명:** 옵션값 타입을 ENUM 외에 **NUMERIC** 으로 확장하여 치수 입력(`OPT-DIM-W/H/W1/H1/H2/H3`)을 지원. `numeric_min/max` 유효성 검증과 `enablement_condition` 을 통한 조건부 활성화 (예: 3편창 레이아웃일 때만 W1 입력 활성화).

**주요 기능:**
1. **치수 입력 UI:** W, H, W1, H1, H2, H3 숫자 입력 필드. 스피너·단위 mm 표시
2. **유효성 검증:** `OPTION_VALUE.numeric_min ≤ 입력값 ≤ numeric_max` 실시간 검증
3. **조건부 활성화:** `enablement_condition` 표현식 평가 결과 FALSE 인 필드는 disable/hide. 예: `OPT-LAY == 'W3XH1'` 일 때만 W1 활성화
4. **appliedOptions 저장:** `{"OPT-LAY": "W2XH1", "OPT-DIM-W": 1500, "OPT-DIM-H": 1200}` 혼합 구조 JSON 저장

**비즈니스 규칙:**
- NUMERIC 옵션값은 `optionsHash` 계산에서 제외 (카디널리티 폭발 차단)
- 결측 NUMERIC 옵션은 `is_default` 값 사용, 없으면 저장 거부

**수용 사유:** 용어사전 v1.4 §11 의 V5 P2 이슈 대응. 치수 기반 산식 평가의 전제.

---

#### FR-PM-021 BOM_RULE action 편집기 (SET/REPLACE/ADD/REMOVE) `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | 용어사전 v1.4 §13, DE22-1 v1.6 §5 |
| **관련 요구사항** | FR-PM-010, FR-PM-020, FR-PM-022, FR-PM-024, FR-PM-025, FR-PM-026, FR-PM-027, NFR-SC-PM-002 |
| **관련 화면** | SCR-PM-013B, SCR-PM-021/022/023 (v1.6 승격 3뷰) |

**상세 설명:** BOM_RULE 의 `action` 을 공식 4종 동사 (`SET` / `REPLACE` / `ADD` / `REMOVE`) 카드 UI 로 편집한다.

**주요 기능:**
1. **동사 선택:** 카드 좌측 라디오로 4종 선택
2. **SET:** MBOM 행의 특정 속성(cutLengthFormula, cutQtyFormula, lossRate, workCenter 등)을 상수 또는 산식으로 세팅
3. **REPLACE:** itemCode A → itemCode B 치환 (같은 슬롯)
4. **ADD:** 신규 MBOM 행 추가 (기능군·위치·공정 지정)
5. **REMOVE:** 조건부로 MBOM 행 삭제 (Phantom 처리와 별개)
6. **조건식:** `when` 절에 ENUM 옵션값 조합 입력 (예: `OPT-GLZ == '복층' AND OPT-MAT == 'TEMPERED'`)

**비즈니스 규칙:** action 이 NULL·기타 문자열이면 저장 거부. 폐기 용어(`산식구분` / `formula_kind` 등) 입력 차단.

**수용기준 (변경 이력 조회, v1.1-r1 추가):**

- **변경 이력 조회**: 모든 BOM_RULE CRUD 는 `BOM_RULE_HISTORY` ([[DE33-1_DB물리스키마_설계서_v1.2]] §3.15) 에 기록된다. 화면에서 `actor` / `changed_at` / `before_snapshot` / `after_snapshot` / `changed_fields` / `reason` 을 조회할 수 있어야 한다. 본 이력은 **90일 이상 보관** (NFR-SC-PM-002 감사 로그 90일).
- **이력 UI**: SCR-PM-022 (결정표) 우측 상세 패널에 `[이력]` 탭을 제공 ([[DE22-1_화면설계서_v1.6]] §5 SCR-PM-022).
- **이력 API**: `GET /api/pm/products/{productCode}/rules/{ruleId}/history?limit=50&cursor=` ([[DE24-1_인터페이스설계서_v2.0]] §5.3.11.1, `RuleHistoryEntry[]` 응답).

**수용 사유:** 용어사전 v1.4 §13 의 action 동사 스키마 공식화. 편집 UX 의 표준화. 감사 이력을 통한 변경 추적성 확보(NFR-SC-PM-002).

---

#### FR-PM-022 확정구성표 절단 속성 표시 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | 용어사전 v1.4 §3·§4, DE24-1 v1.9, DE22-1 v1.6 §5 |
| **관련 요구사항** | FR-PM-010, FR-PM-013, FR-PM-020, FR-PM-024 |
| **관련 화면** | SCR-PM-013B (확정 구성표 서브탭) — v1.6 `resolvedBomId` 컬럼 추가 |

**상세 설명:** 확정구성표(Resolved BOM) 조회 화면에 절단 관련 속성(cutDirection, cutLength, cutLength2, cutQty, actualCutLength, supplyDivision, frozen 🔒, itemCategory)을 표시한다.

**주요 기능:**
1. **절단 속성 컬럼:** 테이블에 8개 신규 컬럼 + `resolvedBomId` 컬럼(MES 바인딩 키) 표시. null 값은 "—" 렌더
2. **frozen 뱃지:** `frozen=TRUE` 행은 🔒 아이콘 + 읽기 전용 배경색
3. **supplyDivision 필터:** 상단 탭으로 {공통 / 외창 / 내창} 전환
4. **itemCategory 필터:** {PROFILE / GLASS / HARDWARE / CONSUMABLE / SEALANT / SCREEN} 다중 선택
5. **Excel 다운로드:** 8개 속성 + `resolvedBomId` 포함 엑셀 export

**비즈니스 규칙:** `frozen=TRUE` 시점 이후에는 UI 에서도 속성 편집 입력 disable.

**수용 사유:** 용어사전 v1.4 §3 MBOM 속성 확장, DE24-1 v1.9 응답 DTO 반영. 현장 작업지시서 생성의 기반.

---

#### FR-PM-023 다이스북 개정판·공급망(ITEM_SUPPLIER) 관리 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > 자재관리 > 공급망 |
| **난이도** | 중 / **우선순위** 중 / **수용여부** 수용 |
| **출처** | 용어사전 v1.4 §14, [[4-2_커튼월다이스북_분석]] |
| **관련 요구사항** | FR-PM-001, FR-PM-003 |
| **관련 화면** | SCR-PM-018 (다이스북), SCR-PM-019 (공급사), SCR-PM-020 (자재↔공급사 매핑) |

**상세 설명:** 다이스북(DIES_BOOK) 개정판 이력과 거래처 역할 구분(DIES_SUPPLIER) 및 자재-공급처 다대다 매핑(ITEM_SUPPLIER) 을 관리한다.

**주요 기능:**
1. **DIES_BOOK 개정판 이력:** `revision`, `effective_from`, `effective_to`, `pdf_url`, `notes` 관리. 특정 시점 유효 개정판 조회
2. **DIES_SUPPLIER 역할:** 거래처별 역할 {`EXTRUSION`(압출), `INSULATION`(단열), `HARDWARE`(철물)} 다중 지정
3. **ITEM_SUPPLIER 다대다:** 하나의 자재(itemCode)가 복수 공급처를 가질 수 있고, 공급처도 복수 자재 공급 가능. 우선순위(`preferredRank`) 및 리드타임 관리
4. **부재코드·다이스코드 분리:** 용어사전 §14 의 `부재코드` / `다이스코드` 구분 준수

**비즈니스 규칙:** 개정판 기간 중첩 금지 (같은 다이스북 내 `effective_from` ~ `effective_to` 겹침 불가).

**수용 사유:** 커튼월 실제 공급망 구조 반영. FR-PM-003 의 거래처 단가 관리와 연계.

---

#### FR-PM-024 RuleEngine 산식 평가 및 frozen 불변성 보장 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 > RuleEngine |
| **난이도** | 상 / **우선순위** 최상 / **수용여부** 수용 |
| **출처** | 용어사전 v1.4 §4·§13, DE11-1 v1.2, V3 §3 |
| **관련 요구사항** | FR-PM-010, FR-PM-012, FR-PM-020, FR-PM-021, FR-PM-022, NFR-PF-PM-003, NFR-RL-PM-001, NFR-MT-PM-001 |

**상세 설명:** `UNIQUE_V1` 산식 언어로 작성된 `cutLengthFormula`, `cutLengthFormula2`, `cutQtyFormula`, BOM_RULE.action 내 표현식을 평가하여 Resolved BOM 의 `cut_length_evaluated*`, `cut_qty_evaluated`, `actual_cut_length*` 컬럼에 스냅샷한다. `frozen=TRUE` 전환 이후 재평가를 금지한다.

**주요 기능:**
1. **산식 평가:** AST 파싱 + 바인딩(W, H, W1, H1, H2, H3, itemCategory, supplyDivision …) + 평가
2. **연산자·함수:** 사칙연산, IIF, MIN, MAX, ROUND (UNIQUE_V1 사양)
3. **AST 캐시:** 자주 호출되는 산식의 AST 를 메모리 캐시 (NFR-MT-PM-001)
4. **snapshot 기록:** 평가 결과를 Resolved 행의 `*_evaluated` 필드에 저장 후 `frozen=TRUE` 전환
5. **재평가 금지:** `frozen=TRUE` 행은 BOM_RULE.action 상수나 RuleEngine 버전 업그레이드 시에도 재평가하지 않음
6. **재평가 필요 시 절차:** 기존 Resolved 를 `DEPRECATED` 처리 + 신규 `standardBomVersion` 으로 신규 Resolved 생성 — 이력 추적 가능
7. **ruleEngineVersion 기록:** 각 Resolved 에 평가 엔진 버전(`UNIQUE_V1`) 기록

**비즈니스 규칙:**
- 산식 평가 중 divide-by-zero / 바인딩 누락 시 명시 오류로 중단 (silent default 금지)
- NUMERIC 옵션 미입력 시 `is_default` 적용 후 평가

**수용 사유:** 용어사전 v1.4 §4 의 V5 P4 (frozen 후 재평가 불일치 차단) 이슈 대응. MES 작업지시 금액·치수 분쟁 원천 차단.

---

#### FR-PM-025 BOM_RULE 템플릿 갤러리 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived) §2, 사용자 피드백 "규칙 조합 방식이 어렵다" |
| **관련 요구사항** | FR-PM-012, FR-PM-021, FR-PM-024, FR-PM-026, FR-PM-027 |
| **관련 화면** | SCR-PM-021 (v1.6 독립 화면) — DE22-1 §9.3.4.1 |

**요구사항:**
- 슬롯 기반 템플릿 양식으로 규칙을 생성할 수 있어야 한다. 사용자(견적 담당자 포함)는 조건식·액션 동사를 직접 쓰지 않고 드롭다운·숫자 입력으로만 규칙을 구성한다.
- 초기 빌트인 템플릿 6종 제공: `TPL-REINFORCE-SIZE`, `TPL-CUT-DIRECTION`, `TPL-ITEM-REPLACE-BY-OPT`, `TPL-FORMULA-BY-RANGE`, `TPL-ADD-BY-OPT`, `TPL-DERIVATIVE-DIFF` (용어사전 v1.4 §13.3).
- 한 템플릿 인스턴스가 다수 `BOM_RULE` 행을 생성할 수 있다 (N 규칙 연쇄). UI 는 `template_instance_id` 로 묶어 논리적 1 단위로 표시·편집·삭제한다.
- 슬롯 원본값(`slot_values`)은 DB 에 보존되어 편집 왕복 시 손실이 없어야 한다.
- PM 관리자(`ROLE_PM_ADMIN`) 는 전문가 모드 규칙을 "템플릿으로 승격" 마법사로 신규 커스텀 템플릿(`is_builtin=FALSE`)을 정의할 수 있다.

**수용 기준:**
- 견적 담당자 역할 사용자가 5분 내 첫 규칙 저장 가능
- 빌트인 6종은 Flyway 마이그레이션으로 `RULE_TEMPLATE` 시드
- 인스턴스 단위 삭제 시 `template_instance_id` 동일 행 일괄 삭제

---

#### FR-PM-026 BOM_RULE 결정표 뷰 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 상 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived) §3 |
| **관련 요구사항** | FR-PM-021, FR-PM-024, FR-PM-025, NFR-PF-PM-004 |
| **관련 화면** | SCR-PM-022 (v1.6 독립 화면) — DE22-1 §9.3.4.2 |

**요구사항:**
- 제품군 단위로 규칙 전체를 **결정표(Decision Table)** 형식으로 조감할 수 있어야 한다. 행 = `BOM_RULE` 1행, 열 = 유효 OPTION_GROUP ENUM + 치수조건 + 액션 요약 + 우선순위.
- `template_instance_id` 가 같은 행들은 들여쓰기·아이콘으로 묶음 표시.
- 두 규칙의 조건 교집합이 비어있지 않으면서 액션이 경합하면 **충돌 경고** 를 자동 표시. 동점 우선순위 시 ❓ 배지.
- 제품군의 유효 옵션 조합 중 어떤 규칙도 매칭되지 않는 조합은 **미커버(gap)** 로 요약 집계.
- 규칙 수 ≤100 은 프런트 AST 교집합 계산, >100 은 서버 incremental 모드 (DE11-1 §11.9).

**수용 기준:**
- 규칙 ≤200 행 기준 결정표 로드 p95 < 500ms (NFR-PF-PM-004)
- 충돌·공백 발견 즉시 드로어 열어 상세 제공
- 결정표 API 응답 형식: DE11-1 §11.9

---

#### FR-PM-027 BOM_RULE 시뮬레이터 `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived) §6 |
| **관련 요구사항** | FR-PM-021, FR-PM-024, FR-PM-025, FR-PM-026, NFR-PF-PM-005 |
| **관련 화면** | SCR-PM-023 (v1.6 독립 화면) — DE22-1 §9.3.4.4 |

**요구사항:**
- 가상 옵션 조합을 입력해 **매칭 규칙·최종 MBOM diff** 를 DB 저장 없이 확인할 수 있어야 한다 (evaluate-only).
- API: `POST /api/pm/products/{productCode}/rules/simulate` (DE24-1 §5.3.12 / DE11-1 §11.8). 편집 중인 draft rules 도 리퀘스트에 포함 가능.
- 응답은 매칭 규칙 리스트(우선순위 순, 기각 규칙 포함·사유), Base MBOM 대비 추가/제거/변경 diff, 경고 목록을 포함.
- 뷰 공통 사이드 패널로 모든 뷰(템플릿·결정표·전문가) 에서 접근 가능.
- 견적 담당자에게도 제공 (`ROLE_PM_VIEWER` 이상).

**수용 기준:**
- 규칙 ≤100 매칭 기준 p95 < 200ms (NFR-PF-PM-005)
- MBOM diff 에 `cutLengthFormula` 변경 등 필드 단위 차이 표시
- 시뮬 실패(예: REPLACE target 부재) 는 422 + 경고 목록

## 3. 비기능 요구사항 (NFR-PM)

### 3.1 성능 (NFR-PF-PM)

**NFR-PF-PM-001 제품 목록 응답 SLA** `v1.0 계승` — p95 ≤ 1.0s (4계층 필터 포함).

#### NFR-PF-PM-006 BOM 트리뷰 대용량 응답 (v1.1-r3 신설)

- 10,000건 이상 BOM 트리 렌더링·전개: p95 ≤ 5초
- 가상 스크롤·미니맵·경로 필터 활성 상태에서도 유지
- 관련 화면: SCR-PM-013

---

**NFR-PF-PM-002 MES BOM 조회 SLA** `v1.0 계승` — `/api/external/v1/bom/resolved/{id}` p95 ≤ 500ms.

**NFR-PF-PM-003 RuleEngine Resolved BOM 생성 SLA** `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **ID** | NFR-PF-PM-003 |
| **목표 수치** | 5,000 BOM_RULE 기준 Resolved BOM 1건 생성 **p95 ≤ 100ms** |
| **난이도** | 상 / **우선순위** 상 |
| **관련 요구사항** | FR-PM-024 |

**측정 기준:**
- 모집단: 제품당 BOM_RULE 5,000개, 옵션 20개(ENUM 15 + NUMERIC 5), MBOM 500 행
- 측정 지점: `POST /api/internal/v1/bom/resolved` 서버 내부 timing
- 목표: p50 ≤ 30ms, p95 ≤ 100ms, p99 ≤ 300ms

**최적화 전략:** AST 캐시 (NFR-MT-PM-001), 인덱스(`BOM_RULE.when_hash`), 스트리밍 평가, BOM_RULE 사전 정렬.

---

**NFR-PF-PM-004 BOM_RULE 결정표 로드 SLA** `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **목표 수치** | 규칙 ≤200 행 기준 p95 < 500ms |
| **관련 요구사항** | FR-PM-026 |

---

**NFR-PF-PM-005 BOM_RULE 시뮬레이터 응답 SLA** `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **목표 수치** | 규칙 ≤100 매칭 기준 p95 < 200ms (AST 캐시 히트) |
| **관련 요구사항** | FR-PM-027 |

### 3.2 보안 (NFR-SC-PM) `v1.0 계승`

- **NFR-SC-PM-001** MES 외부 경로(`/api/external/v1/**`) `ROLE_MES_READER` 전용, IP 화이트리스트
- **NFR-SC-PM-002** 제품·BOM 편집 감사 로그 (user/time/diff) 90일 보관

### 3.3 신뢰성 (NFR-RL-PM)

**NFR-RL-PM-001 frozen 후 Resolved BOM 불변성 계약** `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **목표 수치** | `frozen=TRUE` 전환 이후 `cut_length_evaluated*`, `cut_qty_evaluated`, `actual_qty`, `actual_cut_length`, `rule_engine_version` 필드 **100% 불변** |
| **난이도** | 중 / **우선순위** 최상 |
| **관련 요구사항** | FR-PM-024 |

**보장 방식:**
- DB 레벨: 트리거로 `frozen=TRUE` 행의 대상 컬럼 UPDATE 차단 (RAISE)
- 애플리케이션 레벨: 서비스 계층에서 사전 분기
- 재평가 필요 시: 신규 `standardBomVersion` + 신규 Resolved 생성 절차만 허용 (기존 행 DEPRECATED)
- 감사: 모든 frozen 전환은 감사 로그 기록 (NFR-MT-CM-002 확장)

**수용 사유:** MES 작업지시·견적 금액 동결 후 사후 변경을 원천 차단. V5 P4 리스크 대응.

### 3.4 인터페이스 (NFR-IF-PM) `v1.0 계승`

- **NFR-IF-PM-001** MES REST API 단방향 읽기 전용, DE24-1 v1.9 준수
- **NFR-IF-PM-002** 응답 포맷: JSON, RFC 3339 시각 형식, snake_case 금지(camelCase)

### 3.5 유지보수성 (NFR-MT-PM)

**NFR-MT-PM-001 RuleEngine AST 캐시 기동** `v1.1 신규`

| 항목 | 내용 |
|------|------|
| **목표 수치** | JVM 기동 후 **60초 이내** 활성 BOM_RULE 의 AST 캐시 warm-up 완료 |
| **난이도** | 중 / **우선순위** 중 |
| **관련 요구사항** | FR-PM-024, NFR-PF-PM-003 |

**구현 전략:**
- 기동 시 `ApplicationReadyEvent` 리스너에서 `BOM_RULE WHERE status='ACTIVE'` 전체 파싱 → AST 캐시 로딩
- 캐시 무효화: BOM_RULE UPDATE/DELETE 이벤트 발생 시 해당 rule 의 AST 엔트리 제거
- 캐시 hit rate 모니터링: Micrometer gauge `rule_engine.ast_cache.hit_ratio`, 목표 ≥ 95%
- 캐시 크기 상한: 10,000 엔트리 LRU

**수용 사유:** cold start 시 첫 Resolved 생성 지연 제거하여 NFR-PF-PM-003 SLA 안정화.

## 4. 요구사항 추적 (RTM 참조)

| 요구사항 ID | 관련 화면 (DE22-1 v1.6) | 관련 API (DE24-1 v2.0) | 관련 엔티티 | 설계 문서 |
|-----------|---------------------|-------------------|-----------|---------|
| FR-PM-001~005 | SCR-PM-001/002/003 | internal /materials/** | ITEM | 용어사전 v1.4 §1 |
| FR-PM-006 | SCR-PM-013 | internal /products/{code}/bom/required | — | 용어사전 §2 |
| FR-PM-008/009 | SCR-PM-007 | internal /processes/** | PROCESS | — |
| FR-PM-010 (개정) | SCR-PM-013, SCR-PM-013B | internal /bom/products/* | PRODUCT, EBOM, MBOM, PRODUCT_CONFIG | DE35-1 v1.5, 용어사전 §2 |
| FR-PM-011 | SCR-PM-013 | internal /bom/products/{code}/tree | EBOM/MBOM | DE22-1 §5 |
| FR-PM-012 (개정) | SCR-PM-014 | internal /bom/standard/*/versions | STANDARD_BOM_VERSION, RESOLVED_BOM | DE35-1 v1.5, 용어사전 §4 |
| FR-PM-013 (개정) | — (API) | external /bom/resolved/{id}?supplyDivision | RESOLVED_BOM | DE24-1 v1.9 |
| FR-PM-014 (개정) | SCR-PM-010 | internal /products?classPath | PRODUCT (class_l1~l4) | DE22-1 §4, 용어사전 §9 |
| FR-PM-015/016 | SCR-PM-011, SCR-PM-012 | internal /products/{code} | PRODUCT | DE22-1 §4 |
| FR-PM-017 | SCR-PM-015, SCR-PM-016 | internal /projects/** | PROJECT | — |
| FR-PM-018 (신규) | SCR-PM-010, SCR-PM-012 | internal /products?classPath | PRODUCT | DE22-1 §4 |
| FR-PM-019 (신규) | SCR-PM-017 | internal /products/{code}/derivatives | PRODUCT(derivativeOf, derivativeKind) | DE35-1, 용어사전 §15 |
| FR-PM-020 (신규) | SCR-PM-013B | internal /options/values | OPTION_VALUE (valueType, numeric_min/max, enablement_condition) | DE22-1 §5, 용어사전 §11 |
| FR-PM-021 (신규) | SCR-PM-013B, SCR-PM-021/022/023 | internal /bom/rules | BOM_RULE (action enum) | DE22-1 §5, 용어사전 §13 |
| FR-PM-022 (신규) | SCR-PM-013B | external /bom/resolved/{id} | RESOLVED_BOM (8개 신규 필드) | DE24-1 v1.9, 용어사전 §3 |
| FR-PM-023 (신규) | SCR-PM-018/019/020 | internal /dies-books, /suppliers, /items/{code}/suppliers | DIES_BOOK, DIES_SUPPLIER, ITEM_SUPPLIER | DE22-1 §4 공급망, 용어사전 §14 |
| FR-PM-024 (신규) | — (엔진) | internal /bom/resolved (생성) | RESOLVED_BOM, BOM_RULE | DE11-1 v1.2, 용어사전 §4 |
| FR-PM-025 (신규) | SCR-PM-021 | internal /bom/rules/templates | RULE_TEMPLATE, BOM_RULE(template_id, instance_id, slot_values) | DE22-1 §9.3.4.1 |
| FR-PM-026 (신규) | SCR-PM-022 | internal /bom/rules/decision-table | BOM_RULE | DE11-1 §11.9 |
| FR-PM-027 (신규) | SCR-PM-023 | POST /api/pm/rules/simulate | — (evaluate-only) | DE11-1 §11.8 |
| NFR-PF-PM-003 | 성능 테스트 | — | — | DE11-1 §성능 |
| NFR-RL-PM-001 | — | external /bom/resolved/{id} | RESOLVED_BOM 트리거 | 용어사전 §4.2 |
| NFR-MT-PM-001 | — | — | AST 캐시 컴포넌트 | DE11-1 §RuleEngine |
| NFR-PF-PM-004/005 | — | /decision-table, /rules/simulate | — | DE11-1 §11.8~9 |

> 전체 RTM 및 역추적은 [[AN14-1_요구사항추적표_v1.2]] 정본을 따른다.

## 관련 문서

- [[AN12-1_요구사항정의서_Phase1_v1.1]] — 메인 인덱스 허브
- [[AN12-1_요구사항정의서_Phase1/sections/00_공통_원칙_ID체계|00_공통_원칙_ID체계]] — ID 체계·용어·통계
- [[AN12-1_요구사항정의서_Phase1/sections/CM_공통|CM_공통]] — 공통 기능 요구사항
- [[AN12-1_요구사항목록_v1.5]] — xlsx 정본 (세부 스펙 원본)
- [[AN14-1_요구사항추적표_v1.2]] — RTM
- [[DE22-1_화면설계서_v1.6]] — 화면설계 27종
- [[DE24-1_인터페이스설계서_MES_REST_API_v1.9]] — MES + PM 도메인 API
- [[DE35-1_미서기이중창_표준BOM구조_정의서_v1.5]] — 표준 BOM 구조
- [[WIMS_용어사전_BOM_v1.4]] — 도메인 용어사전
