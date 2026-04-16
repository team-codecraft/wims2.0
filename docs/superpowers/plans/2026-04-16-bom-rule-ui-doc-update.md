---
title: BOM 옵션별규칙 관리 UI 설계 반영 — 기존 문서 보강 플랜
created: 2026-04-16
updated: 2026-04-16
type: 플랜
status: ready
spec: "[[2026-04-16-bom-rule-ui-design]]"
scope: 문서 보강만 (docx/xlsx 산출물 생성 제외)
related:
  - "[[2026-04-16-bom-rule-ui-design]]"
  - "[[WIMS_용어사전_BOM_v1.3]]"
  - "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
  - "[[DE22-1_화면설계서_v1.5]]"
  - "[[DE11-1_소프트웨어_아키텍처_설계서_v1.2]]"
  - "[[DE35-1_미서기이중창_표준BOM구조_정의서_v1.5]]"
  - "[[DE32-1_BOM도메인_ER다이어그램_v1.0]]"
tags:
  - wims
  - bom
  - 규칙관리
  - 플랜
---

# BOM 옵션별규칙 관리 UI 설계 반영 — 기존 문서 보강 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `2026-04-16-bom-rule-ui-design.md` 스펙 (3뷰 체계·템플릿 시스템·`BOM_RULE` 4컬럼 확장·`RULE_TEMPLATE`·`BOM_RULE_HISTORY`) 을 기존 6개 설계·분석·참조 문서에 반영. docx/xlsx 산출물 생성 제외, md 편집만.

**Architecture:** 용어사전을 SOT 로 먼저 v1.4 로 버전업 → 하위 문서(DE35·DE32·DE11·DE22·AN12-1·STATUS) 가 v1.4 에 정합되도록 순차 편집. 용어 정의가 다른 문서들보다 먼저 확정되어야 placeholder 없이 상세 섹션을 쓸 수 있음.

**Tech Stack:** Markdown (Obsidian Flavored), Mermaid (erDiagram/flowchart/sequenceDiagram), 프론트매터 YAML.

**본 프로젝트는 git 저장소가 아님** (문서 Vault). 각 Task 종료 시 commit 대신 **저장·Read 검증 체크포인트** 로 대체.

---

## 전체 Task 개요

| # | Task | 대상 파일 | 예상 소요 |
|---|------|---------|---------|
| 1 | 용어사전 v1.4 신설 | `docs/참고자료/WIMS_용어사전_BOM_v1.4.md` (신규) | 20분 |
| 2 | DE35-1 스키마 보강 | `docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md` | 25분 |
| 3 | DE32-1 ER 다이어그램 보강 | `docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md` | 20분 |
| 4 | DE11-1 RuleEngine 확장 | `docs/3_DE(설계)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md` | 20분 |
| 5 | DE22-1 05_BOM관리 재구성 | `docs/3_DE(설계)/DE22-1_화면설계서/sections/05_BOM관리.md` | 30분 |
| 6 | AN12-1 Phase1 FR 3건 신설 | `docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md` | 15분 |
| 7 | STATUS.md 업데이트 | `STATUS.md` | 10분 |
| 8 | 교차 검증·정합성 체크 | 위 파일 전체 | 15분 |

---

## Task 1: 용어사전 BOM v1.4 신설

**이유:** 다른 문서들이 "용어사전 §13" 을 근거로 참조하므로 SOT 를 먼저 확정해야 함. v1.3 → v1.4 는 새 파일로 분리(v1.2→v1.3 이 별도 파일이었던 패턴 승계).

**Files:**
- Create: `docs/참고자료/WIMS_용어사전_BOM_v1.4.md`
- (참조만) Read: `docs/참고자료/WIMS_용어사전_BOM_v1.3.md`

### Step 1: 기존 v1.3 내용 로드

- [ ] **기존 v1.3 전체를 Read 하여 내용 확보**

```
Read: /Users/jikwangkim/Documents/Claude/Projects/WIMS2.0/docs/참고자료/WIMS_용어사전_BOM_v1.3.md
```

Expected: 246 라인, §1~§16 + 변경 이력.

### Step 2: v1.4 파일 작성 (프론트매터·§1~§12 복제 + §13 확장)

- [ ] **v1.4 를 신규 Write 로 작성. 프론트매터 변경점만 명시하고, 본문은 v1.3 내용 그대로 복제하되 §13 만 확장, §17 신규 추가, 변경 이력 row 추가**

프론트매터 변경:

```yaml
---
title: WIMS 2.0 BOM 도메인 용어사전 v1.4
created: 2026-04-14
updated: 2026-04-16
type: 지침
status: review
supersedes: "[[WIMS_용어사전_BOM_v1.3]]"
tags:
  - wims
  - bom
  - 용어사전
  - 표준
related:
  - "[[GAP_분석_통합_2026-04-15]]"
  - "[[V1_내부일관성_검증]]"
  - "[[V2_데이터모델_완전성_검증]]"
  - "[[V4_비즈니스규칙_수용성]]"
  - "[[V5_성능운영_리스크]]"
  - "[[2026-04-16-bom-rule-ui-design]]"
---
```

§2 (BOM 구성요소) 표 하단에 2개 row 추가:

```markdown
| RULE_TEMPLATE | `RULE_TEMPLATE` | — | 옵션별규칙 템플릿. 슬롯 정의(`slots_schema`) + 컴파일 규칙(`compile_template`). 한 인스턴스가 N 개 `BOM_RULE` 행을 생성할 수 있음 |
| BOM_RULE_HISTORY | `BOM_RULE_HISTORY` | — | 규칙 변경 감사 레코드. INSERT/UPDATE/DELETE 단위 스냅샷 보관 |
```

§13 (산식·BOM_RULE) 전면 확장 — §13.1 ~ §13.4 구조로 재조직. 기존 "산식 언어 UNIQUE_V1", "BOM_RULE action 동사 (4종)", "평가 시점" 을 §13.1·§13.2·§13.5 로 재배치하고, §13.3·§13.4 신규 삽입.

```markdown
## 13. 산식·BOM_RULE

### 13.1 산식 언어 UNIQUE_V1

- **변수:** `W`, `H`, `W1`, `H1`, `H2`, `H3` (NUMERIC 옵션), `OPT-*` 키 (ENUM 비교)
- **함수:** `IIF(조건, 참값, 거짓값)`
- **연산자:** `+`, `-`, `*`, `/`, `%`, 비교, `AND`/`OR`/`NOT`, 괄호
- **집합 연산자(v1.4 신규):** `IN (값1, 값2, …)` — 다중 ENUM 값 간결 표현. 예: `OPT-LAY IN ('3×2연창','3×3연창')`

### 13.2 BOM_RULE action 동사 (4종)

| verb | 의미 | 필수 인자 |
|---|---|---|
| `SET` | MBOM 속성값 할당 | `target`, `field`, `value` |
| `REPLACE` | itemCode 치환 | `target`, `from`, `to` |
| `ADD` | MBOM 신규 행 삽입 | `item` (itemCode, cutDirection, …) |
| `REMOVE` | MBOM 행 제거 | `target` |

`target` 선택자: `{itemCode, cutDirection?, supplyDivision?}` 부분 일치.

> [!note] 사용자 층별 별명
> UI 템플릿 레벨에서 `SET` 의 특수 케이스에 사람이 읽기 좋은 별명을 부여할 수 있다 — 예: 수량 변경 템플릿은 "QTY_CHANGE", 로스율 변경은 "LOSS_CHANGE". 저장·평가 시에는 **모두 `SET` 단일 동사로 통합** 되며, action_json 에는 `{verb: SET, field: actualQty, ...}` 형태로 저장된다. 동사는 4종뿐이다.

### 13.3 RULE_TEMPLATE 메타데이터 (v1.4 신설)

옵션별규칙의 반복 패턴을 슬롯 기반으로 파라미터화한 편집 양식. UI 전용 개념이지만 DB 에 영속화되어 `BOM_RULE` 과 FK 관계를 가진다.

| 표준명 | DB | 정의 |
|---|---|---|
| templateId | `RULE_TEMPLATE.template_id` (PK) | 템플릿 유일 식별자. 예: `TPL-REINFORCE-SIZE` |
| slotsSchema | `RULE_TEMPLATE.slots_schema` (JSON) | 슬롯 정의 배열. 각 슬롯은 `{key, type, label, required, multi?, filter?}` |
| compileTemplate | `RULE_TEMPLATE.compile_template` (JSON) | 슬롯값 주입으로 `condition_expr`·`action_json` 을 생성하는 템플릿. N 개 규칙 생성 가능 |
| isBuiltin | `RULE_TEMPLATE.is_builtin` | 빌트인 템플릿 잠금 플래그. TRUE 면 `slots_schema`·`compile_template` 수정·삭제 불가 |
| scope | `RULE_TEMPLATE.scope` | `미서기` \| `커튼월` \| `공통` |

**슬롯 타입 enum:** `product_class` / `option_value(OPT-*)` / `enum[...]` / `numeric(unit)` / `item_ref(filter=*)` / `process_ref`

### 13.4 BOM_RULE 확장 컬럼 (v1.4 신설)

| 표준명 | DB | 정의 |
|---|---|---|
| templateId | `BOM_RULE.template_id` (nullable FK) | 이 규칙을 생성한 템플릿. NULL = 전문가 모드 원시 규칙 |
| templateInstanceId | `BOM_RULE.template_instance_id` (nullable) | 한 템플릿 인스턴스가 생성한 규칙 그룹 키. UI 에서 묶음 표시·동시 편집·동시 삭제의 기준 |
| slotValues | `BOM_RULE.slot_values` (nullable JSON) | 사용자가 템플릿 슬롯에 입력한 원본값. 편집 왕복 시 손실 방지를 위해 원본 보존. `condition_expr`·`action_json` 은 이 값에서 **파생** 됨 |
| scopeType | `BOM_RULE.scope_type` | `MASTER` \| `ESTIMATE`. PM 담당자가 정의하는 마스터 규칙과 견적 담당자가 프로젝트별로 추가하는 예외 규칙의 저장 축 분리 |
| estimateId | `BOM_RULE.estimate_id` (nullable FK) | `scope_type=ESTIMATE` 일 때 소속 견적 식별자. MASTER 는 NULL |

**오버레이 원칙:** RuleEngine 은 MASTER 규칙을 먼저 평가하고, 해당 견적 스코프의 ESTIMATE 규칙을 **뒤이어 오버레이** 한다. 우선순위 필드 비교는 scope 내부에서만 수행, scope 간 경합 시 ESTIMATE 승리. (Phase 2 ES 설계에서 상세 확정.)

### 13.5 BOM_RULE_HISTORY 감사 레코드 (v1.4 신설)

모든 `BOM_RULE` 편집(INSERT/UPDATE/DELETE) 은 `BOM_RULE_HISTORY` 에 snapshot 된다. 이력은 결정표 뷰의 "📜" 드로어에서 조회한다.

| 표준명 | DB | 정의 |
|---|---|---|
| historyId | `BOM_RULE_HISTORY.history_id` (PK) | — |
| ruleId | `BOM_RULE_HISTORY.rule_id` (FK) | 대상 규칙 |
| operation | `BOM_RULE_HISTORY.operation` | `INSERT` \| `UPDATE` \| `DELETE` |
| beforeSnapshot / afterSnapshot | `before_snapshot`/`after_snapshot` (JSON) | INSERT 는 before NULL, DELETE 는 after NULL |
| changedFields | `changed_fields` (JSON 배열) | 변경된 컬럼명 리스트 (UPDATE) |
| actor / actorRole | `actor` / `actor_role` | 편집자 식별자 + 역할 (ROLE_PM_ADMIN 등) |
| changedAt | `changed_at` | 변경 시각 |
| reason | `reason` (nullable) | 자유 메모 |

### 13.6 평가 시점

- DRAFT→RESOLVED 전환 시 평가. DRAFT 중 프리뷰는 evaluate-only (저장 없음).
- `BOM_RULE` 인덱스: `(series_code, rule_type, active)` + `(product_class_path)` + `(template_instance_id)` + `(scope_type, estimate_id)` + `(template_id, active)`. AST 사전 파싱 캐시.
- 시뮬레이터 API: `POST /pm/rules/simulate` — 저장 없이 가상 옵션 조합에 대한 매칭 규칙·MBOM diff 반환. DE11-1 §11.7 명세.
- 결정표 API: `GET /pm/rules/decision-table?productClass=...` — 컴파일된 행 + 충돌·공백 요약 반환. DE11-1 §11.8 명세.
```

