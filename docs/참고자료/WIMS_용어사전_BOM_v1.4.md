---
title: WIMS 2.0 BOM 도메인 용어사전 v1.4
created: 2026-04-14
updated: 2026-04-24
type: 지침
status: review
tags:
  - wims
  - bom
  - 용어사전
  - 표준
related:
  - "[[DE35-1_미서기이중창_표준BOM구조_정의서_v1.6]]"
  - "[[DE11-1_소프트웨어_아키텍처_설계서_v1.2]]"
  - "[[DE32-1_BOM도메인_ER다이어그램_v1.2]]"
  - "[[DE24-1_인터페이스설계서_v2.0]]"
  - "[[AN12-1_요구사항정의서_Phase1_v1.1]]"
---

# WIMS 2.0 BOM 도메인 용어사전 v1.4

> [!info] 문서 성격
> 본 문서는 **용어 정의만** 수록한다. 정책·프로세스·산식·수용기준·평가 순서 등은 요구사항(`AN12-1`) 및 설계(`DE11-1`/`DE35-1`/`DE32-1`/`DE24-1`) 문서에서 다룬다. 본 용어사전은 비대화를 금하며, 확장 시 도메인(BOM / 견적 / 현장실측 / 공통) 별로 분할한다.
>
> **내용 선택 규칙:** 표준 용어명, DB/도메인/API 매핑, 1줄 정의, enum 값 목록, 금지어·대체어. 그 외는 설계 문서로 이관.
>
> 표기 충돌 시 본 문서 우선.

## 1. 식별자

| 표준명 | DB | 도메인 | API | 정의 |
|---|---|---|---|---|
| standardBomId | `standard_bom_id` | `String` | `standardBomId` | 제품·구성 조합 영속 식별자. 버전 불변 |
| standardBomVersion | `standard_bom_version` | `Int` | `standardBomVersion` | EBOM+MBOM+Config+BOM_RULE 묶음 단일 버전 |
| resolvedBomId | — | `String` | `resolvedBomId` | `RBOM-{standardBomId}-sbv{N}-{optionsHash}` 결정적 생성 |
| resolvedBomKey | `resolved_bom_key` (UNIQUE) | `String` | (내부) | resolvedBomId natural key |
| (RESOLVED_BOM PK) | `resolved_bom_id` (surrogate) | — | — | DB 내부 surrogate PK |
| itemCode | `item_code` | `String` | `itemCode` | 자재·공정·조립체 유일 코드. 접두: PRD/ASY/FRM/GLS/HDW/SEL/SCR/MAT |
| itemId | `item_id` | `Long` | — | ITEM surrogate PK |
| itemCategory | `ITEM.item_category` | `ItemCategory` | `itemCategory` | enum: `PROFILE` \| `GLASS` \| `HARDWARE` \| `CONSUMABLE` \| `SEALANT` \| `SCREEN` |
| processCode | `process_code` | `String` | `processCode` | 공정 코드. `PRC-{유형}-{순번}` |
| locationCode | `location_code` | `String` | `location_code` | 위치 인스턴스 코드. 예: H01, W01 |
| variantCode | `variant_code` | `String` | (내부) | 위치 인스턴스 품번 |
| configCode | `config_code` | `String` | (내부) | 옵션구성 자연 식별자 |
| configId | `config_id` | `Long` | — | PRODUCT_CONFIG surrogate PK (내부 전용) |
| seriesCode | `PRODUCT.series_code` | `String` | `seriesCode` | 예: `160-우수`, `CW-135-MAS-2P`. 별도 엔티티 아님 |

## 2. BOM 구성요소

