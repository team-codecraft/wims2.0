---
title: CX1 금지어 및 3계층 네이밍 일관성 검사
doc_id: CX1
version: 1.0
date: 2026-04-15
author: 코드크래프트
basis:
  - "[[WIMS_용어사전_BOM_v1.3]] §7 금지 용어"
  - "[[WIMS_용어사전_BOM_v1.3]] §8 3계층 네이밍 원칙"
scope: 14개 BOM 도메인 설계 문서
status: PASS (조건부 - 미세 위반 1건)
tags:
  - 검증
  - 용어사전
  - BOM
related:
  - "[[WIMS_용어사전_BOM_v1.3]]"
  - "[[V1_내부일관성_검증]]"
  - "[[V3_기존설계문서_영향도]]"
---

> [!abstract] 검사 한 줄 판정
> 14개 문서 전수 검사 결과 **금지 맥락 위반 1건**(DE35-1 §6.5 verb 표 인자 설명), **3계층 네이밍 분열 0건**, **enum 누락/오용 0건**, **UI 라벨 위반 0건**. 6개 문서 PASS, 1개 문서 CONDITIONAL(DE35-1, 단어 1개 치환 권고), AN12-1·DE24-1·DE35-1·DE32-1 은 자체 §7 자가 검증 표를 본문에 내장하여 메타 추적이 가능. v1.3 정합 개정 효과로 잔존 오용 거의 제거됨.

---

## 1. 검사 대상

| # | 문서 | 경로 (상대) |
|---|---|---|
| 1 | DE11-1 v1.2 | `docs/3_DE(설계)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md` |
| 2 | DE22-1 v1.5 (메인) | `docs/3_DE(설계)/DE22-1_화면설계서_v1.5.md` |
| 3 | sec/00 공통원칙 | `DE22-1_화면설계서/sections/00_공통_원칙_레이아웃.md` |
| 4 | sec/01 자재관리 | `DE22-1_화면설계서/sections/01_자재관리.md` |
| 5 | sec/02 거래처·단가 | `DE22-1_화면설계서/sections/02_거래처_단가.md` |
| 6 | sec/03 공정관리 | `DE22-1_화면설계서/sections/03_공정관리.md` |
| 7 | sec/04 제품관리 | `DE22-1_화면설계서/sections/04_제품관리.md` |
| 8 | sec/05 BOM관리 | `DE22-1_화면설계서/sections/05_BOM관리.md` |
| 9 | sec/06 프로젝트관리 | `DE22-1_화면설계서/sections/06_프로젝트관리.md` |
| 10 | sec/07 공통CM | `DE22-1_화면설계서/sections/07_공통CM.md` |
| 11 | DE24-1 v1.8 | `docs/3_DE(설계)/DE24-1_인터페이스설계서_MES_REST_API_v1.8.md` |
| 12 | DE35-1 v1.5 | `docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.5.md` |
| 13 | DE32-1 v1.0 | `docs/3_DE(설계)/DE32-1_BOM도메인_ER다이어그램_v1.0.md` |
| 14 | AN12-1 v1.1 | `docs/2_AN(분석)/AN12-1_요구사항정의서_Phase1_v1.1.md` |

---

## §A 금지어 grep 결과

> 판정 기준: ✅ 허용 (변경이력·자가검증표·"미사용/철회" 메타 서술 또는 백틱 인용) / 🟡 조건부 (일반 한국어 의미로 사용) / 🔴 금지 (DB·도메인·API·설계 본문 실사용)

### A.1 v1.1 시리즈 폐기 엔티티 (`CuttingBOM`, `LayoutType`, `ProductSeries`, `cuttingBomId`)

| 파일:줄 | 맥락 | 판정 |
|---|---|---|
| AN12-1:46, 278, 628~636 | 머리말 §0.5 자가검증 + 변경이력 + §11 금지어 표 | ✅ |
| DE24-1:36, 1217~1226 | 변경이력 + §7 금지어 자가검증 표 (전 항목 ❌ 미등장 명시) | ✅ |
| DE32-1:683 | 부록 체크리스트 "사용 안함" 명시 | ✅ |
| DE35-1:43, 52, 278, 292, 756~764 | 머리말 변경 요지 + §1 변경 노트 + §12 본문 (CuttingBOM 폐기 명시) + §12.1 자가검증 | ✅ |
| DE22-1 v1.5:156, 165 | 변경이력 + 머리말 "금지어 제거" 노트 | ✅ |
| DE11-1:51 | v1.2 변경이력 "(G) 금지어 잔존 제거" | ✅ |

