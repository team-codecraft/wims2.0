---
title: WIMS 2.0 BOM 도메인 용어사전 v1.3
created: 2026-04-14
updated: 2026-04-16
type: 지침
status: review
supersedes: "[[WIMS_용어사전_BOM_v1.2]]"
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
---

# WIMS 2.0 BOM 도메인 용어사전 v1.3

> [!abstract] 요약
> v1.2 배포 후 V1~V6 검증 Blocker/P0 반영 긴급 개정. 표기 충돌 시 본 문서 우선.

## 1. 식별자

| 표준명 | DB | 도메인 | API | 정의 |
|---|---|---|---|---|
| standardBomId | `standard_bom_id` | `String` | `standardBomId` | 제품·구성 조합 영속 식별자. 버전 불변 |
| standardBomVersion | `standard_bom_version` | `Int` | `standardBomVersion` | EBOM+MBOM+Config 묶음 단일 버전. 셋 중 하나 변경 시 +1 |
| resolvedBomId | — | `String` | `resolvedBomId` | `RBOM-{standardBomId}-sbv{N}-{optionsHash}` 결정적 생성 |
| resolvedBomKey | `resolved_bom_key` (UNIQUE) | `String` | (내부) | resolvedBomId natural key |
| (RESOLVED_BOM PK) | `resolved_bom_id` (surrogate) | — | — | DB 내부 surrogate PK |
| itemCode | `item_code` | `String` | `itemCode` | 자재·공정·조립체 유일 코드. 접두: PRD/ASY/FRM/GLS/HDW/SEL/SCR/MAT |
| itemId | `item_id` | `Long` | — | ITEM surrogate PK |
| itemCategory | `ITEM.item_category` | `ItemCategory` | `itemCategory` | enum: `PROFILE` \| `GLASS` \| `HARDWARE` \| `CONSUMABLE` \| `SEALANT` \| `SCREEN`. Resolved 로직 분기 키 |
| processCode | `process_code` | `String` | `processCode` | 공정 코드. `PRC-{유형}-{순번}` |
| locationCode | `location_code` | `String` | `location_code` | 위치 인스턴스 코드. 예: H01, W01 |
| variantCode | `variant_code` | `String` | (내부) | 위치 인스턴스 품번 |
| configCode | `config_code` | `String` | (내부) | 옵션구성 자연 식별자. 외부 API 에서는 resolvedBomId 대체 |
| configId | `config_id` | `Long` | — | PRODUCT_CONFIG surrogate PK (내부 전용) |
| seriesCode | `PRODUCT.series_code` | `String` | `seriesCode` | 예: `160-우수`, `225-마스`, `CW-135-MAS-2P`. 별도 엔티티 아님 |

## 2. BOM 구성요소

| 표준명 | 엔티티 | UI 표기 | 정의 |
|---|---|---|---|
| 표준BOM | — | — | EBOM + MBOM + Config 불가분 묶음. 단일 standardBomVersion |
| Base BOM | — | — | 옵션 해석 전 원본 마스터 BOM |
| EBOM | `EBOM` | 자재구성 | Engineering BOM. 기능 단위 분해 |
| MBOM | `MBOM` | 공정구성 | Manufacturing BOM. 공정 단위 분해. MES 조회 대상 |
| Config | `PRODUCT_CONFIG` | 옵션구성 | 선택된 옵션 조합 레코드. DRAFT→RESOLVED→RELEASED |
| BOM Rule | `BOM_RULE` | 옵션별규칙 | 옵션값 조합에 따른 BOM 변형 규칙. action 에 산식 허용 (§13) |
| Resolved BOM | `RESOLVED_BOM` | 확정구성표 | Base MBOM + Rule 적용 최종 확정. frozen 후 불변. MES 전용 |
| 기능군 | — | — | EBOM L1: 구조부(E-STR), 유리부(E-GLZ), 개폐부(E-HDW), 밀봉부(E-SEL), 방충부(E-SCR) |
| OPTION_GROUP | `OPTION_GROUP` | — | 옵션 카테고리. OPT-LAY/OPT-CUT/OPT-GLZ/OPT-MAT/OPT-FIN/OPT-ACC/OPT-DIM |
| OPTION_VALUE | `OPTION_VALUE` | — | OPTION_GROUP 선택값. `valueType` 으로 ENUM/NUMERIC 구분 (§11) |