| 표준명 | 엔티티 | UI 표기 | 정의 |
|---|---|---|---|
| 표준BOM | — | — | EBOM + MBOM + Config + BOM_RULE 불가분 묶음 (상세: DE35-1 §6.5) |
| Base BOM | — | — | 옵션 해석 전 원본 마스터 BOM |
| EBOM | `EBOM` | 자재구성 | Engineering BOM. 기능 단위 분해 |
| MBOM | `MBOM` | 공정구성 | Manufacturing BOM. 공정 단위 분해. MES 조회 대상 |
| Config | `PRODUCT_CONFIG` | 옵션구성 | 선택된 옵션 조합 레코드 |
| BOM Rule | `BOM_RULE` | 옵션별규칙 | 옵션값 조합에 따른 BOM 변형 규칙 (상세: DE35-1 §6.5, DE11-1 §11) |
| Resolved BOM | `RESOLVED_BOM` | 확정구성표 | Base MBOM + Rule 적용 결과. MES 전용 |
| 기능군 | — | — | EBOM L1: 구조부(E-STR), 유리부(E-GLZ), 개폐부(E-HDW), 밀봉부(E-SEL), 방충부(E-SCR) |
| OPTION_GROUP | `OPTION_GROUP` | — | 옵션 카테고리. OPT-LAY/OPT-CUT/OPT-GLZ/OPT-MAT/OPT-FIN/OPT-ACC/OPT-DIM |
| OPTION_VALUE | `OPTION_VALUE` | — | OPTION_GROUP 선택값. `valueType` 으로 ENUM/NUMERIC 구분 |
| RULE_TEMPLATE | `RULE_TEMPLATE` | — | 옵션별규칙 템플릿. 슬롯 기반 편집 양식 (상세: DE35-1 §6.5, BOM-RULE-UI 스펙) |
| BOM_RULE_HISTORY | `BOM_RULE_HISTORY` | — | 규칙 변경 감사 레코드 |

### 2.1 BOM Level 5단 (L1~L5)

유니크시스템 BOM 2026-04-24 보완본 `Sheet1` 기준 공식 Level 체계.

| Level | 표준명 | SAP 대응 | 정의 | 예 |
|---|---|---|---|---|
| L1 | 완제품 | FERT | 출고 가능한 최종 제품 | 창호 225AL 미서기 2연동 |
| L2 | 반제품 / 모듈 | HALB | 제품을 구성하는 큰 단위 조립품 | 프레임 ASSY · 문짝 ASSY · 방충망 ASSY |
| L3 | 서브조립 | — | 조립 단위 구성품 | 레일 · 가이드 · 롤러SET |
| L4 | 부품 | — | 부착/조립되는 개별 부자재 | 크리센트 · 롤러 · 브라켓 · 모헤어 |
| L5 | 원자재 | ROH | 절단·가공 전 상태 자재 | 프로파일 압출재 · 유리 원판 · 방충망 프레임 프로파일 |

## 3. MBOM 속성

| 표준명 | DB | 정의 |
|---|---|---|
| isPhantom | `is_phantom` | 재고 미보유 가상 노드 |
| lossRate | `loss_rate` | 손실 비율 0.0~1.0 (적용 공식: DE35-1 §lossRate) |
| theoreticalQty | `qty` | 이론 소요량 |
| actualQty | `actual_qty` | 실소요량 |
| workOrder | `work_order` | 조립 순서 정수 |
| workCenter | `work_center` | MES 작업장 코드 |
| bomType | — | Resolved 응답 구분자. 고정: `"RESOLVED_MBOM"` |
| cutDirection | `cut_direction` | 절단 방향 enum: `W`\|`H`\|`W1`\|`H1`\|`H2`\|`H3`. null=비절단 |
| cutLengthFormula | `cut_length_formula` | 1차 절단 길이 산식 |
| cutLengthFormula2 | `cut_length_formula_2` | 2차 절단 길이 산식 |
| cutQtyFormula | `cut_qty_formula` | 절단 개수 산식 |
| cutLengthEvaluated | `cut_length_evaluated` | 1차 길이 평가 스냅샷 (mm) |
| cutLengthEvaluated2 | `cut_length_evaluated_2` | 2차 길이 평가 스냅샷 |
| cutQtyEvaluated | `cut_qty_evaluated` | 수량 평가 스냅샷 |
| actualCutLength | `actual_cut_length` | 실절단 길이 평가 스냅샷 |
| supplyDivision | `supply_division` | enum: `공통`\|`외창`\|`내창`. null=공통 |

## 4. 버전·스냅샷

| 표준명 | DB | 정의 |
|---|---|---|
| frozen | `frozen` | 불변 여부 (전환 트리거·불변 필드 목록: DE35-1 §frozen) |
| frozenAt | `frozen_at` | frozen TRUE 전환 일시 (ISO 8601) |
| changedComponents | `changed_components` (JSON) | 변경 구성요소. enum: `EBOM`\|`MBOM`\|`Config`\|`BOM_RULE` |
| appliedOptions | — (API) | 적용 옵션 원본 JSON |
| appliedOptionsHash | — (API) | SHA-256 앞 8자. NUMERIC 제외 ENUM 만 (계산식: DE11-1 §11) |
| ruleEngineVersion | `rule_engine_version` | Resolved 생성 엔진 버전. 예: `UNIQUE_V1` |
| status (Config) | `status` | `DRAFT` \| `RELEASED` \| `DEPRECATED` |