§7 (금지 용어) 표 하단에 1개 row 추가 (QTY_CHANGE·LOSS_CHANGE 별명을 스펙 문서가 아닌 저장 모델에 쓰지 못하도록 봉인):

```markdown
| `QTY_CHANGE`, `LOSS_CHANGE` (저장 모델) | `SET` (action_json) | 템플릿 UI 별명은 허용, action_json 에는 `SET` 단일 동사만 저장 (§13.2) |
```

변경 이력 표 하단에 v1.4 row 추가:

```markdown
| v1.4 | 2026-04-16 | [[2026-04-16-bom-rule-ui-design]] 스펙 반영. §13 재조직(13.1~13.6). §13.3 RULE_TEMPLATE / §13.4 BOM_RULE 확장 5컬럼(template_id·template_instance_id·slot_values·scope_type·estimate_id) / §13.5 BOM_RULE_HISTORY / §13.1 `IN` 연산자. §2 RULE_TEMPLATE·BOM_RULE_HISTORY 엔티티 추가. §7 QTY_CHANGE·LOSS_CHANGE 저장 모델 금지 |
```

### Step 3: 파일 작성 후 검증

- [ ] **Read 로 신규 파일 재로드하여 구조 확인**

```
Read: /Users/jikwangkim/Documents/Claude/Projects/WIMS2.0/docs/참고자료/WIMS_용어사전_BOM_v1.4.md (first 50 lines)
Read: ... (§13 부분)
```

Expected: 프론트매터 `v1.4` + `supersedes: v1.3` 확인, §13.3·§13.4·§13.5 존재 확인, 변경 이력 v1.4 row 확인.

- [ ] **grep 으로 신규 용어 확산 확인**

```
Grep(pattern="RULE_TEMPLATE|template_instance_id|scope_type|BOM_RULE_HISTORY", path="docs/참고자료/WIMS_용어사전_BOM_v1.4.md", output_mode="count")
```

Expected: 각 용어 3회 이상 등장.

### Step 4: 체크포인트

- [ ] **v1.3 파일은 **보존** (프로젝트 관례 — superseded 문서도 archive 없이 같이 둔다). 이후 Task 들은 v1.4 를 참조한다.**

---

## Task 2: DE35-1 표준BOM 구조 정의서 스키마 보강

**Files:**
- Modify: `docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md`

**근거:** 용어사전 v1.4 §13.3·§13.4·§13.5. DE35-1 §6.5 는 BOM_RULE 액션 동사를 이미 4종으로 명세했으므로 그 뒤에 확장 섹션 추가.

### Step 1: 현재 §6.5 섹션 위치 확인

- [ ] **Read 로 §6.5 경계 확인 (L455~505)**

```
Read: docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md (offset=455, limit=60)
```

Expected: L459 `### 6.5 BOM_RULE 액션 동사 스키마` ~ L505 예시 JSON 종료.

### Step 2: §6.5 마지막 뒤(L505)에 §6.5.2 ~ §6.5.5 삽입

- [ ] **Edit 로 `---` 구분자(L506) 직전에 신규 4 서브섹션 추가**

`old_string` 은 `--- \n\n## 7. MES 연동 고려사항` 직전 구간, `new_string` 은 아래 블록.

```markdown
#### 6.5.2 BOM_RULE 확장 컬럼 (v1.5-r2 — 용어사전 v1.4 §13.4 반영)

UI 3뷰 체계(템플릿 갤러리 / 결정표 / 전문가 모드) 지원을 위해 `BOM_RULE` 에 5개 컬럼을 추가한다.

| 컬럼 | 타입 | NULL | 기본값 | 제약 | 설명 |
|---|---|---|---|---|---|
| `template_id` | VARCHAR(64) | Y | — | FK→`RULE_TEMPLATE.template_id` | 이 규칙을 생성한 템플릿. NULL = 전문가 모드 원시 규칙 |
| `template_instance_id` | VARCHAR(64) | Y | — | — | 한 템플릿 인스턴스 그룹 키. 동일 값 행들은 UI 에서 묶음 편집·삭제 |
| `slot_values` | JSON | Y | — | — | 사용자 슬롯 원본값. `condition_expr`·`action_json` 은 이 값에서 파생 |
| `scope_type` | VARCHAR(16) | N | `MASTER` | CHECK(IN `MASTER`,`ESTIMATE`) | PM 마스터 규칙과 견적 예외 규칙 분리 |
| `estimate_id` | BIGINT | Y | — | FK→ESTIMATE (Phase 2) | `scope_type=ESTIMATE` 시 필수 |

#### 6.5.3 RULE_TEMPLATE — 옵션별규칙 템플릿 (v1.5-r2 신설)

| 컬럼 | 타입 | NULL | 기본값 | 제약 | 설명 |
|---|---|---|---|---|---|
| `template_id` | VARCHAR(64) | N | — | PK | 예: `TPL-REINFORCE-SIZE` |
| `name` | VARCHAR(128) | N | — | — | 사용자 노출명 |
| `description` | TEXT | Y | — | — | 설명 |
| `category` | VARCHAR(32) | N | — | — | `자재·공정` / `자재교체` / `산식변경` 등 |
| `icon` | VARCHAR(32) | Y | — | — | 갤러리 아이콘(이모지 가능) |
| `is_builtin` | BOOLEAN | N | FALSE | — | TRUE 면 slots_schema·compile_template 수정 불가 |
| `scope` | VARCHAR(16) | N | — | CHECK(IN `미서기`,`커튼월`,`공통`) | — |
| `slots_schema` | JSON | N | — | — | 슬롯 정의 배열 (§6.5.5) |
| `compile_template` | JSON | N | — | — | 슬롯 주입 규칙 배열 (§6.5.5) |
| `active` | BOOLEAN | N | TRUE | — | 비활성 템플릿은 갤러리 숨김 |
| `created_by` / `created_at` / `updated_by` / `updated_at` | — | — | — | — | 감사 |

**초기 빌트인 템플릿 6종** (S2 Gate 2 후속 시딩):

| template_id | name | scope | 주 verb |
|---|---|---|---|
| `TPL-REINFORCE-SIZE` | 치수 초과 보강재 추가 | 공통 | ADD |
| `TPL-CUT-DIRECTION` | 절단방향 선택 | 미서기 | SET × N |
| `TPL-ITEM-REPLACE-BY-OPT` | 옵션별 자재 교체 | 공통 | REPLACE |
| `TPL-FORMULA-BY-RANGE` | 치수 구간별 산식 변경 | 공통 | SET |
| `TPL-ADD-BY-OPT` | 옵션별 부자재 추가 | 공통 | ADD |
| `TPL-DERIVATIVE-DIFF` | 파생제품 차이 | 공통 | REPLACE / SET |

> [!question] 커버리지 검증 (Gate 2 이후)
> 초기 6종이 AN12-1 FR-PM-012 / FR-PM-021 / FR-PM-025 유스케이스를 80% 이상 커버하는지 실제 규칙 샘플과 대조하여 확정.

#### 6.5.4 BOM_RULE_HISTORY — 규칙 변경 감사 (v1.5-r2 신설)

| 컬럼 | 타입 | NULL | 기본값 | 제약 | 설명 |
|---|---|---|---|---|---|
| `history_id` | BIGINT | N | AUTO | PK | — |
| `rule_id` | BIGINT | N | — | FK→BOM_RULE | — |
| `operation` | VARCHAR(8) | N | — | CHECK(IN `INSERT`,`UPDATE`,`DELETE`) | — |
| `before_snapshot` | JSON | Y | — | — | INSERT 시 NULL |
| `after_snapshot` | JSON | Y | — | — | DELETE 시 NULL |
| `changed_fields` | JSON | Y | — | — | UPDATE 변경 컬럼명 배열 |
| `actor` | VARCHAR(64) | N | — | — | 편집자 |
| `actor_role` | VARCHAR(32) | N | — | — | ROLE_PM_ADMIN / ROLE_PM_EDITOR / ROLE_ESTIMATE |
| `changed_at` | DATETIME | N | CURRENT_TIMESTAMP | — | — |
| `reason` | VARCHAR(256) | Y | — | — | 자유 메모 |

**인덱스:** `(rule_id, changed_at DESC)`, `(actor, changed_at DESC)`.

#### 6.5.5 템플릿 컴파일 규칙

슬롯 값이 채워진 템플릿 인스턴스는 RuleEngine 의 **템플릿 컴파일러** (DE11-1 §11.7) 에 의해 1개 이상의 `BOM_RULE` 행으로 변환된다. 변환은 결정론적이며 순수 함수.

**단순 1:1 예 (TPL-REINFORCE-SIZE):**

```yaml
slotValues:
  productClass: "미서기/마스/복층/225"
  layout: ["3×2연창"]
  axis: "W"
  threshold: 3000
  reinforceItem: "PRF-REIN-01"
  reinforceProcess: "PRC-REIN-01"