## 3. MBOM 속성

| 표준명 | DB | 정의 |
|---|---|---|
| isPhantom | `is_phantom` | 재고 미보유 가상 노드. Phantom Explosion 대상 |
| lossRate | `loss_rate` | 손실 비율 0.0~1.0 |
| theoreticalQty | `qty` | 이론 소요량 (로스 미반영) |
| actualQty | `actual_qty` | 실소요량 = theoreticalQty × (1 + lossRate) |
| workOrder | `work_order` | 조립 순서 정수 (오름차순) |
| workCenter | `work_center` | MES 작업장 코드. 예: WC-FRAME |
| bomType | — | Resolved 응답 구분자. 고정: `"RESOLVED_MBOM"` |
| cutDirection | `cut_direction` | 절단 방향. enum: `W`\|`H`\|`W1`\|`H1`\|`H2`\|`H3`. null=비절단 |
| cutLengthFormula | `cut_length_formula` | 1차 절단 길이 산식. 예: `W - 94` |
| cutLengthFormula2 | `cut_length_formula_2` | 2차 절단 길이 산식 (유리 세로 등 2차원 자재) |
| cutQtyFormula | `cut_qty_formula` | 절단 개수 산식. 예: `IIF(H>=900, 2, 0)` |
| cutLengthEvaluated | `cut_length_evaluated` | RuleEngine 평가 결과 snapshot(mm). frozen 후 불변 |
| cutLengthEvaluated2 | `cut_length_evaluated_2` | 2차 길이 평가 결과 |
| cutQtyEvaluated | `cut_qty_evaluated` | 수량 평가 결과 snapshot |
| supplyDivision | `supply_division` | `공통`\|`외창`\|`내창`. null=공통 |

### 3.1 lossRate 적용 공식

- **개수 기반** (`HARDWARE`/`CONSUMABLE`/`SCREEN`): `actualQty = theoreticalQty × (1 + lossRate)`
- **길이 기반** (`PROFILE`/`SEALANT`): `actualCutLength = cutLengthEvaluated × (1 + lossRate)`, 개수는 그대로
- **2차원** (`GLASS`): 각 축 독립 적용

## 4. 버전·스냅샷

| 표준명 | DB | 정의 |
|---|---|---|
| frozen | `frozen` | 불변 여부. 트리거: T1(견적 CONFIRMED) / T2(작업지시 RELEASED) / T3(PM 확정 버튼) |
| frozenAt | `frozen_at` | frozen TRUE 전환 일시 (ISO 8601) |
| changedComponents | `changed_components` (JSON) | 변경 구성요소. enum: `EBOM`\|`MBOM`\|`Config` |
| appliedOptions | — (API) | 적용 옵션 원본 JSON. NUMERIC 포함 |
| appliedOptionsHash | — (API) | SHA-256 앞 8자. **NUMERIC 옵션은 해시에서 제외** — ENUM 만으로 계산. 무옵션은 `"default"` |
| ruleEngineVersion | `rule_engine_version` | Resolved 생성 엔진 버전. 예: `UNIQUE_V1` |

**optionsHash 산출:** `SHA-256(JSON.canonical({ENUM 옵션만})).substring(0, 8)` — NUMERIC 제외로 카디널리티 폭발 방지.

**lazy 생성:** DRAFT 단계에서 RESOLVED_BOM row 미생성. T1/T2 트리거 시점에만 INSERT.

**frozen 불변 필드:** `cut_length_evaluated`, `cut_length_evaluated_2`, `cut_qty_evaluated`, `actual_qty`, `actual_cut_length`, `rule_engine_version`

**상태값:** `DRAFT` → `RELEASED` → `DEPRECATED`

## 5. 매핑·위치