## 5. 매핑·위치

| 표준명 | 엔티티 | 정의 |
|---|---|---|
| EBOM_MBOM_MAP | `EBOM_MBOM_MAP` | EBOM↔MBOM 다대다 매핑. mappingType: `1:1`\|`1:N`\|`N:1` |
| BOM_ITEM_LOCATION | `BOM_ITEM_LOCATION` | 자재 마스터 ↔ 위치 인스턴스 품번 매핑 |
| Phantom Explosion | — | `is_phantom=TRUE` 노드 건너뛰고 하위 자재 직접 전개 |

### 5.1 locationCode 카탈로그 (10종)

H 계열(수평) 7종 + W 계열(수직) 3종.

| 코드 | 축 | 정의 |
|---|---|---|
| H01 | 수평 | 수평 위치 1 |
| H02 | 수평 | 수평 위치 2 |
| H02-1 | 수평 | H02 분할 1 (sub-position) |
| H02-2 | 수평 | H02 분할 2 (sub-position) |
| H03 | 수평 | 수평 위치 3 |
| H03-1 | 수평 | H03 분할 1 (sub-position) |
| H03-2 | 수평 | H03 분할 2 (sub-position) |
| W01 | 수직 | 수직 위치 1 |
| W02 | 수직 | 수직 위치 2 |
| W03 | 수직 | 수직 위치 3 |

접미사 `-1`, `-2` = 동일 위치 내 분할(sub-position). 예: 중중연창(2x2)에서 H03을 좌/우로 분할 시 H03-1·H03-2.

품목별 사용 패턴: 후렘 10종 전체, 문짝 H01~H03·W01~W03, 방충망 H01·W01.

## 6. 외부 API (MES) 엔드포인트

| 엔드포인트 | 용도 |
|---|---|
| `GET /api/external/v1/bom/resolved/{resolvedBomId}` | MES 생산 작업지시용 |
| `GET /api/external/v1/bom/standard/{standardBomId}` | 표준BOM 마스터 조회 |
| `GET …/{standardBomId}/versions` | 버전 이력 |
| `GET …/{standardBomId}/versions/{standardBomVersion}` | 특정 버전 상세 |

권한: `ROLE_MES_READER`. 상세 스펙·DTO·에러·쿼리 파라미터: DE24-1 v1.8.

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
| `CuttingBOM`, `CUTTING_BOM`, `cuttingBomId`, `cuttingBomKey` | MBOM + 절단 속성 | v1.1 철회 |
| `LayoutType`, `LAYOUT_TYPE` | `OPT-LAY` 옵션값 | v1.1 철회 |
| `ProductSeries`, `PRODUCT_SERIES` | `PRODUCT.series_code` | v1.1 철회 |
| `산식구분`, `formula_kind`, `formulaKind` | `supplyDivision` | v1.3 단일화 |
| `QTY_CHANGE`, `LOSS_CHANGE` (저장 모델) | `SET` (action 동사) | 저장·평가 동사는 4종만 (§13.2) |

## 8. 3계층 네이밍 원칙

**DB:** `snake_case` / **도메인:** `camelCase` (Kotlin) / **API:** JSON 키 (`@JsonProperty`)

예: `option_snapshot` → `optionSnapshot` → `appliedOptions` + `appliedOptionsHash`

## 9. 제품 분류

4축 계층: 대분류(미서기/커튼월) → 계약구분(마스/우수) → 유리사양(삼중/복층) → 치수크기

| 표준명 | 정의 |
|---|---|
| productClassPath | L1~L4 연결 경로. 예: `미서기/마스/복층/225` |
| modelCode | 제품 PK. 예: `DHS-AE225-D-1` |

`PRODUCT.class_l1~l4` 컬럼 4개. 별도 분류 엔티티 없음.

## 10. 계열·시리즈

`PRODUCT.series_code` 단일 컬럼. 미서기=계열(`160-우수`), 커튼월=시리즈(`CW-135-MAS-2P`).

## 11. 창호 레이아웃 · 수치형 옵션