→ **🔴 금지 맥락 0건**. 모든 등장은 변경이력/자가검증/철회 명시.

### A.2 버전축 금지어 (`productVersion`, `configVersion`, `baseMbomVersion`, `sv{N}`, `changedParts`, `appliedOptionValues`)

| 파일:줄 | 맥락 | 판정 |
|---|---|---|
| AN12-1:46, 632~636 | 자가검증 표 | ✅ |
| DE24-1:45, 1221, 1222, 1226 | v1.7 변경이력에 *구명칭* 이탤릭 + 자가검증 표 | ✅ |
| DE32-1:683 | 체크리스트 | ✅ |
| DE35-1:761~764, 774 | 자가검증 표 + v1.4 변경이력 `[구명칭]` 주석 | ✅ |
| DE11-1 (없음) | — | ✅ |

→ **🔴 금지 맥락 0건**.

### A.3 `configId` (외부 API 맥락에서만 금지)

| 파일:줄 | 맥락 | 판정 |
|---|---|---|
| DE22-1/sec/05 BOM관리:464, 470 | mermaid sequenceDiagram FE Store 함수호출 `selectConfig(configId)`, `evaluate(configId)` — **외부 API 가 아닌 FE 내부 변수명** | ✅ |
| DE24-1 (외부 API 본문) | 미등장 | ✅ |

→ §7 정의("외부 API 맥락"에 한정 금지)에 비추어 **위반 0건**. FE 내부 변수명 사용은 §8 도메인 계층 일관성 측면에서도 무해(외부 미노출).

### A.4 `OPT` 단독 약어

| 검색 결과 | 판정 |
|---|---|
| 14개 문서 모두 `OPT-LAY` / `OPT-DIM` / `OPT-DIM-W` / `OPT-CUT` 등 **완전형으로만 등장**. 단독 `OPT` 토큰 발견 0건 | ✅ |

### A.5 `시리즈` (미서기 문맥)

| 파일:줄 | 맥락 | 판정 |
|---|---|---|
| DE22-1/sec/07:166 | "modelCode 세그먼트(브랜드/시리즈/유리타입/리비전)" — **modelCode 세그먼트 명칭**으로 사용. 미서기 문맥 아님 | ✅ |
| DE22-1/sec/04:128, 133 | 제품 등록 화면 modelCode 세그먼트 입력 라벨 — 동일 맥락 | ✅ |
| DE32-1:78 | "계열/시리즈. v1.3 §10" — 두 도메인(미서기/커튼월) 통칭 주석 | ✅ |
| DE24-1:1218 | 자가검증 표 "ProductSeries, 시리즈(미서기 문맥) ❌ 본문 미등장" | ✅ |

→ §7 의 `시리즈` 금지는 "미서기 문맥에서 계열을 가리킬 때" 한정. modelCode 세그먼트·커튼월·통칭 맥락은 허용. **위반 0건**.

### A.6 `formula` / `계산식` / `공식` (BOM 문맥)

| 파일:줄 | 토큰 | 맥락 | 판정 |
|---|---|---|---|
| DE35-1:466 | `formula` | §6.5 BOM_RULE verb 표 ADD 인자 설명 — `item`(itemCode, cutDirection, **formula** 등) | 🔴 **약한 위반** — `cutLengthFormula`/`cutQtyFormula` 가 정확. "산식" 또는 정확한 필드명으로 치환 권고 |
| DE35-1:43, 52, 760, 775 | `계산식`, `공식` | 변경이력 + 자가검증 표 + 변경 노트 | ✅ |
| AN12-1:400, 412 | `공식 4종 동사`, `공식화` | 한국어 일반어("formal/formalize"), BOM 산식 의미 아님 | 🟡 허용 (의미 분리) |
| DE11-1:558, 760 | `공식 실행`, `공식화` | 일반어 | 🟡 허용 |
| DE24-1:1220, 1223 | 자가검증 표 항목 | ✅ |

→ **🔴 1건** (DE35-1:466). 영향도 낮음. AN12-1:46 자가검증 표는 "원본 엑셀 컬럼명 인용"만 허용한다고 명시했으나, 본문에는 그러한 인용도 없음.

### A.7 `dies` / `압출코드`