↓ 컴파일 ↓

BOM_RULE (1행):
  template_id: TPL-REINFORCE-SIZE
  template_instance_id: TPI-{uuid}
  slot_values: {위 slotValues 원본}
  condition_expr: "productClassPath = '미서기/마스/복층/225' AND OPT-LAY IN ('3×2연창') AND W >= 3000"
  action_json: [
    {verb: ADD, target: MBOM,         item: {itemCode: "PRF-REIN-01", qty: 1}},
    {verb: ADD, target: MBOM_PROCESS, process: {processCode: "PRC-REIN-01"}}
  ]
  scope_type: MASTER
```

**1:N 연쇄 예 (TPL-CUT-DIRECTION, 한 인스턴스 → 2 행):**

```yaml
slotValues:
  horizontalBar: "PRF-BAR-H"
  verticalBar:   "PRF-BAR-V"
  barThickness:  20

↓ 컴파일 ↓

BOM_RULE 행 A:
  template_instance_id: TPI-{uuid}   # 동일 인스턴스
  condition_expr: "OPT-CUT = '가로우선'"
  action_json: [
    {verb: SET, target: {itemCode: "PRF-BAR-H"}, field: cutLengthFormula, value: "W"},
    {verb: SET, target: {itemCode: "PRF-BAR-V"}, field: cutLengthFormula, value: "H - 40"}  // 20*2
  ]

BOM_RULE 행 B:
  template_instance_id: TPI-{uuid}   # 동일 인스턴스 (그룹화)
  condition_expr: "OPT-CUT = '세로우선'"
  action_json: [
    {verb: SET, target: {itemCode: "PRF-BAR-H"}, field: cutLengthFormula, value: "W - 40"},
    {verb: SET, target: {itemCode: "PRF-BAR-V"}, field: cutLengthFormula, value: "H"}
  ]
```

`template_instance_id` 가 동일한 행들은 결정표 뷰·갤러리에서 **논리적 1 단위** 로 취급된다 — 편집·삭제가 묶음 단위로 처리된다.

```

### Step 3: §8.2 인덱스 전략 보강 (L548~552)

- [ ] **Edit 로 기존 인덱스 bullet list 뒤에 3개 인덱스 추가**

`old_string`:

```markdown
- `BOM_RULE` 에 `(series_code, rule_type, active)` 복합 인덱스 + `(product_class_path)` 보조 인덱스
- 애플리케이션 기동 시 `action_json` 산식 사전 파싱(pre-compile) → AST in-memory 캐시
- `UNIQUE_V1` → `UNIQUE_V2` 언어 업그레이드 시 frozen Resolved 는 재평가 금지, 신규 Config 부터 V2 적용
```

`new_string`:

```markdown
- `BOM_RULE` 에 `(series_code, rule_type, active)` 복합 인덱스 + `(product_class_path)` 보조 인덱스
- **v1.5-r2 추가:** `(template_instance_id)` — 인스턴스 그룹 조회 / `(scope_type, estimate_id)` — MASTER/ESTIMATE 분리 조회 / `(template_id, active)` — 템플릿별 사용 통계
- 애플리케이션 기동 시 `action_json` 산식 사전 파싱(pre-compile) → AST in-memory 캐시
- `UNIQUE_V1` → `UNIQUE_V2` 언어 업그레이드 시 frozen Resolved 는 재평가 금지, 신규 Config 부터 V2 적용
- **결정표 충돌·공백 계산**: 규칙 수 ≤100 은 FE AST 교집합 연산, >100 은 서버 `GET /pm/rules/decision-table` incremental 모드
```

### Step 4: 변경 이력 table 업데이트 (파일 말미)

- [ ] **Grep 으로 `변경 이력` 섹션 위치 확인**

```
Grep(pattern="## .* 이력|## 변경|변경 이력", path="docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md", output_mode="content", -n=true)
```

- [ ] **Read 로 변경 이력 표의 마지막 row 확인 후 v1.5-r2 row 추가**

추가 row (구체 wording 은 기존 표 포맷에 맞춤):

```markdown
| v1.5-r2 | 2026-04-16 | [[2026-04-16-bom-rule-ui-design]] 반영. §6.5.2 `BOM_RULE` +5컬럼(template_id·template_instance_id·slot_values·scope_type·estimate_id), §6.5.3 `RULE_TEMPLATE` 신설 + 빌트인 6종, §6.5.4 `BOM_RULE_HISTORY` 신설, §6.5.5 템플릿 컴파일 규칙. §8.2 인덱스 +3. 참조: 용어사전 v1.4 §13 |
```

### Step 5: 검증 체크포인트

- [ ] **Grep 으로 신규 용어 반영 확인**

```
Grep(pattern="RULE_TEMPLATE|template_instance_id|BOM_RULE_HISTORY|scope_type", path="docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md", output_mode="count")
```

Expected: 각 용어 2회 이상 등장.

---

## Task 3: DE32-1 ER 다이어그램 보강

**Files:**
- Modify: `docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md`

**근거:** 용어사전 v1.4 §13.3·§13.4·§13.5, DE35-1 §6.5.2~§6.5.4.

### Step 1: 현재 BOM_RULE 엔티티 스키마 위치 확인

- [ ] **Read L220~250 에서 §2.12 BOM_RULE · §2.13 BOM_RULE_ACTION 재확인**

```
Read: docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md (offset=220, limit=60)
```

### Step 2: §2.12 BOM_RULE 표에 5개 컬럼 row 추가

- [ ] **Edit: §2.12 BOM_RULE 표에 마지막 `standard_bom_id` row 다음 5개 추가**

`old_string`:

```markdown
| standard_bom_id | VARCHAR(32) | Y | — | FK→STANDARD_BOM | 표준BOM 바인딩 |

### 2.13 BOM_RULE_ACTION — 규칙 액션 (정규화)
```

`new_string`:

```markdown
| standard_bom_id | VARCHAR(32) | Y | — | FK→STANDARD_BOM | 표준BOM 바인딩 |
| template_id | VARCHAR(64) | Y | — | FK→RULE_TEMPLATE | v1.1 신설. 이 규칙을 생성한 템플릿. NULL=전문가 모드 원시 규칙 |
| template_instance_id | VARCHAR(64) | Y | — | — | v1.1 신설. 한 템플릿 인스턴스 그룹 키. UI 묶음 편집·삭제 기준 |
| slot_values | JSON | Y | — | — | v1.1 신설. 사용자 슬롯 원본값 (condition_expr·action_json 파생 근거) |
| scope_type | VARCHAR(16) | N | `MASTER` | CHECK(IN `MASTER`,`ESTIMATE`) | v1.1 신설. PM 마스터/견적 예외 분리 축 |
| estimate_id | BIGINT | Y | — | FK→ESTIMATE (Phase 2) | v1.1 신설. scope_type=ESTIMATE 시 필수 |

### 2.13 BOM_RULE_ACTION — 규칙 액션 (정규화)
```

### Step 3: §2.13 BOM_RULE_ACTION 뒤에 §2.14 RULE_TEMPLATE 신규 섹션 삽입

- [ ] **Edit: §2.13 마지막 `> [!note] 이중 저장` callout 뒤에 RULE_TEMPLATE 섹션 삽입 (기존 §2.14 RESOLVED_BOM 은 §2.15 로 밀려남)**

`old_string`:

```markdown
> [!note] 이중 저장
> `BOM_RULE.action_json` 과 `BOM_RULE_ACTION` 은 동일 정보의 정규화/비정규화 쌍. 쿼리·편집 편의를 위해 양쪽을 유지하되, **정규화 테이블이 source** 이고 `action_json` 은 읽기 캐시로 취급.

### 2.14 RESOLVED_BOM — 확정구성표
```

`new_string`:

```markdown
> [!note] 이중 저장
> `BOM_RULE.action_json` 과 `BOM_RULE_ACTION` 은 동일 정보의 정규화/비정규화 쌍. 쿼리·편집 편의를 위해 양쪽을 유지하되, **정규화 테이블이 source** 이고 `action_json` 은 읽기 캐시로 취급.

### 2.14 RULE_TEMPLATE — 옵션별규칙 템플릿 (v1.1 신설)

| 컬럼명 | 타입 | NULL | 기본값 | 제약 | 설명 |
|---|---|---|---|---|---|
| template_id | VARCHAR(64) | N | — | PK | 예: `TPL-REINFORCE-SIZE` |
| name | VARCHAR(128) | N | — | — | 사용자 노출명 |
| description | TEXT | Y | — | — | — |
| category | VARCHAR(32) | N | — | — | 자재·공정 / 자재교체 / 산식변경 등 |
| icon | VARCHAR(32) | Y | — | — | 갤러리 아이콘 |
| is_builtin | BOOLEAN | N | FALSE | — | TRUE 면 slots_schema·compile_template 잠금 |
| scope | VARCHAR(16) | N | — | CHECK(IN `미서기`,`커튼월`,`공통`) | — |
| slots_schema | JSON | N | — | — | 슬롯 정의 배열 |
| compile_template | JSON | N | — | — | 슬롯 주입 규칙 배열 (1:N 생성 가능) |
| active | BOOLEAN | N | TRUE | — | 비활성 템플릿은 갤러리 숨김 |
| created_by | VARCHAR(64) | N | — | — | 감사 |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | — | — |
| updated_by | VARCHAR(64) | Y | — | — | — |
| updated_at | DATETIME | Y | — | — | — |

> [!note] BOM_RULE 과의 관계
> `BOM_RULE.template_id` (nullable FK) 로 1:N 관계. 빌트인 템플릿 6종(`TPL-REINFORCE-SIZE`, `TPL-CUT-DIRECTION`, `TPL-ITEM-REPLACE-BY-OPT`, `TPL-FORMULA-BY-RANGE`, `TPL-ADD-BY-OPT`, `TPL-DERIVATIVE-DIFF`) 은 Flyway 시드로 주입.

### 2.15 BOM_RULE_HISTORY — 규칙 변경 감사 (v1.1 신설)

| 컬럼명 | 타입 | NULL | 기본값 | 제약 | 설명 |
|---|---|---|---|---|---|
| history_id | BIGINT | N | AUTO | PK | — |
| rule_id | BIGINT | N | — | FK→BOM_RULE | — |
| operation | VARCHAR(8) | N | — | CHECK(IN `INSERT`,`UPDATE`,`DELETE`) | — |
| before_snapshot | JSON | Y | — | — | INSERT 시 NULL |
| after_snapshot | JSON | Y | — | — | DELETE 시 NULL |
| changed_fields | JSON | Y | — | — | UPDATE 변경 컬럼명 배열 |
| actor | VARCHAR(64) | N | — | — | 편집자 |
| actor_role | VARCHAR(32) | N | — | — | ROLE_PM_ADMIN / ROLE_PM_EDITOR / ROLE_ESTIMATE |
| changed_at | DATETIME | N | CURRENT_TIMESTAMP | — | — |
| reason | VARCHAR(256) | Y | — | — | 자유 메모 |

INDEX: `(rule_id, changed_at DESC)`, `(actor, changed_at DESC)`

### 2.16 RESOLVED_BOM — 확정구성표
```