| 표준명 | DB | 정의 |
|---|---|---|
| OPT-LAY | `OPTION_GROUP` | 레이아웃 옵션 그룹. 예: `W2XH1-정`, `W3XH2-3편` |
| valueType | `OPTION_VALUE.value_type` | `ENUM` \| `NUMERIC` \| `RANGE`. 기본 ENUM |
| numericMin/Max/unit | `numeric_min/max/unit` | NUMERIC 일 때 유효범위·단위 |
| OPT-DIM | `OPTION_GROUP` | 치수 입력 전용. 자식: OPT-DIM-W/H/W1/H1/H2/H3 (모두 NUMERIC) |
| enablementCondition | `OPTION_VALUE.enablement_condition` | 선택 가능 조건식. null=항상 활성 |

## 12. 절단 표현

MBOM 속성(§3 cutDirection/cutLengthFormula/…)으로 표현. 별도 `CUTTING_BOM` 엔티티 없음.

## 13. 산식·BOM_RULE

### 13.1 산식 언어

| 표준명 | 정의 |
|---|---|
| UNIQUE_V1 | RuleEngine 산식 언어 식별자. 변수·함수·연산자·평가 규칙 상세: DE11-1 §11 |

### 13.2 BOM_RULE action 동사 (4종)

| verb | 의미 | 필수 인자 |
|---|---|---|
| `SET` | MBOM 속성값 할당 | `target`, `field`, `value` |
| `REPLACE` | itemCode 치환 | `target`, `from`, `to` |
| `ADD` | MBOM 신규 행 삽입 | `item` (itemCode, cutDirection, …) |
| `REMOVE` | MBOM 행 제거 | `target` |

`target` 선택자: `{itemCode, cutDirection?, supplyDivision?}` 부분 일치. 우선순위·충돌 처리·평가 순서: DE35-1 §6.5 / DE11-1 §11.

### 13.3 RULE_TEMPLATE 컬럼

| 표준명 | DB | 정의 |
|---|---|---|
| templateId | `RULE_TEMPLATE.template_id` (PK) | 템플릿 유일 식별자. 예: `TPL-REINFORCE-SIZE` |
| slotsSchema | `RULE_TEMPLATE.slots_schema` (JSON) | 슬롯 정의 배열 |
| compileTemplate | `RULE_TEMPLATE.compile_template` (JSON) | 슬롯값 → `condition_expr`·`action_json` 생성 템플릿 |
| isBuiltin | `RULE_TEMPLATE.is_builtin` | 빌트인 잠금 플래그 |
| scope | `RULE_TEMPLATE.scope` | `미서기` \| `커튼월` \| `공통` |

슬롯 타입 enum: `product_class` / `option_value(OPT-*)` / `enum[...]` / `numeric(unit)` / `item_ref(filter=*)` / `process_ref`. 빌트인 6종 및 컴파일 규칙: DE35-1 §6.5 / BOM-RULE-UI 스펙.

### 13.4 BOM_RULE 확장 컬럼

| 표준명 | DB | 정의 |
|---|---|---|
| templateId | `BOM_RULE.template_id` (nullable FK) | 생성 템플릿. NULL = 전문가 모드 원시 규칙 |
| templateInstanceId | `BOM_RULE.template_instance_id` | 한 인스턴스가 생성한 규칙 그룹 키 |
| slotValues | `BOM_RULE.slot_values` (JSON) | 사용자 입력 원본값 |
| scopeType | `BOM_RULE.scope_type` | `MASTER` \| `ESTIMATE` |
| estimateId | `BOM_RULE.estimate_id` (nullable FK) | ESTIMATE 스코프 소속 견적 |

MASTER/ESTIMATE 오버레이 평가 순서·권한: DE35-1 §6.5 / Phase 2 ES 설계.

### 13.5 BOM_RULE_HISTORY 컬럼

| 표준명 | DB | 정의 |
|---|---|---|
| historyId | `BOM_RULE_HISTORY.history_id` (PK) | — |
| ruleId | `BOM_RULE_HISTORY.rule_id` (FK) | 대상 규칙 |
| operation | `operation` | `INSERT` \| `UPDATE` \| `DELETE` |
| beforeSnapshot / afterSnapshot | `before_snapshot` / `after_snapshot` (JSON) | INSERT 는 before NULL, DELETE 는 after NULL |
| changedFields | `changed_fields` (JSON 배열) | UPDATE 변경 컬럼명 |
| actor / actorRole | `actor` / `actor_role` | 편집자 식별자 + 역할 |
| changedAt | `changed_at` | 변경 시각 |
| reason | `reason` (nullable) | 자유 메모 |