| 파일:줄 | 맥락 | 판정 |
|---|---|---|
| AN12-1:46, 459, 576, 634 | 자가검증 + FR-PM-023 부재코드/다이스코드 분리 명시 + DIES_BOOK 엔티티명 | ✅ (DIES_BOOK 은 엔티티 명사로 §14 표준어, 금지어 `dies` 단독 약어 아님) |

→ **위반 0건**.

### A.8 `산식구분`, `formula_kind`, `formulaKind`

| 파일:줄 | 맥락 | 판정 |
|---|---|---|
| AN12-1:161, 270 | "(v1.2 `산식구분` 용어 폐기)" — 폐기 메타 서술 | ✅ |
| AN12-1:410 | "`산식구분` / `formula_kind` 등 폐기 용어 입력 차단" — 비즈니스 규칙으로 입력 차단 명시 | ✅ |
| AN12-1:631, DE32-1:683, DE24-1:1220, DE35-1:43, 52, 759 | 자가검증 표·변경이력 | ✅ |
| DE22-1 v1.5:156, 165 | 변경이력 "금지어(산식구분) 전면 제거" | ✅ |

→ **🔴 금지 맥락 0건**. `supplyDivision` 으로 단일화 완료.

### A.9 종합

| 분류 | 히트 총수 | 🔴 금지 맥락 | 🟡 한국어 일반어 | ✅ 허용 |
|---|---|---|---|---|
| 폐기 엔티티 (CuttingBOM·Layout·Series·cuttingBomId) | 약 25건 | 0 | 0 | 25 |
| 버전축 (productVersion 등) | 약 13건 | 0 | 0 | 13 |
| configId | 2건 | 0 | 0 | 2 |
| OPT 단독 | 0건 | 0 | 0 | 0 |
| 시리즈(미서기) | 5건 | 0 | 0 | 5 |
| formula·계산식·공식 | 9건 | **1** | 4 | 4 |
| dies·압출코드 | 4건 | 0 | 0 | 4 |
| 산식구분·formula_kind | 11건 | 0 | 0 | 11 |
| **합계** | **69건** | **1** | **4** | **64** |

---

## §B 3계층 네이밍 매트릭스 (v1.3 §8)

> 표 셀: `D` = DB snake_case 등장, `K` = Kotlin camelCase, `J` = JSON/API key, `P` = OpenAPI PascalCase 컴포넌트, `—` = 미등장. 분열·혼동 발견 시 ⚠️ 표시.

| 필드 | DE11-1 | DE32-1 | DE35-1 | DE24-1 | DE22-1·sec | AN12-1 |
|---|---|---|---|---|---|---|
| cut_direction / cutDirection | D,K | D,K | D,K | K,J,P | K (sec/05) | K |
| cut_length_formula / cutLengthFormula | D | D | D | K (debug=true) | K (sec/05) | K |
| cut_length_formula_2 | — | D | D | K | — | — |
| cut_qty_formula / cutQtyFormula | — | D | D | K | K (sec/05) | K |
| cut_length_evaluated → cutLength (API alias) | D | D | D | D→K(`cutLength`) | K (sec/05) | K |
| cut_length_evaluated_2 → cutLength2 | — | D | D | D→K(`cutLength2`) | — | — |
| cut_qty_evaluated → cutQty | — | D | D | D→K(`cutQty`) | — | — |
| actual_cut_length / actualCutLength | — | D | D | K | — | K |
| supply_division / supplyDivision | D,K | D | D,K | K,J,P | K (sec/05) | K |
| rule_engine_version / ruleEngineVersion | K | K | D | K | — | K |
| series_code / seriesCode | D,K | D | D,K | — | K (sec/04) | K |
| value_type / valueType | D | D | D,K | — | K (sec/05) | K |
| enablement_condition / enablementCondition | D,K | D | D,K | (API 미노출) ✅ 의도대로 | K (sec/05) | K |
| item_category / itemCategory | D,K | D | D | K,J,P | K (sec/05) | K |
| derivative_of / derivativeOf | D,K | D | D | — | K (sec/04) | K |
| derivative_kind / derivativeKind | D,K | D | D | — | K (sec/04) | K |