> [!warning] 후속 섹션 번호 재정렬
> 기존 §2.14 RESOLVED_BOM → §2.16 으로 이동. 파일 내 §2.14 이후의 모든 서브섹션 번호도 +2 시프트해야 함. Grep 으로 `### 2\.1[4-9]` / `### 2\.2[0-9]` 검색 후 Edit 로 일괄 번호 갱신.

- [ ] **Grep 으로 후속 섹션 번호 확인**

```
Grep(pattern="^### 2\.1[4-9]|^### 2\.2[0-9]", path="docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md", output_mode="content", -n=true)
```

- [ ] **Edit 로 각 섹션 번호 +2 (기존 2.14→2.16, 2.15→2.17, …) — replace_all 대신 개별 Edit 로 처리해 중복 매칭 방지**

### Step 4: 최상위 Mermaid erDiagram 에 신규 엔티티·관계 추가

- [ ] **Grep 으로 Mermaid erDiagram 블록 위치 확인**

```
Grep(pattern="erDiagram", path="docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md", output_mode="content", -n=true)
```

- [ ] **Read 로 BOM_RULE 이 등장하는 erDiagram 블록 확인**

- [ ] **Edit 로 해당 erDiagram 에 RULE_TEMPLATE · BOM_RULE_HISTORY 엔티티 + 관계 추가**

추가할 엔티티·관계 (erDiagram 문법):

```mermaid
    RULE_TEMPLATE {
        string template_id PK
        string name
        string category
        boolean is_builtin
        string scope
        json slots_schema
        json compile_template
    }
    BOM_RULE_HISTORY {
        bigint history_id PK
        bigint rule_id FK
        string operation
        json before_snapshot
        json after_snapshot
        string actor
        datetime changed_at
    }
    RULE_TEMPLATE ||--o{ BOM_RULE : "generates"
    BOM_RULE ||--o{ BOM_RULE_HISTORY : "audits"
```

기존 `BOM_RULE { ... }` 엔티티 블록에 v1.1 신규 컬럼 5종(template_id/template_instance_id/slot_values/scope_type/estimate_id) 을 속성으로 추가.

### Step 5: 변경 이력 업데이트 (파일 말미)

- [ ] **Grep 으로 변경 이력 표 확인 후 v1.1 row 추가 (v1.0 → v1.1 승격)**

```markdown
| v1.1 | 2026-04-16 | [[2026-04-16-bom-rule-ui-design]] 반영. §2.12 BOM_RULE +5컬럼, §2.14 RULE_TEMPLATE 신설, §2.15 BOM_RULE_HISTORY 신설, 후속 섹션 번호 +2 재정렬, erDiagram 엔티티·관계 2종 추가 |
```

### Step 6: 프론트매터 버전 갱신

- [ ] **파일 상단 프론트매터 `title` 을 `v1.0` → `v1.1`, `updated` 를 `2026-04-16` 로 갱신**

### Step 7: 검증 체크포인트

- [ ] **Grep 으로 섹션 번호 연속성 확인**

```
Grep(pattern="^### 2\.", path="docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md", output_mode="content", -n=true)
```

Expected: 2.1, 2.2, …, 2.16+ 순서 중복·누락 없음.

---

## Task 4: DE11-1 RuleEngine 모듈 §11 확장

**Files:**
- Modify: `docs/3_DE(설계)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md`

**근거:** 용어사전 v1.4 §13.3~§13.5. 템플릿 컴파일러·시뮬레이터 API·결정표 API 가 RuleEngine 모듈의 공개 표면이 되므로 §11 에 명세 추가.

### Step 1: 기존 §11 경계 확인

- [ ] **Read 로 §11.6 (검증·테스트) 끝까지 확인 (L892~ )**

```
Read: docs/3_DE(설계)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md (offset=890, limit=30)
```

### Step 2: §11.6 뒤에 §11.7~§11.9 삽입

- [ ] **Edit 로 §11.6 섹션의 마지막 라인 다음에 3개 서브섹션 삽입**

`old_string` 은 §11.6 의 마지막 bullet (파일 전체 말단 또는 §12 직전), `new_string` 에 아래 블록.

```markdown
### 11.7 템플릿 컴파일러 (v1.3 신설)

UI 템플릿 시스템(`RULE_TEMPLATE`) 의 슬롯 값을 입력받아 `BOM_RULE` 행(1개 이상) 을 산출하는 순수 함수 모듈. 용어사전 v1.4 §13.3·§13.4 근거.

```kotlin
interface TemplateCompiler {
    /** 템플릿 인스턴스 → N개 BOM_RULE 행 */
    fun compile(
        template: RuleTemplate,
        slotValues: Map<String, Any>,
        scopeType: ScopeType = ScopeType.MASTER,
        estimateId: Long? = null
    ): List<BomRuleRow>

    /** 역방향 — 원시 BOM_RULE 이 템플릿 패턴과 일치하면 슬롯값 추출 */
    fun tryExtractSlots(
        template: RuleTemplate,
        rule: BomRuleRow
    ): Map<String, Any>?  // null = 패턴 불일치
}

data class BomRuleRow(
    val templateId: String?,
    val templateInstanceId: String?,
    val slotValues: Map<String, Any>?,
    val conditionExpr: String,
    val actionJson: List<Action>,
    val priority: Int,
    val scopeType: ScopeType,
    val estimateId: Long?
)
```

**컴파일 규약:**

1. 결정론적 — 동일 `(template, slotValues)` 입력은 동일 `BomRuleRow` 배열을 반환. `template_instance_id` 는 **호출자**가 UUIDv4 로 발급하여 주입(컴파일러 내부에서 생성하지 않음, 외부에서 주입된 instanceId 를 모든 행에 동일하게 할당).
2. 슬롯 유효성 — `slots_schema` 의 `required=true` 슬롯이 누락되면 `SlotValidationException`. 타입 불일치도 동일.
3. 파생 데이터 — `conditionExpr` 과 `actionJson` 은 `compile_template` 에 슬롯값을 주입하여 생성. 원본은 `slotValues` 에 보존되어 편집 왕복 시 손실 없음.
4. 역추출 — `tryExtractSlots` 는 원시 규칙이 템플릿으로 승격 가능한지 판별용. AST 패턴 매칭으로 구현.

### 11.8 시뮬레이터 API (v1.3 신설)

DRAFT 단계에서 규칙 저장 없이 가상 옵션 조합에 대한 매칭·결과를 확인한다. RESOLVED_BOM row 를 생성하지 않는 **evaluate-only** 모드.

```
POST /api/pm/rules/simulate
Content-Type: application/json

Request:
{
  "standardBomId": "DHS-AE225-D-1",
  "standardBomVersion": 3,
  "appliedOptions": {
    "OPT-LAY": "3×2연창",
    "OPT-GLZ": "복층",
    "OPT-CUT": "가로우선",
    "W": 3200, "H": 2400
  },
  "draftRules": [                // 저장 안 된 편집 중인 규칙
    {
      "conditionExpr": "...",
      "actionJson": [...],
      "priority": 100
    }
  ]
}

Response 200:
{
  "matchedRules": [
    { "ruleId": 12, "templateId": "TPL-REINFORCE-SIZE",
      "priority": 100, "applied": true, "reason": null },
    { "ruleId": 15, "templateId": null,
      "priority": 50, "applied": false, "reason": "OVERRIDDEN_BY_HIGHER_PRIORITY" }
  ],
  "mbomDiff": {
    "added":   [ { "itemCode": "PRF-REIN-01", "qty": 2, … } ],
    "removed": [],
    "modified": [
      { "itemCode": "PRF-BAR-H",
        "field": "cutLengthFormula",
        "from": "W - 94", "to": "W" }
    ]
  },
  "warnings": [
    { "code": "TARGET_NOT_IN_BASE_MBOM",
      "message": "REPLACE target 'PRF-XXX' 가 Base MBOM 에 없음" }
  ]
}

Response 422:
{
  "errorCode": "FORMULA_PARSE_ERROR",
  "details": { "line": 1, "column": 23, "unexpectedToken": "OR" }
}
```

- 권한: `ROLE_PM_VIEWER` 이상
- DB 쓰기 없음 — 파싱·매칭·diff 계산만 수행
- 성능 SLA: 규칙 ≤100 매칭 기준 p95 < 200ms (AST 캐시 히트 가정)

### 11.9 결정표 API (v1.3 신설)

PM 담당자의 결정표 뷰 백엔드. 제품군 단위 규칙 전체 + 충돌·공백 요약을 한 응답으로 제공.

```
GET /api/pm/rules/decision-table?productClass={path}&standardBomVersion={N}&scope=MASTER