| 표준명 | 엔티티 | 정의 |
|---|---|---|
| EBOM_MBOM_MAP | `EBOM_MBOM_MAP` | EBOM↔MBOM 다대다 매핑. mappingType: `1:1`\|`1:N`\|`N:1` |
| BOM_ITEM_LOCATION | `BOM_ITEM_LOCATION` | 자재 마스터 ↔ 위치 인스턴스 품번 매핑 |
| Phantom Explosion | — | `is_phantom=TRUE` 노드 건너뛰고 하위 자재 직접 전개 |

## 6. 외부 API (MES)

| 엔드포인트 | 용도 |
|---|---|
| `GET /api/external/v1/bom/resolved/{resolvedBomId}` | MES 생산 작업지시용. 절단 속성 포함 |
| `GET /api/external/v1/bom/standard/{standardBomId}` | 표준BOM 마스터 조회 |
| `GET …/{standardBomId}/versions` | 버전 이력 |
| `GET …/{standardBomId}/versions/{standardBomVersion}` | 특정 버전 상세 |

MES 권한: `ROLE_MES_READER` — GET 전용, 외부 경로만

## 7. 금지 용어

| 금지어 | 대체 | 사유 |
|---|---|---|
| `productVersion`, `configVersion`, `baseMbomVersion` | `standardBomVersion` | 독립 버전축 폐기 |
| `configId` (외부 API) | `standardBomId` / `resolvedBomId` | 내부 surrogate 전용 |
| `changedParts` | `changedComponents` | 필드명 통일 |
| `sv{N}` | `sbv{N}` | prefix 통일 |
| `appliedOptionValues` | `appliedOptions` + `appliedOptionsHash` | 원본/해시 분리 |
| `OPT` (단독) | `OPT-{카테고리}` | 완전형 강제 |
| `시리즈` (미서기 문맥) | `계열` | 미서기=계열, 커튼월=시리즈 |
| `formula`, `계산식`, `공식` | `산식` | 원본 표기 일치 |
| `dies`, `압출코드` | `부재코드` / `다이스코드` | 혼용 방지 |
| `CuttingBOM`, `CUTTING_BOM` | MBOM + 절단 속성(§3) | v1.1 철회 |
| `LayoutType`, `LAYOUT_TYPE` | `OPT-LAY` 옵션값 | v1.1 철회 |
| `ProductSeries`, `PRODUCT_SERIES` | `PRODUCT.series_code` | v1.1 철회 |
| `cuttingBomId`, `cuttingBomKey` | — | v1.1 철회 |
| `산식구분`, `formula_kind`, `formulaKind` | `supplyDivision` | v1.3 단일화 |

## 8. 3계층 네이밍 원칙

**DB:** `snake_case` / **도메인:** `camelCase` (Kotlin) / **API:** JSON 키 (`@JsonProperty`)

대표 사례: `option_snapshot` → `optionSnapshot` → `appliedOptions`+`appliedOptionsHash`

## 9. 제품 분류

4축 계층: 대분류(미서기/커튼월) → 계약구분(마스/우수) → 유리사양(삼중/복층) → 치수크기

| 표준명 | 정의 |
|---|---|
| productClassPath | L1~L4 연결 경로. 예: `미서기/마스/복층/225` |
| modelCode | 제품 PK. 예: `DHS-AE225-D-1` |

`PRODUCT` 에 `class_l1~l4` 컬럼. 별도 분류 엔티티 불필요.

## 10. 계열·시리즈

`PRODUCT.series_code` 단일 컬럼. 미서기=계열(`160-우수`), 커튼월=시리즈(`CW-135-MAS-2P`).

## 11. 창호 레이아웃 · 수치형 옵션

레이아웃은 `OPTION_VALUE` (group=`OPT-LAY`). 예: `W2XH1-정`, `W3XH2-3편`

### 수치형 옵션

| 표준명 | DB | 정의 |
|---|---|---|
| valueType | `OPTION_VALUE.value_type` | `ENUM`\|`NUMERIC`\|`RANGE`. 기본 ENUM |
| numericMin/Max/unit | `numeric_min/max/unit` | NUMERIC 일 때만. 예: W 300~3000 mm |
| OPT-DIM | `OPTION_GROUP` | 치수 입력 전용. 자식: OPT-DIM-W/H/W1/H1/H2/H3 (모두 NUMERIC) |
| enablementCondition | `OPTION_VALUE.enablement_condition` | 선택 가능 조건식. null=항상 활성. 예: `OPT-LAY IN ('W1XH1-3편', …)` |