**판정:**
- 모든 필드가 §8 원칙(`snake_case` ↔ `camelCase` ↔ JSON 키)을 따라 **계층별로 일관된 형태**로 사용됨.
- DE24-1 §11.1 OpenAPI 컴포넌트의 `ItemCategory`/`CutDirection`/`SupplyDivision` PascalCase 는 OpenAPI 스키마 컴포넌트 명명 관례로 §8 위배 아님 (필드명은 모두 camelCase 유지).
- DE24-1 의 응답 alias (`cutLengthEvaluated`→`cutLength`, `cutQtyEvaluated`→`cutQty`) 는 v1.8 §A 변경이력에서 "MES 는 평가 결과값만 필요" 사유로 의도된 외부 노출 단축. ✅ 의도된 계층 분리.
- `enablement_condition` 은 v1.3 §11.2 에 따라 API 미노출 — DE24-1 본문 미등장 확인. ✅ 정합.

→ **3계층 네이밍 분열 0건**.

---

## §C enum 값 일치성

| enum | 정의값 (v1.3) | 문서별 사용 검증 | 판정 |
|---|---|---|---|
| `valueType` | ENUM/NUMERIC/RANGE | DE35-1, DE32-1, DE11-1, AN12-1, DE22-1/sec05 모두 3값 정확 사용. RANGE 는 정의만 있고 본격 사용 0 (정의 미사용은 위반 아님) | ✅ |
| `itemCategory` | PROFILE/GLASS/HARDWARE/CONSUMABLE/SEALANT/SCREEN | DE24-1 §11.1 에 6값 모두 enum 정의 / DE35-1 데이터 샘플에 PROFILE/GLASS/SCREEN/HARDWARE 사용. 누락·신규 추가 없음 | ✅ |
| `supplyDivision` | 공통/외창/내창 | DE32-1, DE35-1, DE24-1, AN12-1 모두 3값. 추가값 없음 | ✅ |
| `derivativeKind` | 1MM/CAP_TO_HIDDEN/TEMPERED/FIRE_43MM | AN12-1:159·351·DE32-1:80·DE35-1:570·DE11-1:340·DE22-1/sec04:250~253 모두 4값 일치. CHECK 제약 일치 | ✅ |
| `cutDirection` | W/H/W1/H1/H2/H3 | DE35-1, DE32-1, DE24-1 모두 6값 정확. v1.3 §12 정의와 일치 | ✅ |
| BOM_RULE verb | SET/REPLACE/ADD/REMOVE | DE35-1 §6.5, DE24-1, DE32-1, DE11-1, AN12-1, DE22-1/sec05 모두 4동사. 미정의 동사(예: UPDATE/MODIFY) 추가 0 | ✅ |
| PRODUCT_CONFIG 상태 | DRAFT/RESOLVED/RELEASED | DE22-1/sec05, DE35-1, DE24-1 모두 일치 | ✅ |
| RESOLVED_BOM 상태 | DRAFT/RELEASED/DEPRECATED | DE24-1 (§7.1 HTTP 410 + DEPRECATED 에러), DE35-1, DE11-1 일치 | ✅ |
| frozen 트리거 | T1/T2/T3 | DE11-1:50, DE35-1:773, DE24-1 본문 일치 | ✅ |

→ **enum 누락/오용 0건**.

---

## §D UI 라벨 매핑 검수 (DE22-1 계열)

> 기준: v1.3 §2 + 메모리 `project_ui_terminology` 확정 매핑

| 영문 표준 | 한국어 UI 라벨 | sections 등장 | 위반 |
|---|---|---|---|
| EBOM | 자재 구성 / 자재구성 | sec/01:1, sec/05 다수 | 0 |
| MBOM | 공정 구성 / 공정구성 | sec/03:1, sec/05 다수 | 0 |
| Config (PRODUCT_CONFIG) | 옵션 구성 / 옵션구성 | sec/05 다수, sec/04:17 | 0 |
| BOM Rule | 옵션별 규칙 / 옵션별규칙 | sec/05 다수, sec/04:11 (R1·R2 카탈로그) | 0 |
| Resolved BOM | 확정 구성표 / 확정구성표 | sec/05 다수, sec/04:11 | 0 |
| supplyDivision | 공급 구분 | sec/05 데이터 컬럼 라벨 | 0 |
| cutDirection | 절단 방향 | sec/05 | 0 |
| cutLength / actualCutLength | 절단 길이 / 실제 절단길이 | sec/05 | 0 |
| itemCategory | 자재 분류 | sec/01·05 | 0 |