Response 200:
{
  "columns": {
    "enumGroups": ["OPT-LAY", "OPT-CUT", "OPT-GLZ"],   // 제품군 유효 ENUM
    "hasNumericCondition": true
  },
  "rows": [
    {
      "ruleId": 12,
      "templateInstanceId": "TPI-a7f2…",
      "templateId": "TPL-REINFORCE-SIZE",
      "templateDisplay": "🔩 치수초과보강재 #12",
      "conditions": {
        "OPT-LAY": ["3×2연창"],
        "OPT-CUT": "*",
        "OPT-GLZ": "*",
        "numeric": "W >= 3000"
      },
      "actionSummary": "+보강재×2, +보강공정",
      "priority": 100
    },
    {
      "ruleId": 7,
      "templateInstanceId": "TPI-b4c1…",
      "templateId": "TPL-CUT-DIRECTION",
      "groupIndex": 0,                    // 인스턴스 내 첫 번째 컴파일 결과
      "templateDisplay": "◩ 절단방향 #7 — 가로우선",
      …
    }
  ],
  "conflicts": [
    {
      "ruleIds": [12, 15],
      "overlap": "OPT-LAY='3×2연창' AND W >= 3500",
      "winner": 12,
      "reason": "HIGHER_PRIORITY"
    }
  ],
  "gaps": [
    { "combination": "OPT-LAY='3×3연창' AND OPT-GLZ='단층'", "reason": "NO_MATCHING_RULE" }
  ]
}
```

- 권한: `ROLE_PM_VIEWER` 이상
- 캐싱: `(productClass, standardBomVersion, scope)` 키로 LRU 캐시. `BOM_RULE` INSERT/UPDATE/DELETE 시 해당 productClass 키 무효화
- 충돌·공백 계산 전략:
  - 규칙 수 ≤100 → 전역 AST 교집합 (단순)
  - 규칙 수 >100 → incremental 모드 (편집된 규칙과 기존 규칙들 간의 교집합만 재계산)
- 성능 SLA: 규칙 ≤200 행 기준 p95 < 500ms
```

### Step 3: §11.1 참조 용어사전 버전 갱신

- [ ] **기존 `근거 용어사전 | [[WIMS_용어사전_BOM_v1.3]] §11.2, §13, §4` 를 v1.4 로 갱신**

`old_string`:

```markdown
| 근거 용어사전 | [[WIMS_용어사전_BOM_v1.3]] §11.2, §13, §4 |
```

`new_string`:

```markdown
| 근거 용어사전 | [[WIMS_용어사전_BOM_v1.4]] §11.2, §13(.1~.6), §4 |
```

### Step 4: 변경 이력 표 갱신 (파일 말미)

- [ ] **Grep 으로 변경 이력 위치 확인, v1.3 row 추가**

```markdown
| v1.3 | 2026-04-16 | [[2026-04-16-bom-rule-ui-design]] 반영. §11.7 템플릿 컴파일러 명세, §11.8 시뮬레이터 API(POST /pm/rules/simulate), §11.9 결정표 API(GET /pm/rules/decision-table). 근거 용어사전 v1.3→v1.4 |
```

### Step 5: 프론트매터 title 버전 갱신

- [ ] **파일 상단 `title` 을 `v1.2` → `v1.3` 로 갱신, `updated: 2026-04-16`**

### Step 6: 검증

- [ ] **Grep: `§11\.[789]`, `simulate`, `decision-table`, `TemplateCompiler` 모두 등장 확인**

---

## Task 5: DE22-1 05_BOM관리 §9.3.4 재구성 — 3뷰 체계 반영

**Files:**
- Modify: `docs/3_DE(설계)/DE22-1_화면설계서/sections/05_BOM관리.md`

**근거:** 스펙 §1 (정보구조·3뷰), §2 (템플릿 시스템), §3 (결정표), §4 (전문가 모드).

**방침:** `§9.3.4 옵션별규칙 관리 서브탭` 내부를 3뷰(템플릿 갤러리 / 결정표 / 전문가 모드) 로 재구성. 서브탭 목록(L214) 은 변경하지 않음 — 3뷰는 서브탭 **내부** 뷰 스위치.

### Step 1: 현재 §9.3.4 경계 확인 (L321~403)

- [ ] **Read: offset=321, limit=85**

### Step 2: §9.3.4 헤딩과 도입부를 3뷰 체계로 교체

- [ ] **Edit: §9.3.4 헤딩 + 도입부 4~5줄을 아래 블록으로 대체**

`old_string`:

```markdown
### 9.3.4 옵션별규칙 관리 서브탭 — action 카드 UI (v1.5 전면 개정)

용어사전 v1.3 §13.2 확정 **동사 4종**: `SET` / `REPLACE` / `ADD` / `REMOVE`. 각 verb에 따라 폼이 다르게 렌더링.
```

`new_string`:

```markdown
### 9.3.4 옵션별규칙 관리 서브탭 — 3뷰 체계 (v1.5-r2 — [[2026-04-16-bom-rule-ui-design]] 반영)

> [!info] 3뷰 체계
> 같은 `BOM_RULE` 데이터를 **3개의 상호 전환 가능한 뷰** 로 보여준다. 데이터는 하나, 뷰만 바뀜.
> - **📋 템플릿 갤러리** (견적 담당자 기본) — 슬롯 기반 규칙 생성·소비
> - **📊 결정표** (PM 담당자 기본) — 제품군 전체 조감·충돌·공백 검출
> - **⚙️ 전문가 모드** (`ROLE_PM_ADMIN` 전용, 기본 숨김) — 원시 `condition_expr`·`action_json` 직접 편집

```
┌─ 서브탭 상단 고정 헤더 ────────────────────────────────────────┐
│ [제품군: 225 미서기 ▾]  [sbv12]  [상태: DRAFT]                │
│ [뷰: 📋 템플릿 | 📊 결정표 | ⚙️ 전문가]        [🔍 시뮬레이터 🔘]│
└──────────────────────────────────────────────────────────────┘
```

용어사전 v1.4 §13.2 확정 **동사 4종**: `SET` / `REPLACE` / `ADD` / `REMOVE`. 템플릿 갤러리의 슬롯 폼은 동사·조건식을 숨기고, 전문가 모드는 동사 4종을 그대로 노출.

#### 9.3.4.1 📋 템플릿 갤러리 뷰 (견적 담당자 기본)
```

### Step 3: 템플릿 갤러리 뷰 상세 추가 (§9.3.4.1)

- [ ] **Edit 로 Step 2 에서 추가한 마지막 라인 `#### 9.3.4.1 📋 템플릿 갤러리 뷰 (견적 담당자 기본)` 뒤에 본문 삽입**