## 14. 다이스북·공급망

| 표준명 | DB | 정의 |
|---|---|---|
| DiesBook | `DIES_BOOK` | 알루미늄 압출 금형 카탈로그 |
| 다이스코드 | `ITEM.dies_code` | 금형 식별자. itemCode 와 구분 |
| DiesSupplier | `DIES_SUPPLIER` | 금형사. role: `EXTRUSION`/`INSULATION`/`HARDWARE` |
| ItemSupplier | `ITEM_SUPPLIER` | 자재↔공급사 다대다 매핑 |
| unitWeight | `ITEM.unit_weight_kg_m` | 프로파일 단위중량 (kg/m) |

## 15. 모델코드 디코딩

| 세그먼트 | 값 | 의미 |
|---|---|---|
| Brand | `DHS` / `UNI` / `U-P` | 브랜드·계약 |
| ProductType | `AE` / `SM` / `CW` | 미서기/시스템미서기/커튼월 |
| Size | `225` / `160` / `CW135` | 프로파일 폭 (mm) |
| HiddenBar | `H` / 생략 | 히든바 유무 |
| GlassLayer | `2` / `3` | 유리 겹수 |
| Derivative | `-1` / `-S` / `-SS` | 파생 순번 |

## 16. 기본제품·파생제품

| 표준명 | DB | 정의 |
|---|---|---|
| 기본제품 (BaseProduct) | — | 한 치수 라인의 대표 제품 |
| 파생제품 (DerivativeProduct) | — | 기본제품 변형. 1 기본 ↔ 최대 6 파생 |
| derivativeOf | `PRODUCT.derivative_of` (FK) | 파생→기본 참조 |
| derivativeKind | `PRODUCT.derivative_kind` | `1MM` / `CAP_TO_HIDDEN` / `TEMPERED` / `FIRE_43MM` |

---

## 변경 이력

| 버전 | 일자 | 변경 |
|---|---|---|
| v1.0 | 2026-04-14 | 초안 |
| v1.1 | 2026-04-15 | §9~§16 신규. CuttingBOM·ProductSeries·LayoutType 엔티티 추가 |
| v1.2 | 2026-04-16 | v1.1 엔티티 철회. MBOM 속성 확장·OPT-LAY·PRODUCT 속성 흡수 |
| v1.3 | 2026-04-16 | V1~V6 검증 Blocker/P0 반영. snapshot 필드, NUMERIC 해시 제외, enablement_condition, action 동사 스키마, itemCategory 등 |
| v1.4 | 2026-04-16 | BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived) 스펙 반영. §13 재조직. §13.3 RULE_TEMPLATE / §13.4 BOM_RULE 확장 5컬럼 / §13.5 BOM_RULE_HISTORY / §13.1 `IN` 연산자. §2 신규 엔티티. §7 QTY_CHANGE·LOSS_CHANGE 저장 모델 금지 |
| **v1.4-r1** | **2026-04-21** | **슬림 개정 — 용어사전 순수성 원칙 적용. 용어 정의 외 정책·산식·프로세스·오버레이 평가 규칙·인덱스 설계·시뮬레이터 API 스펙·평가 순서 등을 설계 문서(DE11-1/DE35-1/DE24-1·BOM-RULE-UI 스펙)로 이관. §3.1 lossRate 적용 공식, §4 optionsHash 산출식·lazy 생성·frozen 불변 필드 목록, §13.1 UNIQUE_V1 문법 세부, §13.2 UI 별명 note, §13.3 슬롯 타입 상세, §13.4 오버레이 원칙, §13.6 평가 시점 절 전체 제거. 총 298줄 → 약 180줄. 각 용어는 "상세: DE-문서 §" 참조 링크로 탐색 가능. 문서 상단에 비대화 금지·분할 원칙 callout 명시. v1.3 파일 제거** |
| v1.4-r2 | 2026-04-24 | BOM Level 5단 공식 정의 + 위치구분 카탈로그 10종 추가 (유니크시스템 BOM_26.04.24 반영). §2.1 L1~L5 (FERT/HALB/Sub-Asm/Part/ROH), §5.1 locationCode 카탈로그(H01~H03-2, W01~W03) |