- "EBOM"·"MBOM"·"Resolved BOM" 영문 약어 단독 사용 사례는 sec/05 변경이력·기술 노트의 **표준 영문 식별자** 맥락에 한정. UI 라벨 영역(SCR 화면 설계 본문)에서는 한국어 라벨을 일관 사용.
- sec/05 BOM관리에서 일부 sequenceDiagram·기술 다이어그램에는 영문 식별자 그대로 (예: `Resolved BOM`, `RESOLVED_BOM`) — 메시지·DB명 인용 맥락이라 위반 아님.

→ **UI 라벨 위반 0건**.

---

## §E 결론: 문서별 판정

| 문서 | 금지어 위반 | 네이밍 분열 | enum 오용 | UI 라벨 위반 | 판정 |
|---|---|---|---|---|---|
| DE11-1 v1.2 | 0 | 0 | 0 | n/a | ✅ PASS |
| DE22-1 v1.5 (메인) | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/00 공통원칙 | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/01 자재관리 | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/02 거래처·단가 | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/03 공정관리 | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/04 제품관리 | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/05 BOM관리 | 0 (configId FE 내부 변수는 §7 외 영역) | 0 | 0 | 0 | ✅ PASS |
| sec/06 프로젝트관리 | 0 | 0 | 0 | 0 | ✅ PASS |
| sec/07 공통CM | 0 | 0 | 0 | 0 | ✅ PASS |
| DE24-1 v1.8 | 0 | 0 | 0 | n/a | ✅ PASS |
| DE35-1 v1.5 | **1** (§6.5:466 `formula 등`) | 0 | 0 | n/a | 🟡 CONDITIONAL |
| DE32-1 v1.0 | 0 | 0 | 0 | n/a | ✅ PASS |
| AN12-1 v1.1 | 0 | 0 | 0 | n/a | ✅ PASS |

### 수정 필요 항목

1. **DE35-1 §6.5 line 466** — verb 표 `ADD` 행의 인자 설명
   - 현재: `` `item`(itemCode, cutDirection, formula 등) ``
   - 권고: `` `item`(itemCode, cutDirection, cutLengthFormula, cutQtyFormula, supplyDivision …) ``
   - 사유: v1.3 §13.2 BOM_RULE.ADD 예시(line 367~376)와 일치, 금지어 `formula` 단독 노출 제거.

### 자가검증 표 강점

- AN12-1 §11, DE24-1 §10 부근, DE32-1 부록, DE35-1 §12.1 — 4개 문서가 **본문에 §7 금지어 자가검증 표를 내장**. 향후 신규 개정 시 자가 회귀 검사가 용이.
- DE22-1 v1.5 메인 머리말 §"금지어 제거" 노트도 동일 효과.
- 권고: 향후 개정에서도 이 자가검증 표를 유지·갱신할 것.

### 잔여 권고

- **`enablement_condition` API 미노출** 정책은 DE24-1 v1.8 본문에서 명시적으로 표기되어 있지 않음 (자가검증 표에도 누락). 차기 v1.9 에서 §6.1 DTO 명세에 "PRODUCT_CONFIG 도메인에서만 사용, MES 응답 미노출" 명시 권고.
- DE22-1/sec/05 mermaid 의 `selectConfig(configId)`·`evaluate(configId)` 는 FE 내부 변수명이지만, 가독성을 위해 `configKey` 또는 `productConfigId` 로 통일하면 sec/04 와 일관성 향상 (필수 아님, 권고).

---

## §F 5줄 요약

1. 14개 문서 전수 검사 결과 v1.3 §7 금지어 **금지 맥락 위반은 단 1건**(DE35-1 §6.5 verb 표의 `formula 등` 표기).
2. 모든 문서가 v1.3 §8 3계층 네이밍 원칙(snake/camel/JSON·PascalCase 컴포넌트)을 일관되게 따름 — **분열 0건**.
3. valueType·itemCategory·supplyDivision·derivativeKind·cutDirection·BOM_RULE verb·상태 enum 등 9개 enum 모두 정의값과 정확히 일치 — **누락/추가 0건**.
4. DE22-1 화면설계서 8개 sections 의 UI 라벨(자재구성/공정구성/옵션구성/옵션별규칙/확정구성표 등)이 메모리 `project_ui_terminology` 매핑과 100% 부합 — **위반 0건**.
5. AN12-1·DE24-1·DE32-1·DE35-1 4개 문서가 본문에 §7 금지어 자가검증 표를 내장하여 회귀 검사가 자동화되어 있음 — 차기 개정에서도 유지 권고.