```markdown

**초기 빌트인 6종** 이 갤러리에 카드로 진열된다 — 용어사전 v1.4 §13.3·DE35-1 §6.5.3 근거.

```
┌─ 📋 템플릿 갤러리 ─────────────────────────────────────────┐
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │ 🔩          │ │ ◩          │ │ 🧱          │             │
│  │ 치수초과    │ │ 절단방향    │ │ 옵션별      │             │
│  │ 보강재 추가 │ │ 선택        │ │ 자재 교체   │             │
│  │ [사용]      │ │ [사용]      │ │ [사용]      │             │
│  └────────────┘ └────────────┘ └────────────┘             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │ 📐          │ │ ➕          │ │ 🔀          │             │
│  │ 치수 구간별 │ │ 옵션별      │ │ 파생제품    │             │
│  │ 산식 변경   │ │ 부자재 추가 │ │ 차이        │             │
│  │ [사용]      │ │ [사용]      │ │ [사용]      │             │
│  └────────────┘ └────────────┘ └────────────┘             │
└──────────────────────────────────────────────────────────┘
```

**슬롯 입력폼 — TPL-REINFORCE-SIZE 예**

```
┌─ 🔩 치수 초과 보강재 추가 ─────────────────────────────────┐
│ 규칙명: [ 225-3X2 보강재 ]                                 │
│                                                           │
│ 제품군:     [미서기/마스/복층/225 ▾]                        │
│ 레이아웃:   [3×2연창 ▼] (다중 선택 가능)                     │
│ 기준 축:    (○W) (●H)                                      │
│ 임계값:     [ 3000 ] mm                                    │
│ 추가 자재:  [PRF-REIN-01 보강재 ▼]                          │
│ 추가 공정:  [PRC-REIN-01 보강공정 ▼]                        │
│                                                           │
│ ─ 자연어 미리보기 ────────────────────────────────────────  │
│ "225 미서기·3×2연창·W≥3000mm 일 때 보강재 1개와 보강공정을 │
│  추가합니다"                                               │
│                                                           │
│ ─ 원시 조건식 (토글) ─────────────────────────────────────  │
│ productClassPath = '미서기/마스/복층/225' AND             │
│   OPT-LAY IN ('3×2연창') AND W >= 3000                    │
│                                                           │
│ [시뮬레이션 먼저 실행] [저장]                              │
└──────────────────────────────────────────────────────────┘
```

- **자연어 미리보기** 와 **원시 조건식 토글** 이 쌍으로 제공돼 초보자·숙련자 모두 커버
- **시뮬레이션** 버튼은 시뮬레이터 패널(§9.3.4.4) 로 슬롯값 전달

#### 9.3.4.2 📊 결정표 뷰 (PM 담당자 기본)

제품군 전체 규칙을 **한 장**에 펼쳐 충돌·공백을 드러낸다.

```
┌────────────────────────────┬────────┬────────┬────────┬──────────┬─────────────────┬─────────┐
│ 규칙 (템플릿#인스턴스)      │OPT-LAY │OPT-CUT │OPT-GLZ │ 치수조건 │ 액션 요약         │우선순위 │
├────────────────────────────┼────────┼────────┼────────┼──────────┼─────────────────┼─────────┤
│ 🔩 치수초과보강재 #12       │3×2연창 │   *    │   *    │ W≥3000   │+보강재×2,+공정   │  100    │
├── ⚠ 충돌: #15 와 겹침 ──────┴────────┴────────┴────────┴──────────┴─────────────────┴─────────┤
│ ◩ 절단방향 #7 ─┬가로우선   │   *    │가로우선│   *    │   -      │SET 가로바.cutF  │   50    │
│                └세로우선    │   *    │세로우선│   *    │   -      │SET 세로바.cutF  │   50    │
│ 🧱 유리교체 #3              │   *    │   *    │ 복층   │   -      │REPLACE 유리    │   30    │
│ (미커버 조합 14개 있음 → 보기)                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **행 단위** = `BOM_RULE` 1행. `template_instance_id` 동일 행들은 `◩` 아이콘 + 들여쓰기로 **묶음 표시**
- **치수조건 열** = NUMERIC 조건을 식으로 표기 (`W≥3000`, `[2000,3000)`)
- **충돌(⚠) / 공백(미커버 N개)** 자동 검출 — DE11-1 §11.9 결정표 API 제공
- 인터랙션: 행 클릭 → 우측 슬롯 폼 슬라이드 / 행 우클릭 "원시 편집" → 전문가 모드 점프 (권한 검사)

#### 9.3.4.3 ⚙️ 전문가 모드 뷰 (ROLE_PM_ADMIN 전용)

기본 숨김. 권한 사용자에게만 뷰 스위치 탭 노출. 용어사전 v1.4 §13.2 동사 4종 + §13.1 UNIQUE_V1 산식을 직접 편집.

```
┌─ 좌: 메타 ──────┬─ 중앙: 에디터 ────────────────────────┬─ 우: 시뮬 ──┐
│ 규칙명          │ 조건식 (UNIQUE_V1, syntax highlight): │ 가상 옵션    │
│ 우선순위        │ ┌────────────────────────────────┐   │ OPT-LAY▾     │
│ 제품군          │ │ productClassPath = '…'          │   │ OPT-GLZ▾     │
│ 상태            │ │ AND OPT-LAY IN ('3×2','3×3')    │   │ W [    ]     │
│ scope_type      │ │ AND W >= 3000                   │   │ H [    ]     │
│                 │ │ AND IIF(OPT-GLZ='복층',H≥2200,…)│   │              │
│                 │ └────────────────────────────────┘   │ 매칭 규칙     │
│                 │ [AST 트리 토글] [linter: ✓]          │ ▶ #12 …     │
│                 │                                       │ ◌ #15 (기각) │
│                 │ 액션 카드 리스트 [+ 액션 ▾]           │              │
│                 │ ┌─ SET #1 ────────────── [⋮][✕] ─┐  │ MBOM diff    │
│                 │ │ target: {itemCode: PRF-BAR-H}  │  │ + 보강재 ×2  │
│                 │ │ field:  cutLengthFormula        │  │ ~ 가로바 …   │
│                 │ │ value:  W                       │  │              │
│                 │ └─────────────────────────────────┘  │              │
│                 │ ┌─ ADD #2 ────────────── [⋮][✕] ─┐  │              │
│                 │ │ item: {itemCode, cutDirection…} │  │              │
│                 │ └─────────────────────────────────┘  │              │
└─────────────────┴───────────────────────────────────────┴──────────────┘
```

**verb별 필수 필드**

| verb | 필수 입력 | 비고 |
|------|----------|------|
| `SET` | target·field·value (리터럴 또는 산식) | 변수(W/H/W1/H1/H2/H3) 자동완성, `IIF(...)` / `IN (...)` 템플릿 |
| `REPLACE` | target·from(itemCode)·to(itemCode) | from/to는 ITEM 마스터 드롭다운 |
| `ADD` | item 구성 객체(itemCode/itemName/quantity/unit/cutLength…) | 서브 폼 |
| `REMOVE` | target (MBOM 선택자) | — |

> [!tip] 산식 에디터 보조 (용어사전 v1.4 §13.1)
> - 변수: `W`, `H`, `W1`, `H1`, `H2`, `H3`
> - 함수: `IIF(condition, ifTrue, ifFalse)`, `MIN`, `MAX`, `ROUND`
> - **집합 연산자 (v1.4 신규):** `IN (값1, 값2, …)`
> - 실시간 문법 검증 + AST 트리 토글
> - 참조 OPT-DIM 이 조건식에서 활성 상태가 아니면 경고 뱃지

> [!warning] 원시 배지
> 전문가 모드로 저장된 규칙은 결정표·갤러리에서 `🔒 원시` 읽기 전용 배지로 표시된다. 견적 담당자 실수 편집 방지.

#### 9.3.4.4 🔍 시뮬레이터 패널 (뷰 공통 사이드 패널)

헤더 토글로 어느 뷰에서든 **열고 닫기** 가능. 가상 옵션 조합을 입력하면 매칭 규칙과 MBOM diff 를 저장 없이 반환. DE11-1 §11.8 (`POST /pm/rules/simulate`) 백엔드.

```
┌─ 🔍 시뮬레이터 ───────────────────────────────┐
│ 가상 옵션 조합                                │
│ OPT-LAY [3×2연창 ▾] OPT-GLZ [복층 ▾]           │
│ OPT-CUT [가로우선 ▾] W [3200] H [2400]         │
│                                              │
│ 매칭 규칙 (우선순위 순)                        │
│ ▶ #12 치수초과보강재 → +보강재×2, +공정       │
│ ▶ #7 절단방향 (가로) → SET 가로바.cutF=W      │
│ ◌ #15 (우선순위 충돌, 적용 안 됨)              │
│                                              │
│ 최종 MBOM diff                                │
│ + 보강재 PRF-REIN-01 ×2                       │
│ ~ 가로바 PRF-BAR-H cutF "W-94" → "W"          │
│ ~ 세로바 PRF-BAR-V cutF "H" → "H-40"          │
└──────────────────────────────────────────────┘
```

- **evaluate-only** — DB 쓰기 없음, AST 캐시 히트 시 p95 < 200ms (DE11-1 §11.8)
- **견적 담당자 노출 고정** — 템플릿 갤러리 저장 버튼 우측에 "시뮬레이션 먼저 실행" 권고 배너

#### 9.3.4.5 action 동사 4종 적용 시퀀스 (기존 v1.5 유지)
```

### Step 4: 기존 시퀀스 다이어그램 섹션 헤딩 정규화

- [ ] **Edit: 기존 `#### action 동사 4종 적용 시퀀스` 제목을 `#### 9.3.4.5 action 동사 4종 적용 시퀀스 (v1.5 계승)` 로 교체**

`old_string`:

```markdown
#### action 동사 4종 적용 시퀀스
```

`new_string`:

```markdown
#### 9.3.4.5 action 동사 4종 적용 시퀀스 (v1.5 계승)
```

### Step 5: 05_BOM관리 파일 상단의 `SCR-PM-013B` 메타 / 요구사항 ID 갱신

- [ ] **Grep: `FR-PM-01[0-3]` 이 나열된 위치 (L211 근처)**

- [ ] **Edit: 요구사항 ID 목록에 025, 026, 027 추가**

`old_string`:

```markdown
| 요구사항 | FR-PM-010, 011, 012, 013 |
```

`new_string`:

```markdown
| 요구사항 | FR-PM-010, 011, 012, 013, **025**(템플릿 갤러리), **026**(결정표·충돌), **027**(시뮬레이터) |
```

### Step 6: 05_BOM관리 변경 이력 row 추가 (파일 말미)

- [ ] **파일 말미 변경 이력 표에 row 추가**

```markdown
| v1.5-r2 | 2026-04-16 | [[2026-04-16-bom-rule-ui-design]] 반영. §9.3.4 서브탭 내부를 3뷰 체계(📋 템플릿 갤러리 / 📊 결정표 / ⚙️ 전문가) 로 재구성 + §9.3.4.4 시뮬레이터 패널. `RULE_TEMPLATE` 초기 6종 노출. SCR-PM-013B 요구사항 ID +3 (025/026/027) |
```

### Step 7: 검증

- [ ] **Grep: `9\.3\.4\.[1-5]`, `📋 템플릿`, `📊 결정표`, `⚙️ 전문가`, `🔍 시뮬레이터` 모두 등장 확인**

```
Grep(pattern="9\.3\.4\.[1-5]", path="docs/3_DE(설계)/DE22-1_화면설계서/sections/05_BOM관리.md", output_mode="count")
```

Expected: 5회 이상 (서브섹션 선언 + 헤딩 번호 언급).

---

## Task 6: AN12-1 Phase1 요구사항 — FR-PM-025/026/027 신설

**Files:**
- Modify: `docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md`

**근거:** 기존 FR-PM-018~024 확장. 스펙의 3뷰 체계 + 결정표 + 시뮬레이터가 요구사항 차원에서 식별되어야 추적 가능.

### Step 1: §2.2 신규 FR 요약 표 확장

- [ ] **Read: L180~200 재확인**

- [ ] **Edit: `FR-PM-024` row 뒤에 3개 row 추가**

`old_string`:

```markdown
| FR-PM-024 | RuleEngine 산식 평가 및 frozen 불변성 보장 | 상 | 최상 | 용어사전 v1.3 §4, DE11-1 v1.2 |

**개정 FR (4건):**
```

`new_string`:

```markdown
| FR-PM-024 | RuleEngine 산식 평가 및 frozen 불변성 보장 | 상 | 최상 | 용어사전 v1.3 §4, DE11-1 v1.2 |
| FR-PM-025 | BOM_RULE 템플릿 갤러리 — 슬롯 기반 규칙 생성 (RULE_TEMPLATE 빌트인 6종) | 중 | 상 | 용어사전 v1.4 §13.3, DE35-1 §6.5.3, DE22-1 §9.3.4.1 |
| FR-PM-026 | BOM_RULE 결정표 뷰 — 제품군 규칙 조감 + 충돌·공백 자동 검출 | 상 | 상 | 용어사전 v1.4 §13.6, DE11-1 §11.9, DE22-1 §9.3.4.2 |
| FR-PM-027 | BOM_RULE 시뮬레이터 — 저장 전 가상 옵션 조합 매칭·MBOM diff | 중 | 상 | DE11-1 §11.8, DE22-1 §9.3.4.4 |

**개정 FR (4건):**
```

### Step 2: §3.1 개정 FR 서술 — FR-PM-012 에 상태전이·원자번들 명시 보강

- [ ] **Grep: FR-PM-012 상세 섹션 위치**

```
Grep(pattern="^#### FR-PM-012", path="docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md", output_mode="content", -n=true)
```

- [ ] **Edit: FR-PM-012 의 `v1.1 보강 포인트` 리스트 마지막에 2개 bullet 추가**

`old_string`:

```markdown
- `ruleEngineVersion` 을 Resolved 에 기록 (frozen 후 산식 언어 업그레이드 대비)

---
```

`new_string`:

```markdown
- `ruleEngineVersion` 을 Resolved 에 기록 (frozen 후 산식 언어 업그레이드 대비)
- **v1.1-r1 추가 (2026-04-16):** `BOM_RULE` 확장 5컬럼(template_id, template_instance_id, slot_values, scope_type, estimate_id) — 용어사전 v1.4 §13.4, DE35-1 §6.5.2 근거. DRAFT→RELEASED 전환은 EBOM·MBOM·Config·BOM_RULE 를 원자 번들로 묶어 수행
- **scope_type=ESTIMATE 오버레이 원칙:** PM 마스터 규칙 + 견적 예외 규칙을 동일 `BOM_RULE` 테이블의 다른 축(`scope_type`)으로 저장. RuleEngine resolve 시 MASTER 평가 후 ESTIMATE 오버레이 (Phase 2 ES 서브시스템 상세 설계에서 확정)

---
```

### Step 3: §3.2 신규 FR 상세 — FR-PM-025/026/027 본문 추가

- [ ] **Grep: `### 3\.2` 또는 `#### FR-PM-024` 마지막 서술 위치**

```
Grep(pattern="^#### FR-PM-024|^### 3\.2|^## 4\.", path="docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md", output_mode="content", -n=true)
```

- [ ] **Edit: FR-PM-024 상세 서술 블록 뒤에 3개 FR 상세 블록 삽입**

`new_string` (Step 3 에 삽입할 전체):

```markdown

---

#### FR-PM-025 BOM_RULE 템플릿 갤러리 (v1.1-r1 신설)

| 항목 | 내용 |
|------|------|
| **요구사항 ID** | FR-PM-025 |
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | [[2026-04-16-bom-rule-ui-design]] §2, 사용자 피드백 "규칙 조합 방식이 어렵다" (2026-04-16) |
| **관련 요구사항** | FR-PM-012, FR-PM-021, FR-PM-024, FR-PM-026, FR-PM-027 |
| **관련 화면** | [[DE22-1_화면설계서_v1.5#SCR-PM-013B]] §9.3.4.1 |

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

#### FR-PM-026 BOM_RULE 결정표 뷰 (v1.1-r1 신설)

| 항목 | 내용 |
|------|------|
| **요구사항 ID** | FR-PM-026 |
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 상 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | [[2026-04-16-bom-rule-ui-design]] §3 |
| **관련 요구사항** | FR-PM-021, FR-PM-024, FR-PM-025 |
| **관련 화면** | [[DE22-1_화면설계서_v1.5#SCR-PM-013B]] §9.3.4.2 |

**요구사항:**
- 제품군 단위로 규칙 전체를 **결정표(Decision Table)** 형식으로 조감할 수 있어야 한다. 행 = `BOM_RULE` 1행, 열 = 유효 OPTION_GROUP ENUM + 치수조건 + 액션 요약 + 우선순위.
- `template_instance_id` 가 같은 행들은 들여쓰기·아이콘으로 묶음 표시.
- 두 규칙의 조건 교집합이 비어있지 않으면서 액션이 경합하면 **충돌 경고** 를 자동 표시. 동점 우선순위 시 ❓ 배지.
- 제품군의 유효 옵션 조합 중 어떤 규칙도 매칭되지 않는 조합은 **미커버(gap)** 로 요약 집계.
- 규칙 수 ≤100 은 프런트 AST 교집합 계산, >100 은 서버 incremental 모드 (DE11-1 §11.9).

**수용 기준:**
- 규칙 ≤200 행 기준 결정표 로드 p95 < 500ms (NFR-PF-PM-004 신설)
- 충돌·공백 발견 즉시 드로어 열어 상세 제공
- 결정표 API 응답 형식: DE11-1 §11.9

---

#### FR-PM-027 BOM_RULE 시뮬레이터 (v1.1-r1 신설)

| 항목 | 내용 |
|------|------|
| **요구사항 ID** | FR-PM-027 |
| **분류** | 기능 > 제품관리 > BOM관리 > 옵션별규칙 |
| **난이도** | 중 / **우선순위** 상 / **수용여부** 수용 |
| **출처** | [[2026-04-16-bom-rule-ui-design]] §6 |
| **관련 요구사항** | FR-PM-021, FR-PM-024, FR-PM-025, FR-PM-026 |
| **관련 화면** | [[DE22-1_화면설계서_v1.5#SCR-PM-013B]] §9.3.4.4 |

**요구사항:**
- 가상 옵션 조합을 입력해 **매칭 규칙·최종 MBOM diff** 를 DB 저장 없이 확인할 수 있어야 한다 (evaluate-only).
- API: `POST /api/pm/rules/simulate` (DE11-1 §11.8). 편집 중인 draft rules 도 리퀘스트에 포함 가능.
- 응답은 매칭 규칙 리스트(우선순위 순, 기각 규칙 포함·사유), Base MBOM 대비 추가/제거/변경 diff, 경고 목록을 포함.
- 뷰 공통 사이드 패널로 모든 뷰(템플릿·결정표·전문가) 에서 접근 가능.
- 견적 담당자에게도 제공 (`ROLE_PM_VIEWER` 이상).

**수용 기준:**
- 규칙 ≤100 매칭 기준 p95 < 200ms (NFR-PF-PM-005 신설)
- MBOM diff 에 `cutLengthFormula` 변경 등 필드 단위 차이 표시
- 시뮬 실패(예: REPLACE target 부재) 는 422 + 경고 목록

---
```

### Step 4: NFR 표에 2개 row 추가 (선택 — 수용 기준과 정합)

- [ ] **Edit: §2.2 `신규 NFR` 표에 2개 row 추가**

`old_string`:

```markdown
| NFR-MT-PM-001 | RuleEngine AST 캐시 기동 요구사항 | JVM 기동 후 60초 이내 warm-up 완료 |

---
```

`new_string`:

```markdown
| NFR-MT-PM-001 | RuleEngine AST 캐시 기동 요구사항 | JVM 기동 후 60초 이내 warm-up 완료 |
| NFR-PF-PM-004 | BOM_RULE 결정표 로드 SLA | 규칙 ≤200 행 기준 p95 < 500ms |
| NFR-PF-PM-005 | BOM_RULE 시뮬레이터 응답 SLA | 규칙 ≤100 매칭 기준 p95 < 200ms (AST 캐시 히트) |

---
```

### Step 5: 변경 이력 갱신

- [ ] **파일 말미 변경 이력 표에 v1.1-r1 row 추가**

```markdown
| v1.1-r1 | 2026-04-16 | [[2026-04-16-bom-rule-ui-design]] 반영. FR-PM-025(템플릿 갤러리)·FR-PM-026(결정표)·FR-PM-027(시뮬레이터) 신설, FR-PM-012 `BOM_RULE` +5컬럼 보강, NFR-PF-PM-004·005 신설 |
```

### Step 6: 프론트매터 `updated: 2026-04-16` 확인 (이미 맞으면 skip)

### Step 7: 검증

- [ ] **Grep: `FR-PM-025`, `FR-PM-026`, `FR-PM-027` 각각 3회 이상 등장 확인**

```
Grep(pattern="FR-PM-02[567]", path="docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md", output_mode="count")
```

---

## Task 7: STATUS.md 업데이트

**Files:**
- Modify: `STATUS.md`

### Step 1: "최근 변화" 라인 갱신

- [ ] **Read: L1~15**

- [ ] **Edit: L9 "최근 변화" 라인 맨 뒤에 문장 추가**

`old_string`:

```markdown
- **최근 변화 (04.15~04.16):** 유니크시스템 참고자료 5건 분석 → BOM 도메인 용어사전 v1.0 → v1.1 → v1.2 → **v1.3** 진화 → 후속 6개 설계 문서 일괄 개정 → 6관점 검증(V1~V6) + 3관점 크로스체크(CX1~CX3) + P0/P1/P2 정정 완료
```

`new_string`:

```markdown
- **최근 변화 (04.15~04.16):** 유니크시스템 참고자료 5건 분석 → BOM 도메인 용어사전 v1.0 → v1.1 → v1.2 → **v1.3** 진화 → 후속 6개 설계 문서 일괄 개정 → 6관점 검증(V1~V6) + 3관점 크로스체크(CX1~CX3) + P0/P1/P2 정정 완료. **BOM 옵션별규칙 관리 UI 설계 (3뷰 체계) 신규 스펙 → 용어사전 v1.4 + 하위 6개 문서 r2 개정**
```

### Step 2: 산출물 버전 현황 갱신

- [ ] **Edit: DE35-1 행 업데이트**

`old_string`:

```markdown
- DE35-1 미서기이중창 표준 BOM 구조 정의서 **v1.5-r1** — md (2026-04-16, 단독 SOT 재구성. 엔티티 6개 확장 + 신규 3개. BOM_RULE 카탈로그 10건. v1.4 보존)
```

`new_string`:

```markdown
- DE35-1 미서기이중창 표준 BOM 구조 정의서 **v1.5-r2** — md (2026-04-16, [[2026-04-16-bom-rule-ui-design]] 반영. BOM_RULE +5컬럼, RULE_TEMPLATE·BOM_RULE_HISTORY 신설, 템플릿 컴파일 규칙. v1.5-r1 보존)
```

- [ ] **Edit: DE32-1 · DE24-1 · DE22-1 · DE11-1 행 각각 r2/v1.3 로 업데이트 (동일 패턴)**

DE32-1:

```
- DE32-1 BOM 도메인 ER 다이어그램 **v1.1** — md (2026-04-16, BOM_RULE +5컬럼, RULE_TEMPLATE·BOM_RULE_HISTORY 엔티티 신설, erDiagram 관계 추가. v1.0 보존)
```

DE22-1:

```
- DE22-1 화면설계서 **v1.5-r2** — md **분산 구조** (메인 인덱스 + sections/ 8개. 총 28 화면. §9.3.4 옵션별규칙 관리 3뷰 체계 재구성(템플릿·결정표·전문가) + 시뮬레이터 패널. v1.5-r1 보존)
```

DE11-1:

```
- DE11-1 소프트웨어 아키텍처 설계서 **v1.3** — md (2026-04-16, §11.7 템플릿 컴파일러 / §11.8 시뮬레이터 API / §11.9 결정표 API 신설. v1.2 보존)
```

- [ ] **Edit: AN12-1 행 업데이트**

```
- AN12-1-P1 요구사항정의서 Phase1 **v1.1-r1** — md (2026-04-16, FR-PM-025/026/027 신설 + FR-PM-012 +5컬럼 보강 + NFR-PF-PM-004/005 신설. v1.1 보존)
```

### Step 3: "BOM 도메인 용어사전 진화" 섹션에 v1.4 row 추가

- [ ] **Edit: v1.3 bullet 다음에 v1.4 bullet 추가**

`old_string`:

```markdown
- **v1.3 (2026-04-16, 최신)** — 검증 V1~V6 Blocker/P0 반영. supplyDivision 단일화 / *_evaluated snapshot / NUMERIC 옵션 해시 제외 / enablement_condition / BOM_RULE action 4동사 / itemCategory enum / 길이 기반 lossRate
```

`new_string`:

```markdown
- v1.3 (2026-04-16) — 검증 V1~V6 Blocker/P0 반영. supplyDivision 단일화 / *_evaluated snapshot / NUMERIC 옵션 해시 제외 / enablement_condition / BOM_RULE action 4동사 / itemCategory enum / 길이 기반 lossRate
- **v1.4 (2026-04-16, 최신)** — [[2026-04-16-bom-rule-ui-design]] 반영. §13 재조직(13.1~13.6), §13.3 RULE_TEMPLATE / §13.4 BOM_RULE 확장 5컬럼 / §13.5 BOM_RULE_HISTORY, §13.1 `IN` 연산자, §2 엔티티 +2, §7 QTY_CHANGE·LOSS_CHANGE 저장 모델 금지
```

### Step 4: "후속 작업" 섹션의 Flyway 마이그레이션 라인 갱신

- [ ] **Edit: `BOM_RULE(+3)` 을 `BOM_RULE(+5)` 로, 신규 테이블에 RULE_TEMPLATE·BOM_RULE_HISTORY 추가**

`old_string`:

```markdown
- Flyway 마이그레이션 스크립트 작성 — PRODUCT(+5), OPTION_VALUE(+5), MBOM(+9), ITEM(+3), BOM_RULE(+3), RESOLVED_BOM(+2) + 신규 3 테이블
```

`new_string`:

```markdown
- Flyway 마이그레이션 스크립트 작성 — PRODUCT(+5), OPTION_VALUE(+5), MBOM(+9), ITEM(+3), **BOM_RULE(+5)**, RESOLVED_BOM(+2) + 신규 **5 테이블 (기존 3 + RULE_TEMPLATE + BOM_RULE_HISTORY)** + 빌트인 템플릿 6종 시드
```

### Step 5: 개방 이슈를 "후속 작업 → Gate 2 이후" 섹션에 추가

- [ ] **Grep: `### Gate 1 직후` 섹션 위치 확인 후 그 안에 BOM 옵션별규칙 UI 관련 항목 추가**

`old_string`:

```markdown
- RuleEngine `wims-rule-engine` 모듈 BE 구현 착수 (DE11-1 §11 명세)
```

`new_string`:

```markdown
- RuleEngine `wims-rule-engine` 모듈 BE 구현 착수 (DE11-1 §11 명세, §11.7 템플릿 컴파일러 포함)
- **BOM 옵션별규칙 UI 3뷰 체계 FE/BE 구현 착수** — 시뮬레이터 API(§11.8) / 결정표 API(§11.9) / 템플릿 컴파일러(§11.7). Flyway 마이그레이션 V{n}__rule_templates_seed.sql (빌트인 6종). 상세 스펙 [[2026-04-16-bom-rule-ui-design]]
- **개방 이슈** (스펙 §개방 이슈 6건): scope_type=ESTIMATE 오버레이 로직은 Phase 2 ES 설계에 위임 / 템플릿 승격 마법사 UX 는 S3~S4 / 초기 빌트인 6종 커버리지는 실제 규칙 샘플과 대조 후 확정 필요
```

### Step 6: 검증

- [ ] **Grep: `v1.4`, `v1.5-r2`, `FR-PM-025`, `RULE_TEMPLATE`, `BOM_RULE_HISTORY` 가 STATUS.md 에 모두 등장 확인**

```
Grep(pattern="v1\.4|v1\.5-r2|FR-PM-02[567]|RULE_TEMPLATE|BOM_RULE_HISTORY", path="STATUS.md", output_mode="count")
```

---

## Task 8: 교차 검증 · 정합성 체크

**Files:** (읽기 전용 · 경우에 따라 소폭 수정)

### Step 1: 용어 일관성 grep

- [ ] **편집 대상 6개 파일 전체에서 신규 용어 등장 패턴 확인**

```
Grep(pattern="RULE_TEMPLATE|template_instance_id|slot_values|scope_type|estimate_id|BOM_RULE_HISTORY", path="docs/", output_mode="files_with_matches")
```

Expected matches (최소):
- `docs/참고자료/WIMS_용어사전_BOM_v1.4.md`
- `docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md`
- `docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md`
- `docs/3_DE(설계)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md`
- `docs/3_DE(설계)/DE22-1_화면설계서/sections/05_BOM관리.md`
- `docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md`
- `docs/superpowers/specs/2026-04-16-bom-rule-ui-design.md`

만일 Expected 중 매칭 안 된 파일이 있으면 해당 Task 로 복귀.

### Step 2: QTY_CHANGE·LOSS_CHANGE 잔류 검사

- [ ] **편집 대상 파일에서 `QTY_CHANGE` · `LOSS_CHANGE` 가 "저장 모델" 맥락으로 남아있는지 확인**

```
Grep(pattern="QTY_CHANGE|LOSS_CHANGE", path="docs/", output_mode="content", -n=true, -C=1)
```

기대: 용어사전 v1.4 §7 (금지 용어) 외의 모든 등장은 "UI 템플릿 별명" 맥락. 저장 모델 맥락(action_json verb, BOM_RULE 컬럼) 잔류는 제거.

### Step 3: 버전 참조 일관성 검사

- [ ] **`용어사전.*v1\.3` 패턴 등장 확인 — 대부분 v1.4 로 갱신되어야 함**

```
Grep(pattern="용어사전.*v1\.3|WIMS_용어사전_BOM_v1\.3", path="docs/", output_mode="content", -n=true)
```

잔류가 의도된 경우(v1.3 변경 이력 참조 등) 는 OK. 설계·요구사항·화면·아키텍처 본문의 "근거: 용어사전 v1.3" 같은 표현이 남아있으면 각 Task 로 복귀해 v1.4 로 갱신.

### Step 4: wikilink 무결성 검사

- [ ] **신규·변경 wikilink 가 실제 파일명과 일치하는지**

```
Grep(pattern="\[\[2026-04-16-bom-rule-ui-design\]\]", path="docs/", output_mode="count")
Glob(pattern="docs/superpowers/specs/2026-04-16-bom-rule-ui-design.md")
```

Expected: wikilink 5회 이상 등장, 대상 파일 존재.

```
Grep(pattern="\[\[WIMS_용어사전_BOM_v1\.4\]\]", path="docs/", output_mode="count")
Glob(pattern="docs/참고자료/WIMS_용어사전_BOM_v1.4.md")
```

Expected: wikilink 5회 이상, 대상 파일 존재.

### Step 5: 프론트매터 updated 일관성

- [ ] **편집한 파일들의 프론트매터 `updated: 2026-04-16` 확인**

```
Grep(pattern="^updated:", path="docs/", output_mode="content", -n=true, -A=0)
```

각 편집 파일에서 2026-04-16 이면 OK.

### Step 6: 최종 보고

- [ ] **모든 Task 의 Step 검증이 통과하면 사용자에게 다음을 보고:**

보고 항목:
1. 편집한 6개 파일과 버전 변경 요약
2. 신규 생성된 파일 1개 (`WIMS_용어사전_BOM_v1.4.md`)
3. 신설된 요구사항 3건 (FR-PM-025/026/027) + NFR 2건
4. Gate 1 이후 후속 작업 (소스 레포 구현 플랜 작성) 착수 준비 완료

---

## 자체 리뷰 (플랜 작성 후 체크)

### 1. 스펙 커버리지

| 스펙 섹션 | 반영 Task | 비고 |
|---|---|---|
| §1 정보구조·3뷰 체계 | Task 5 (DE22-1) | §9.3.4.1~4.4 재구성 |
| §2 템플릿 시스템 | Task 1 (용어사전 §13.3), Task 2 (DE35-1 §6.5.3·§6.5.5), Task 5 (DE22-1 §9.3.4.1) | 빌트인 6종 목록 |
| §3 결정표 뷰 | Task 2 (DE35-1 §8.2), Task 4 (DE11-1 §11.9), Task 5 (DE22-1 §9.3.4.2), Task 6 (FR-PM-026) | |
| §4 전문가 모드 | Task 5 (DE22-1 §9.3.4.3), Task 1 (§13.2 SET 특수케이스 통합) | |
| §5 데이터 매핑·권한 | Task 1 (§13.4), Task 2 (DE35-1 §6.5.2·§6.5.4), Task 3 (DE32-1 §2.12·§2.14·§2.15) | scope_type 분리 |
| §6 검증·에러·테스팅 | Task 4 (DE11-1 §11.8 시뮬레이터), Task 6 (FR-PM-027, NFR 2건) | 검증 3계층·테스팅 전략은 본 문서 플랜에 포함 안 함 (소스 레포 TDD 플랜 범위) |
| 개방 이슈 6건 | Task 7 (STATUS.md 후속 작업) | |

### 2. 플레이스홀더 스캔

- [x] "TBD" / "TODO" / "implement later" — 없음
- [x] "add appropriate error handling" — 없음
- [x] "Write tests for the above" without test code — 없음 (doc-only plan)
- [x] "Similar to Task N" — 없음 (각 Task 자기완결)

### 3. 타입·이름 일관성

- [x] `BOM_RULE` 추가 컬럼명: `template_id`, `template_instance_id`, `slot_values`, `scope_type`, `estimate_id` — 모든 Task 에서 동일
- [x] `RULE_TEMPLATE` 컬럼: `template_id`, `name`, `description`, `category`, `icon`, `is_builtin`, `scope`, `slots_schema`, `compile_template`, `active` — 용어사전 §13.3 / DE35-1 §6.5.3 / DE32-1 §2.14 일치
- [x] `BOM_RULE_HISTORY` 컬럼: `history_id`, `rule_id`, `operation`, `before_snapshot`, `after_snapshot`, `changed_fields`, `actor`, `actor_role`, `changed_at`, `reason` — 3개 문서 일치
- [x] 빌트인 템플릿 ID: `TPL-REINFORCE-SIZE`, `TPL-CUT-DIRECTION`, `TPL-ITEM-REPLACE-BY-OPT`, `TPL-FORMULA-BY-RANGE`, `TPL-ADD-BY-OPT`, `TPL-DERIVATIVE-DIFF` — 스펙·DE35-1·DE22-1 일치
- [x] API 경로: `POST /api/pm/rules/simulate` / `GET /api/pm/rules/decision-table` — DE11-1 / DE22-1 일치
- [x] 역할명: `ROLE_PM_VIEWER` / `ROLE_PM_EDITOR` / `ROLE_PM_ADMIN` / `ROLE_ESTIMATE` / `ROLE_MES_READER` — 스펙·DE22-1 일치

---

## 실행 옵션

플랜 완료 후 두 가지 실행 방식 중 선택:

### 옵션 1 — Subagent-Driven (권장)
- 각 Task 마다 **fresh subagent** 디스패치
- Task 간 사용자 리뷰 체크포인트
- **REQUIRED SUB-SKILL:** superpowers:subagent-driven-development

### 옵션 2 — Inline 실행
- 현재 세션에서 순차 실행
- 배치 체크포인트
- **REQUIRED SUB-SKILL:** superpowers:executing-plans

어느 방식으로 진행하시겠습니까?