## 12. 절단 표현

MBOM 속성 확장(§3)으로 표현. 별도 `CUTTING_BOM` 엔티티 없음.

## 13. 산식·BOM_RULE

### 산식 언어 UNIQUE_V1

- **변수:** `W`, `H`, `W1`, `H1`, `H2`, `H3` (NUMERIC 옵션), `OPT-*` 키 (ENUM 비교)
- **함수:** `IIF(조건, 참값, 거짓값)`
- **연산자:** `+`, `-`, `*`, `/`, `%`, 비교, `AND`/`OR`/`NOT`, 괄호

### BOM_RULE action 동사 (4종)

| verb | 의미 | 필수 인자 |
|---|---|---|
| `SET` | MBOM 속성값 할당 | `target`, `field`, `value` |
| `REPLACE` | itemCode 치환 | `target`, `from`, `to` |
| `ADD` | MBOM 신규 행 삽입 | `item` (itemCode, cutDirection, …) |
| `REMOVE` | MBOM 행 제거 | `target` |

`target` 선택자: `{itemCode, cutDirection?, supplyDivision?}` 부분 일치.

### 평가 시점

- DRAFT→RESOLVED 전환 시 평가. DRAFT 중 프리뷰는 evaluate-only (저장 없음).
- `BOM_RULE` 인덱스: `(series_code, rule_type, active)` + `(product_class_path)`. AST 사전 파싱 캐시.

## 14. 다이스북·공급망

| 표준명 | DB | 정의 |
|---|---|---|
| DiesBook | `DIES_BOOK` | 알루미늄 압출 금형 카탈로그. 개정판 관리 |
| 다이스코드 | `ITEM.dies_code` | 금형 식별자. itemCode 와 구분 |
| DiesSupplier | `DIES_SUPPLIER` | 금형사. role: `EXTRUSION`/`INSULATION`/`HARDWARE` |
| ItemSupplier | `ITEM_SUPPLIER` | 자재↔공급사 다대다 매핑 |
| unitWeight | `ITEM.unit_weight_kg_m` | 프로파일 단위중량(kg/m) |

## 15. 모델코드 디코딩

| 세그먼트 | 값 | 의미 |
|---|---|---|
| Brand | `DHS`/`UNI`/`U-P` | 브랜드·계약 |
| ProductType | `AE`/`SM`/`CW` | 미서기/시스템미서기/커튼월 |
| Size | `225`/`160`/`CW135` | 프로파일 폭(mm) |
| HiddenBar | `H`/생략 | 히든바 유무 |
| GlassLayer | `2`/`3` | 유리 겹수 |
| Derivative | `-1`/`-S`/`-SS` | 파생 순번 |

## 16. 기본제품·파생제품

| 표준명 | 정의 |
|---|---|
| 기본제품 (BaseProduct) | 한 치수 라인의 대표 제품 |
| 파생제품 (DerivativeProduct) | 기본제품 변형. 1 기본 ↔ 최대 6 파생 |
| derivativeOf | `PRODUCT.derivative_of` (FK). 파생→기본 참조 |
| derivativeKind | `1MM`/`CAP_TO_HIDDEN`/`TEMPERED`/`FIRE_43MM` |

파생제품은 별개 PRODUCT 행이나 BOM 은 기본제품 것을 참조, 차이만 BOM_RULE 표현.

---

## 변경 이력

| 버전 | 일자 | 변경 |
|---|---|---|
| v1.0 | 2026-04-14 | 초안 |
| v1.1 | 2026-04-15 | §9~§16 신규. CuttingBOM·ProductSeries·LayoutType 엔티티 추가 |
| v1.2 | 2026-04-16 | v1.1 엔티티 철회. MBOM 속성 확장·OPT-LAY·PRODUCT 속성 흡수 |
| v1.3 | 2026-04-16 | V1~V6 검증 Blocker/P0 반영. snapshot 필드, NUMERIC 해시 제외, enablement_condition, action 동사 스키마, itemCategory 등 |
