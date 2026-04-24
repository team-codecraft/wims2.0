WIMS 시스템 개선 개발

# BOM 구성에 대한 고찰

**문서 코드**: DE35-1 부록 D (설계 노트)
**작성일**: 2026. 03. 24. (v1.0) / 2026. 04. 21. (v1.4)
**작성자**: 코드크래프트
**버전**: v1.4

> [!abstract] v1.4 개정 요약 (용어사전 v1.3/v1.4 정합)
> - **§3.5 묶음 버전 원칙**: 원자 번들을 3축(EBOM+MBOM+Config) → **4축(EBOM+MBOM+Config+BOM_RULE)** 으로 확장. DE35-1 v1.5 §6.5.2 정합.
> - **§5.3 BOM Rule 액션 동사**: 5종(ADD/REMOVE/REPLACE/QTY_CHANGE/LOSS_CHANGE) → **4종 공식 스키마(SET/REPLACE/ADD/REMOVE)**. `QTY_CHANGE`·`LOSS_CHANGE` 는 용어사전 v1.3 §13 금지어로 폐기 — 저장 모델에서 제거하고 `SET` 동사의 산식 표현으로 흡수.
> - **§5.5 데이터 모델**: `OPTION_VALUE` 를 NUMERIC 타입으로 확장(`value_type`, `numeric_min/max`, `enablement_condition`, `is_default`). `BOM_RULE` 에 **5컬럼 추가**(template_id, template_instance_id, slot_values, scope_type, estimate_id). **신규 엔티티 2종**(`RULE_TEMPLATE`, `BOM_RULE_HISTORY`) — 용어사전 v1.4 §13.3/§13.4/§13.5.
> - **§5.6.3 Config status 흐름**: `DRAFT → RESOLVED → RELEASED` → **`DRAFT → RELEASED → DEPRECATED`** 로 정정 (용어사전 §4).
> - **§5.6.4 Resolved BOM**: 절단 속성 8필드(cut_direction, cut_length, cut_length2, cut_qty, actual_cut_length, supply_division, frozen, item_category) 반영 — DE24-1 v1.8 응답 DTO 정합.
> - **§6 해석 프로세스**: frozen 전환 트리거 3종(T1 견적 CONFIRMED / T2 작업지시 RELEASED / T3 PM "확정" 버튼) + frozen 후 재평가 금지 원칙 명시.
> - **§8 화면 구성**: "옵션 구성 화면" → **옵션별규칙 3뷰 체계(📋 템플릿 갤러리 / 📊 결정표 / ⚙️ 전문가)** + 시뮬레이터 패널 반영 (BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived)). UI 표기 용어 확정: **자재구성(EBOM)/공정구성(MBOM)/옵션구성(Config)/옵션별규칙(BOM_RULE)/확정구성표(Resolved BOM)**.
> - **§9 MES 연동**: DE24-1 v1.8 8 신규 필드·`?supplyDivision`/`?itemCategory` 쿼리·단방향 GET 전용 원칙 반영.
> - **§10 향후 과제**: BOM Rule 편집기·옵션 유효성 검증은 AN12-1-P1 v1.1-r1 FR-PM-020~022·025~027 로 착수 확정 표기.
> - **§11 관련 산출물**: DE35-1 v1.4 → **v1.5-r2**, 용어사전 **v1.4** 추가, BOM-RULE-UI 스펙 추가.

---

## 1. 배경과 문제 인식

### 1.1 현행 BOM의 한계

WIMS 시스템의 현행 BOM 구조(DE35-1 부록 A)는 4레벨(Level 0~3) 계층으로, 완제품 → 조립체 → 부품 → 원자재의 구조를 가진다. 이 구조는 제품의 물리적 구성을 잘 표현하지만, 아래 세 가지 한계가 있다.

첫째, **설계와 제조 관점이 혼재**되어 있다. Level 1이 조립체(창틀, 외측 창짝 등)로 구성되어 제조 관점에 가깝지만, 공정 정보나 로스율이 BOM 안에 없어 순수한 제조 BOM도 아니다. 설계 변경이 발생했을 때 제조에 미치는 영향을 추적하기 어렵다.

둘째, **제품 변형 관리가 불가능**하다. 동일한 미서기 이중창이라도 단독 설치와 2연창 설치, 사선절단과 직각절단에 따라 투입 자재와 수량이 달라지는데, 현재 구조에서는 변형마다 별도 BOM을 만들어야 한다.

셋째, **MES 연동 시 데이터 가공이 필요**하다. MES에서 필요한 공정별 자재 소요량, 작업 순서, 실소요량(로스 반영)을 BOM에서 직접 제공하지 못하고, 부록 B의 로스율 데이터를 별도로 조합해야 한다.

### 1.2 목표

이 고찰의 목표는 WIMS 시스템의 BOM 데이터를 EBOM(설계 BOM)과 MBOM(제조 BOM)으로 분리하고, 구성형 BOM(Configurable BOM) 개념을 도입하여 제품 변형을 체계적으로 관리할 수 있는 구조를 설계하는 것이다.

---

## 2. 현행 BOM 구조 진단

### 2.1 현행 구조 요약

| Level | 구분 | 예시 | 성격 |
|-------|------|------|------|
| 0 | 완제품 | 미서기 이중창 1SET | 공통 |
| 1 | 조립체 | 창틀, 외측 창짝, 내측 창짝, 하드웨어, 기밀자재, 방충망 | MBOM에 가까움 |
| 2 | 부품/자재 | 상틀, 복층유리, 호차, 크리센트 | 공통 |
| 3 | 원자재/소재 | 판유리, 간봉, 아르곤가스, 실란트 | 공통 |

### 2.2 EBOM/MBOM 관점 진단 결과

현행 BOM은 **MBOM 성격이 우세**하다. 근거는 다음과 같다.

- Level 1이 기능 분류가 아닌 **조립체(Assembly) 단위**로 구성되어 있다.
- 창틀 → 외측 창짝 → 내측 창짝 순서가 실제 **조립 순서**와 대응한다.
- MES가 이 BOM 뷰를 직접 조회하여 **생산에 활용**하고 있다.

다만 순수 MBOM이 아닌 이유는 공정 정보(공정코드, 작업순서)가 누락되어 있고, 로스율이 BOM 외부(부록 B)에서 관리되며, 위치 정보(내측/외측, 좌/우)가 부분적으로만 반영되어 있기 때문이다.

따라서 **EBOM을 새로 정의하고, 현행 구조를 MBOM으로 확장**하는 방향이 가장 현실적이다.

---

## 3. EBOM과 MBOM의 분리

### 3.1 EBOM — 설계 관점의 부품 구성

EBOM(Engineering BOM)은 제품을 **"무엇으로 구성되는가"**의 관점에서 기능별로 분해한 구조이다. 설계 도면과 1:1로 대응되며, 부품의 사양(규격, 재질, 치수)을 중심으로 관리한다.

WIMS 창호 시스템에서 EBOM의 역할은 다음과 같다.

- 설계자가 제품의 부품 구성을 기능 단위로 정의하고 사양을 확정하는 **기준 문서**
- 부품의 호환성, **대체 가능 여부** 관리 (예: 5mm 투명유리 ↔ 5mm 로이유리)
- 설계 변경(ECO) 발생 시 **변경 범위와 영향도**를 파악하는 기준
- **MBOM 생성의 원천 데이터** (EBOM 없이 MBOM을 만들 수 없음)

EBOM 구조 예시 (미서기 이중창):

| Lv | 품목코드 | 품목명 | 분류 | 수량 |
|----|----------|--------|------|------|
| 0 | PRD-SLD-DW | 미서기 이중창 | 완제품 | 1 SET |
| 1 | **E-STR-001** | **구조부 (Structural)** | 기능군 | 1 SET |
| 2 | E-FRM-TOP | 상틀 프로파일 | 프레임 | 1 EA |
| 2 | E-FRM-BOT | 하틀 프로파일 | 프레임 | 1 EA |
| 2 | E-FRM-LFT | 좌틀 프로파일 | 프레임 | 1 EA |
| 2 | E-FRM-RGT | 우틀 프로파일 | 프레임 | 1 EA |
| 2 | E-FRM-MUL | 멀리언 프로파일 | 프레임 | 1 EA |
| 1 | **E-GLZ-001** | **유리부 (Glazing)** | 기능군 | 1 SET |
| 2 | E-GLS-IGU | 복층유리 유닛 (IGU) | 원자재 | 4 EA |
| 1 | **E-HDW-001** | **개폐부 (Operation)** | 기능군 | 1 SET |
| 2 | E-HDW-RLR | 호차 (Roller) | 부자재 | 8 EA |
| 2 | E-HDW-CRS | 크리센트 세트 | 부자재 | 2 SET |
| 1 | **E-SEL-001** | **밀봉부 (Sealing)** | 기능군 | 1 SET |
| 1 | **E-SCR-001** | **방충부 (Screen)** | 기능군 | 1 SET |

핵심은 Level 1이 **기능군(Functional Group)**이라는 점이다. 구조부, 유리부, 개폐부, 밀봉부, 방충부 — 제품의 기능적 역할 기준으로 분류되어 있으며, "어디에 설치되는지(내측/외측)"는 EBOM에서 구분하지 않는다.

### 3.2 MBOM — 제조 관점의 조립 구성

MBOM(Manufacturing BOM)은 제품을 **"어떻게 만드는가"**의 관점에서 공정별로 구성한 구조이다. 작업지시서, 자재 불출, MES 연동의 기준이 되며, 로스율과 실소요량을 포함한다.

MBOM의 Level 1은 **조립체(Assembly)**이다. 현행 BOM의 구조(창틀, 외측 창짝, 내측 창짝...)를 거의 그대로 사용하되, 다음을 추가한다.

- **공정코드 (process_code)**: 각 부품이 어떤 공정을 거치는지 (예: PRC-CUT-M45 = 45° 사선절단)
- **작업순서 (work_order)**: 조립 순서를 숫자로 지정
- **로스율 (loss_rate)**: 부록 B 체계에 따른 절단/조립 손실률
- **실소요량 (actual_qty)**: 이론 소요량 × (1 + 로스율)
- **작업장 (work_center)**: MES의 어떤 작업장에서 처리하는지

### 3.3 EBOM vs MBOM 핵심 차이

| 비교 항목 | EBOM (설계 BOM) | MBOM (제조 BOM) |
|-----------|-----------------|-----------------|
| 관점 | 무엇으로 구성되는가 (What) | 어떻게 만드는가 (How) |
| Level 1 기준 | 기능군 (구조부, 유리부, 개폐부...) | 조립체 (창틀, 외측 창짝, 내측 창짝...) |
| 수량 기준 | 설계 이론 소요량 | 실소요량 (로스율 반영) |
| 공정 정보 | 없음 | 공정코드, 작업순서, 작업장 포함 |
| 변경 관리 | ECO (설계변경오더) | MCO (제조변경오더) |
| 주 사용자 | 설계팀, 영업팀 | 생산팀, 자재팀, MES |
| MES 연동 | 간접 (MBOM을 통해) | 직접 연동 |
| 위치 정보 | 없음 (내/외 구분 없음) | 있음 (내측/외측, 좌/우 구분) |

### 3.4 EBOM → MBOM 변환 방식 채택

두 BOM의 관계에 대해 "EBOM → MBOM 변환 방식"과 "독립 등록 방식"을 비교 검토한 결과, **EBOM → MBOM 변환 방식**을 채택하였다. 주요 근거는 다음과 같다.

- 창호 제조업은 설계 → 제조의 **순차적 프로세스**를 따르므로, EBOM이 MBOM의 원천이 되는 것이 자연스럽다.
- EBOM을 먼저 등록하면 시스템이 **MBOM 초안을 자동 생성**하고, 생산팀이 공정 정보를 추가/편집하는 방식으로 등록 부담을 줄인다.
- EBOM 변경 시 **MBOM 영향도를 자동 파악**할 수 있어 설계 변경 추적이 용이하다.
- 현행 BOM의 조립체 구조를 MBOM 초안 생성 **템플릿**으로 활용할 수 있다.

변환 완료 후 EBOM과 MBOM은 **개별적으로 저장·관리되는 것이 아니라**, 옵션 구성(Config) 묶음과 함께 하나의 **표준BOM 단위**로 원자적(atomic) 스냅샷을 구성한다. 즉, 변환 결과는 개별 등록이 아닌 "EBOM + MBOM + Config 세 묶음이 동일한 `standardBomVersion` 축 위에서 동시에 릴리스"되는 형태로 커밋된다. 이 원칙은 §3.5에서 상세히 정의한다.

### 3.5 묶음 버전 관리 원칙 — 단일 `standardBomVersion` 축

#### 3.5.1 표준BOM의 구성 단위

WIMS에서 **표준BOM**은 EBOM(자재구성), MBOM(공정구성), Config(옵션구성), BOM_RULE(옵션별규칙) **네 요소의 불가분 묶음**이다 (용어사전 v1.4 §2, DE35-1 v1.5 §6.5.2).

```
표준BOM = EBOM(자재구성) + MBOM(공정구성) + Config(옵션구성) + BOM_RULE(옵션별규칙)
```

네 요소는 하나의 `standardBomVersion`(예: sbv1, sbv2, ...)을 공유하며, 어느 하나라도 변경되면 표준BOM 전체가 다음 버전으로 올라간다. v1.3 의 3축 모델에 BOM_RULE 을 독립 축으로 추가한 이유는, v1.1-r1(용어사전 v1.4 §13) 에서 BOM_RULE 이 5컬럼 확장(template_id, template_instance_id, slot_values, scope_type, estimate_id) 과 자체 이력(`BOM_RULE_HISTORY`)을 가지며 Config 내부 하위 요소로 취급하기에는 변경 빈도·권한 경계가 다르기 때문이다.

| 변경 발생 요소 | 예시 | 결과 |
|---------------|------|------|
| EBOM만 변경 | 유리 사양 부품 교체 | 표준BOM sbv1 → sbv2 |
| MBOM만 변경 | 절단 공정 로스율 조정 | 표준BOM sbv1 → sbv2 |
| Config(옵션 정의)만 변경 | NUMERIC 옵션 범위 조정 | 표준BOM sbv1 → sbv2 |
| BOM_RULE(옵션별규칙)만 변경 | 템플릿 인스턴스 추가·편집 | 표준BOM sbv1 → sbv2 |
| 네 요소 동시 변경 | 설계 변경(ECO) 일괄 반영 | 표준BOM sbv1 → sbv2 (단일 버전 상승) |

> **주:** `BOM_RULE.scope_type='ESTIMATE'` 오버레이(용어사전 v1.4 §13.4) 는 표준BOM 에 묶이지 않으며 개별 견적(`estimate_id`) 에 연결된다. 이 단서는 Phase 2 ES 서브시스템에서 상세 설계한다.

#### 3.5.2 원자적(atomic) 스냅샷 릴리스

표준BOM 버전이 확정(RELEASED)될 때, 시스템은 다음 **네 데이터**를 **동일 트랜잭션 내에서 동시에 스냅샷**으로 저장한다.

1. 해당 버전의 EBOM 전체 트리 (ebom_snapshot)
2. 해당 버전의 MBOM 전체 트리 (mbom_snapshot)
3. 해당 버전에 유효한 옵션 그룹/값/제약 전체 집합 (config_snapshot)
4. 해당 버전에 유효한 `BOM_RULE` (scope_type='MASTER') 전체 집합 + `RULE_TEMPLATE` 참조 스냅샷 (bom_rule_snapshot)

네 스냅샷이 모두 저장되거나 모두 롤백되는 원자성이 보장되어야 한다. 일부만 저장된 반중간 상태의 표준BOM 버전은 존재할 수 없다.

이 전환은 `BOM_RULE_HISTORY` 에 이벤트(`released_at`, `released_by`, `standard_bom_version`) 로 기록되어 언제든 복원·감사가 가능하다 (용어사전 v1.4 §13.5).

#### 3.5.3 Resolved BOM의 결정성

Resolved BOM은 아래 세 입력의 **결정적 함수(deterministic function)**로 정의된다.

```
resolvedBomId = f(standardBomId, standardBomVersion, 옵션선택값 집합)
```

동일한 `standardBomId`, `standardBomVersion`, 동일한 옵션선택값 집합이 주어지면 항상 동일한 Resolved BOM이 생성된다. 이 특성은 두 가지 의미를 갖는다.

- **멱등성(idempotency)**: 같은 조건으로 해석(Resolution)을 몇 번 실행해도 결과가 동일하다. 재계산이 필요할 때 안전하게 수행할 수 있다.
- **이력 추적**: `standardBomVersion`이 기록되므로, 특정 주문이 어떤 버전의 표준BOM으로 생산되었는지 언제든 재현할 수 있다.

#### 3.5.4 이 모델의 핵심 동기 — 버전 불일치 문제 방지

묶음 버전 관리 원칙을 도입한 핵심 동기는 **세 요소 간 버전 불일치로 인한 정합성 오류 방지**이다.

네 요소를 개별적으로 버전 관리하면 아래와 같은 불일치 상황이 발생할 수 있다.

| 불일치 시나리오 | 결과 |
|----------------|------|
| EBOM sbv2 가 적용되었으나 BOM_RULE 은 sbv1 기준 | Rule 의 조건식이 EBOM 에 없는 itemCode 를 참조 → 해석 오류 |
| MBOM sbv3 의 공정 노드가 EBOM sbv1 의 기능군을 참조 | 매핑 불일치 → 작업지시서 데이터 누락 |
| Config 옵션 정의는 sbv2, BOM_RULE 은 sbv1 | 새 NUMERIC 옵션 키를 참조하는 산식이 NULL 바인딩 → 평가 실패 |
| Resolved BOM 이 생성된 후 MBOM·BOM_RULE 만 조용히 변경 | MES 에 이미 전달된 BOM 과 시스템 내 BOM 이 달라짐 |

단일 `standardBomVersion` 축 모델에서는 "EBOM, MBOM, Config, BOM_RULE 이 항상 같은 버전을 가리킨다"는 불변 조건이 유지되므로, 위 시나리오가 구조적으로 불가능하다. 어느 요소를 수정하더라도 반드시 새 버전으로 일괄 릴리스해야 하기 때문이다.

---

## 4. 데이터 모델

### 4.1 핵심 엔티티

| 엔티티 | 설명 | 주요 속성 |
|--------|------|-----------|
| PRODUCT | 제품 마스터 | product_id, product_code, product_name, product_type, status, version |
| ITEM | 품목 마스터 (EBOM/MBOM 공통) | item_id, item_code, item_name, item_type, category, unit, spec |
| EBOM | 설계 BOM 트리 | ebom_id, product_id, parent_item_id, child_item_id, level, qty, sort_order, version |
| MBOM | 제조 BOM 트리 | mbom_id, product_id, parent_item_id, child_item_id, level, qty, process_code, work_order, loss_rate, actual_qty, version |
| EBOM_MBOM_MAP | EBOM↔MBOM 매핑 | map_id, ebom_id, mbom_id, mapping_type (1:1, 1:N, N:1) |
| PROCESS | 공정 마스터 | process_id, process_code, process_name, process_type, work_center |

### 4.2 엔티티 관계

- PRODUCT 1 : N EBOM — 하나의 제품에 여러 EBOM 노드
- PRODUCT 1 : N MBOM — 하나의 제품에 여러 MBOM 노드
- EBOM N : M MBOM — EBOM_MBOM_MAP을 통한 다대다 매핑
- MBOM N : 1 PROCESS — 각 MBOM 노드는 하나의 공정에 소속
- ITEM은 EBOM/MBOM 양쪽에서 공통 참조 (품목 마스터 일원화)

#### 4.2.1 EBOM ↔ MBOM 매핑 실제 사례 (DHS-AE225-D-1 기준)

EBOM_MBOM_MAP의 `mapping_type` 컬럼에는 1:1, 1:N, N:1 세 가지 유형이 존재한다. 아래는 DHS-AE225-D-1 BOM 정리(참고자료)의 섹션 9에서 확인된 실제 매핑 사례이다.

| 관계 유형 | EBOM 노드 | MBOM 노드 | 비고 |
|-----------|-----------|-----------|------|
| **1:1** | HX-0001 조립 반제품 | HF-0005 나사체결 가공품 | 명칭만 다르고 구조 동일 |
| **1:N** | HC-001 가공 반제품 (프레임 절단) | HF-0003 가네고 가공품 + HF-0002 피스홀 가공품 | EBOM 1노드 = MBOM 2 공정 |
| **1:N** | HC-002 가공 반제품 (중간+부자재) | HF-0006 후렘연결 가공품 + HF-0004 풍지판 가공품 + HF-0001 배수홀 가공품 | EBOM 1노드 = MBOM 3 공정 |
| **1:N (위치 분할)** | Frame(H) UNI-A225-101 ×2 | UNI-A225-101-HC (H01) + UNI-A225-101-HC2 (H02) | 동일 자재가 위치별로 2 인스턴스로 분할 |
| **1:N (위치 분할)** | Frame(W) UNI-A225-101 ×2 | UNI-A225-101-WC (W01) + UNI-A225-101-WC-2 (W02) | 동일 자재가 위치별로 2 인스턴스로 분할 |
| **1:N (위치 분할)** | 중간Frame(H) UNI-A225-901 ×2 | UNI-A225-101-HC3 (H03) + UNI-A225-101-HC4 (H04) | 동일 자재가 위치별로 2 인스턴스로 분할 |
| **N:1** | Vent Ass'y UNI-A225-401 전체 트리 | D-0001 문짝 완제품 | 다수 EBOM 노드가 문짝 라인 단일 MBOM으로 수렴 |

위 사례에서 확인할 수 있듯이 EBOM-MBOM 관계는 단순 1:1이 아니다. 설계에서 하나의 가공 반제품 노드(HC-001)가 제조에서는 공정 순서에 따라 복수의 MBOM 노드(가네고 공정 → 피스홀 공정)로 분해되는 1:N 구조가 실제로 존재하며, 반대로 Vent Ass'y처럼 설계 관점의 여러 노드가 제조 라인 단위에서 하나의 MBOM 트리로 수렴하는 N:1 구조도 나타난다. EBOM_MBOM_MAP의 `mapping_type` 필드가 이 다양성을 명시적으로 기록해야 한다.

### 4.3 품목코드 확장

기존 코드 체계(DE35-1 6.1절)를 유지하면서 EBOM 전용 접두어를 추가한다.

| 접두어 | BOM | 형식 | 예시 |
|--------|-----|------|------|
| E-STR | EBOM | E-STR-[순번] | E-STR-001 (구조부) |
| E-GLZ | EBOM | E-GLZ-[순번] | E-GLZ-001 (유리부) |
| E-HDW | EBOM | E-HDW-[순번] | E-HDW-001 (개폐부) |
| E-SEL | EBOM | E-SEL-[순번] | E-SEL-001 (밀봉부) |
| E-SCR | EBOM | E-SCR-[순번] | E-SCR-001 (방충부) |
| ASY | MBOM | ASY-[부위]-[순번] | ASY-FRM-001 (창틀 조립체) — 기존 유지 |
| PRC | MBOM | PRC-[유형]-[순번] | PRC-CUT-M45 (45° 사선절단) — 신규 |

---

## 5. 구성형 BOM (Configurable BOM)

### 5.1 왜 구성형 BOM이 필요한가

동일한 미서기 이중창이라도 설치 형태, 절단 방식, 유리 사양, 색상 등에 따라 투입 자재와 수량이 달라진다. 변형마다 별도 BOM을 만들면 관리가 폭발적으로 증가한다.

구성형 BOM은 **하나의 기본 BOM(Base BOM)에 옵션 규칙을 부여하여, 주문 조건에 따라 자동으로 BOM을 해석(Resolution)**하는 체계이다.

핵심 개념 세 가지:

- **Base BOM**: 모든 구성에 공통인 부품 + 조건부 부품을 모두 포함한 마스터 BOM
- **Option Group**: 제품 구성에 영향을 주는 변수 카테고리 (설치구성, 절단방식 등)
- **BOM Rule**: 특정 옵션 조합일 때 BOM에 적용되는 규칙 (부품 추가/삭제/수량변경 등)

### 5.1.1 위치 인스턴스 분할 운용 방식 (원본 BOM 데이터 기반 분석 사례)

구성형 BOM에서 특히 주의해야 할 운용 패턴이 **위치 인스턴스 분할**이다. 이는 EBOM에서 단일 자재(품번 1개)로 정의된 부품이 MBOM에서 **설치 위치별로 개별 품번을 부여받아 여러 인스턴스로 분할**되는 방식이다.

**개념 정의**

동일한 원자재(예: UNI-A225-101)가 제품 내에 복수의 위치에 설치될 때, 각 위치별로 절단 치수·공정 파라미터가 다르다. 이를 구분하기 위해 위치 식별자(H01, H02, W01...)를 접미사로 붙여 별도의 품번(UNI-A225-101-HC, HC2, HC3, HC4 / WC, WC-2, WC-3)을 생성하고, MBOM 트리상에서 각각 독립된 노드로 관리한다.

**원본 BOM 데이터 기반 분석 사례 (DHS-AE225-D-1, 참고자료 섹션 9)**

| EBOM 자재 (단일 품번) | MBOM 위치 인스턴스 | 위치 코드 | 비고 |
|----------------------|--------------------|-----------|------|
| UNI-A225-101 Frame(H) ×2 | UNI-A225-101-HC | H01 | H방향 1번 위치 |
| | UNI-A225-101-HC2 | H02 | H방향 2번 위치 |
| UNI-A225-101 Frame(W) ×2 | UNI-A225-101-WC | W01 | W방향 1번 위치 |
| | UNI-A225-101-WC-2 | W02 | W방향 2번 위치 |
| UNI-A225-901 중간Frame(H) ×2 | UNI-A225-101-HC3 | H03 | H방향 3번 위치 |
| | UNI-A225-101-HC4 | H04 | H방향 4번 위치 |
| UNI-A225-901 중간Frame(W) ×1 | UNI-A225-101-WC-3 | W03 | W방향 3번 위치 (1:1) |

위 사례에서 EBOM의 `UNI-A225-101` 단일 품번은 MBOM에서 HC, HC2, HC3, HC4 / WC, WC-2, WC-3 등 최대 7개의 위치 인스턴스로 분할된다.

**데이터 모델 설계 함의**

위치 인스턴스 분할을 지원하려면 MBOM 노드에 `location_code` 속성(H01~W03 등 위치 식별자)을 추가하고, ITEM 마스터에 **위치 인스턴스 품번과 원본 자재 품번 간의 참조 관계**를 별도 컬럼(`source_item_id`)으로 기록해야 한다. 이를 통해 "어떤 원자재가 몇 개의 위치 인스턴스로 사용되는가"를 집계할 수 있으며, 자재 소요량 검증(EBOM 수량 합산 ↔ MBOM 인스턴스 합산)에도 활용된다.

> **[미확정]** Q9(Phantom 여부) · Q16(위치코드 명명 규칙) 회신 결과에 따라 위 해석이 보정될 수 있음.

### 5.2 옵션 차원(Dimension) 정의

미서기 이중창의 BOM에 영향을 주는 옵션을 6개 차원으로 정의하였다.

#### (1) 설치 구성 (OPT-LAY) — 필수, EBOM+MBOM

가장 큰 BOM 변동을 일으키는 옵션이다.

| 설치구성 | 구성도 | 추가/변경 자재 |
|----------|--------|----------------|
| 단독 (1x1) | [■] | 없음 (Base BOM) |
| 2연창 (1x2) | [■][■] | 연결프레임 +1EA, 연결부 가스켓 +1SET, 독립 좌/우틀 -1EA |
| 3연창 (1x3) | [■][■][■] | 연결프레임 +2EA, 연결부 가스켓 +2SET, 독립 좌/우틀 -2EA |
| 4연창 (1x4) | [■][■][■][■] | 연결프레임 +3EA, 연결부 가스켓 +3SET, 보강브라켓 +2EA |
| 2×2 조합 | [■][■] / [■][■] | 수평연결 +2EA, 수직연결(트랜섬) +1EA, 코너부품 +4EA, 가스켓 +4SET |
| L자 조합 | [■][■] / 　[■] | 코너연결프레임 +1EA, 코너방수자재 +1SET, 코너기밀커버 +1EA |

연결프레임 수량 산출 공식:
> 연결프레임 수 = (가로 수 - 1) × 세로 행 수 + (세로 행 수 - 1) × 가로 열 수

#### (2) 절단 방식 (OPT-CUT) — 필수, MBOM

프레임 코너 접합 시 절단 방식에 따라 로스율과 필요 부자재가 달라진다.

| 비교 | 사선절단 (Miter, 45°) | 직각절단 (Butt, 90°) |
|------|----------------------|---------------------|
| 절단 로스율 | 높음 (3~5%) | 낮음 (1~2%) |
| 외관 품질 | 우수 (고급 마감) | 보통 (마감 처리 필요) |
| 필요 부자재 | 코너 용접봉, 코너 본드, 클리닝재 | 코너캡, 코너 보강 브라켓, 추가 나사 |
| 적용 공정 | CUT-M45 → WLD-CNR → CLN-CNR | CUT-B90 → ASY-CNR → CAP-CNR |
| 적합 재질 | PVC (용접), AL (본드) | AL (나사 체결) |

혼합 절단(가로 직각 + 세로 사선)도 옵션 값으로 지원한다.

#### (3) 유리 사양 (OPT-GLZ) — 필수, EBOM+MBOM

| 옵션 값 | EBOM 영향 | MBOM 영향 |
|---------|-----------|-----------|
| 일반 복층 (5+6A+5) | 기본 사양 | 기본 사양 |
| 로이 복층 (5+12A+5 Low-E) | 외측유리 로이로 변경, 중공층 12mm | 간봉 규격 변경, 아르곤 충전 가능 |
| 삼중유리 (5+6A+5+6A+5) | 유리 3장, 간봉 2열 | 유리삽입 2회, 실란트 2배, 호차 하중증가형 |
| 강화유리 | 유리 소재만 변경 | 강화처리 공정 추가 |

#### (4) 프레임 재질 (OPT-MAT) — 필수, EBOM+MBOM

PVC, 알루미늄, 알루미늄+단열재(Thermal Break), 하이브리드(내PVC+외AL). 프레임 부품 전체, 보강재 유무, 단열재에 영향.

#### (5) 색상/표면처리 (OPT-FIN) — 필수, MBOM

백색, 브라운, 그레이, 우드그레인(래핑), 아노다이징, 분체도장. 표면처리 공정 및 관련 자재 추가.

#### (6) 부속 선택 (OPT-ACC) — 선택, EBOM+MBOM

윈드클로저(유/무), 방충망 유형(일반/미세먼지), 핸들 유형(일반/폴딩).

### 5.3 BOM Rule 체계 (용어사전 v1.3 §13 — 공식 4동사 스키마)

BOM_RULE 은 `when`(조건식) 과 `action`(액션) 으로 구성된다. **action 은 공식 4동사 — `SET` / `REPLACE` / `ADD` / `REMOVE` — 중 정확히 하나**여야 한다.

> [!warning] v1.4 변경 — 폐기 동사
> v1.3 이전에 존재하던 `QTY_CHANGE`·`LOSS_CHANGE` 는 용어사전 v1.3 §13 에서 **금지어**로 지정되어 폐기되었다. 수량·로스율 변경은 **`SET` 동사 + 산식 표현**(`cutQtyFormula`, `lossRate`) 으로 흡수한다. 스키마·API·DB 어디에도 폐기 동사를 사용하지 않는다.

**액션 4동사**:

| 액션 | 의미 | 대상 | 비고 |
|------|------|------|------|
| `SET` | MBOM 행의 특정 속성을 상수/산식으로 세팅 | 기존 MBOM 행의 속성(`cutLengthFormula`, `cutLengthFormula2`, `cutQtyFormula`, `lossRate`, `workCenter` 등) | 수량·로스율 변경은 이 동사로 처리 |
| `REPLACE` | itemCode 치환 (같은 슬롯) | 기존 MBOM 행의 `itemCode` A→B | 위치 인스턴스·공정은 유지 |
| `ADD` | 신규 MBOM 행 추가 | 기능군·위치·공정 지정 필수 | 예: 연결프레임 신규 추가 |
| `REMOVE` | 조건부 MBOM 행 삭제 | 기존 MBOM 행 | Phantom 처리(`isPhantom=TRUE`) 와 구분 |

**조건식(`when`) 예시 (4동사만 사용)**:

```
IF OPT-LAY == '1x2'
  → ADD  CPL-HOR-001 (수평연결프레임)  기능군=구조부 위치=H01 공정=PRC-CUT-H 수량=1
  → ADD  CPL-GSK-001 (연결부 가스켓)    기능군=밀봉부 위치=H01 공정=PRC-ASY-GSK 수량=1
  → REMOVE FRM-RGT-001 (독립 우틀)

IF OPT-CUT == 'MITER'
  → SET  FRM-TOP-001.lossRate = 0.04          // 1.5% → 4.0% (v1.3: LOSS_CHANGE 로 처리하던 부분)
  → SET  FRM-TOP-001.workCenter = 'WC-WLD'
  → ADD  MAT-WRD-001 (코너 용접봉) 수량=16

IF OPT-CUT == 'MITER' AND OPT-MAT == 'PVC'
  → ADD  MAT-WRD-PVC-001 (PVC 전용 용접봉)
  → ADD  PROC-NODE: PRC-WLD-CNR (코너 용접 공정) 순서=다음

IF OPT-GLZ == 'LOW-E'
  → REPLACE GLS-OUT-P1 → GLS-OUT-P1L  (투명유리 → 로이유리)
  → REPLACE GLS-SPC-01 → GLS-SPC-02   (6mm 간봉 → 12mm 간봉)

IF OPT-DIM-W >= 2000                       // NUMERIC 옵션 기반 (v1.3 §11)
  → ADD  HDW-RNF-001 (광폭 보강재) 수량=2
  → SET  FRM-TOP-001.cutLengthFormula = 'W - 40 - 2 * EDGE_OFFSET'

IF OPT-FIN == 'WOOD'
  → ADD  MAT-WRP-001 (래핑필름)
  → ADD  PROC-NODE: PRC-WRP-001 (래핑 공정)

IF OPT-ACC.WIND_CLOSER == 'YES'
  → ADD  HDW-WCL-001 (윈드클로저) 수량=2
  → ADD  HDW-SCR-001 (체결나사) 수량=4
```

**`when` 연산자**: `==`, `!=`, `AND`, `OR`, `>=`, `<=`, `>`, `<`, **`IN`** (용어사전 v1.4 §13.1 추가). NUMERIC 옵션(OPT-DIM-W/H/W1 등)과 ENUM 옵션을 혼용할 수 있다.

**규칙 우선순위 및 충돌 처리**: `BOM_RULE.priority` 값이 낮을수록 먼저 적용된다. 동일 우선순위에서는 **REMOVE > REPLACE > SET > ADD** 순으로 처리한다 (v1.3 의 "REMOVE > REPLACE > QTY_CHANGE > ADD" 폐기). 동일 `template_instance_id` 로 묶인 규칙은 논리적 1단위로 적용·삭제된다.

### 5.4 옵션 제약 조건

모든 옵션 조합이 유효하지는 않다. 제약 조건을 정의하여 무효한 조합을 사전에 차단한다.

| 유형 | 조건 | 설명 |
|------|------|------|
| 상호 배타 | OPT-LAY = L-TYPE → OPT-CUT = BUTT만 허용 | L자 코너는 사선절단 불가, 직각절단만 가능 |
| 필수 종속 | OPT-LAY = 2x2 → OPT-MAT = AL 필수 | 2x2 대형 조합은 구조 강도상 알루미늄 필수 |
| 기본값 연동 | OPT-LAY ≠ 1x1 → OPT-ACC.WIND_CLOSER 기본값 YES | 연창 시 풍압 대비 윈드클로저 기본 적용 |
| 상호 배타 | OPT-MAT = PVC → OPT-FIN ≠ 아노다이징 | PVC에 아노다이징 표면처리 불가 |

### 5.5 구성형 BOM 데이터 모델 확장 (용어사전 v1.4 정합)

4장의 기본 모델에 아래 엔티티를 추가·확장한다. **v1.4 변경점**: `OPTION_VALUE` NUMERIC 확장, `BOM_RULE` 5컬럼 추가, 신규 엔티티 2종(`RULE_TEMPLATE`, `BOM_RULE_HISTORY`).

| 엔티티 | 설명 | 주요 속성 |
|--------|------|-----------|
| `OPTION_GROUP` | 옵션 카테고리 | option_group_id, group_code, group_name, is_required, apply_to(EBOM/MBOM/BOTH) |
| `OPTION_VALUE` | 선택 가능한 옵션 값 | option_value_id, option_group_id, value_code, value_name, is_default, **`value_type`**(ENUM/NUMERIC), **`numeric_min`**, **`numeric_max`**, **`enablement_condition`** (v1.3 §11 신규) |
| `BOM_RULE` | BOM 변동 규칙 | rule_id, product_id, rule_name, priority, `when`(조건식), **`action`**(SET/REPLACE/ADD/REMOVE enum, v1.3 §13), bom_type, **`template_id`** (FK→RULE_TEMPLATE), **`template_instance_id`**, **`slot_values`**(JSON), **`scope_type`**(MASTER/ESTIMATE), **`estimate_id`**(ESTIMATE 오버레이 시) — v1.4 §13.4 |
| ~~BOM_RULE_ACTION~~ | ~~규칙의 변경 액션~~ | **폐기** — v1.3 에서 `action` 컬럼으로 단순화. 4동사 + `targetItemCode`/`newItemCode`/`formulaExpression` 필드로 `BOM_RULE` 내부 처리 |
| `RULE_TEMPLATE` *(신규)* | 재사용 가능한 슬롯 기반 규칙 양식 | template_id, template_code, template_name, **`is_builtin`**, slot_schema(JSON), rule_blueprint(JSON), category — v1.4 §13.3. 빌트인 6종(TPL-REINFORCE-SIZE, TPL-CUT-DIRECTION, TPL-ITEM-REPLACE-BY-OPT, TPL-FORMULA-BY-RANGE, TPL-ADD-BY-OPT, TPL-DERIVATIVE-DIFF) |
| `BOM_RULE_HISTORY` *(신규)* | BOM_RULE 변경 감사 이력 | history_id, rule_id, event_type(CREATE/UPDATE/DELETE/RELEASE), before_snapshot(JSON), after_snapshot(JSON), changed_by, changed_at, standard_bom_version — v1.4 §13.5 |
| `PRODUCT_CONFIG` | 선택된 옵션 조합 | config_id, product_id, config_name, status |
| `CONFIG_OPTION` | 개별 옵션 선택 값 (ENUM+NUMERIC 혼합 JSON `appliedOptions`) | config_option_id, config_id, option_group_id, option_value_id, **`numeric_value`**(NUMERIC 타입일 때) |
| `RESOLVED_BOM` | 해석된 최종 BOM (snapshot) | resolved_bom_id, config_id, bom_type, parent_item_id, child_item_id, resolved_qty, **`cut_direction`**, **`cut_length_evaluated`**, **`cut_length_evaluated_2`**, **`cut_qty_evaluated`**, **`actual_cut_length`**, **`supply_division`**, **`frozen`**, **`item_category`**, **`rule_engine_version`**, rule_applied — DE24-1 v1.8 §3 반영 |

### 5.6 구성형 BOM DB 구조 상세

5.5의 엔티티 모델을 실제 DB 관점에서 상세 설명한다.

#### 5.6.1 옵션 정의 레이어 — "무엇을 선택할 수 있는가"

OPTION_GROUP과 OPTION_VALUE는 제품별로 선택 가능한 옵션의 **메뉴판** 역할을 한다.

**OPTION_GROUP 예시 (미서기 이중창, 6행):**

| option_group_id | group_code | group_name | is_required | apply_to |
|:---:|------------|--------------|:-----------:|----------|
| 1 | OPT-LAY | 설치 구성 | true | BOTH |
| 2 | OPT-CUT | 절단 방식 | true | MBOM |
| 3 | OPT-GLZ | 유리 사양 | true | BOTH |
| 4 | OPT-MAT | 프레임 재질 | true | BOTH |
| 5 | OPT-FIN | 색상/표면처리 | true | MBOM |
| 6 | OPT-ACC | 부속 선택 | false | BOTH |

`apply_to` 컬럼의 역할:
- **BOTH**: 해당 옵션 변경 시 EBOM과 MBOM 모두 영향 (예: 유리사양 변경 → 설계 구성 + 제조 공정 모두 변경)
- **MBOM**: MBOM에만 영향 (예: 절단방식은 제조 공정에만 관련, 설계 부품 구성은 동일)
- 설계팀이 EBOM을 편집할 때 MBOM 전용 옵션(OPT-CUT, OPT-FIN)은 무시할 수 있어 편집 화면이 단순해진다.

**OPTION_VALUE 예시 (ENUM + NUMERIC 혼합, v1.3 §11):**

| option_value_id | option_group_id | value_code | value_name | **value_type** | is_default | **numeric_min** | **numeric_max** | **enablement_condition** |
|:---:|:---:|------------|--------------|:---:|:---:|:---:|:---:|-----|
| 1 | 1 (OPT-LAY) | 1x1 | 단독 | ENUM | true | — | — | — |
| 2 | 1 (OPT-LAY) | 1x2 | 2연창 | ENUM | false | — | — | — |
| 3 | 1 (OPT-LAY) | 1x3 | 3연창 | ENUM | false | — | — | — |
| 4 | 1 (OPT-LAY) | 2x2 | 2×2 조합 | ENUM | false | — | — | — |
| 5 | 1 (OPT-LAY) | L-TYPE | L자 조합 | ENUM | false | — | — | — |
| 6 | 2 (OPT-CUT) | MITER | 사선절단 (45°) | ENUM | true | — | — | — |
| 7 | 2 (OPT-CUT) | BUTT | 직각절단 (90°) | ENUM | false | — | — | — |
| 8 | 2 (OPT-CUT) | MIXED | 혼합 절단 | ENUM | false | — | — | — |
| 20 | 7 (OPT-DIM-W) | — | 가로 치수(mm) | **NUMERIC** | — | 300 | 4000 | — |
| 21 | 7 (OPT-DIM-H) | — | 세로 치수(mm) | **NUMERIC** | — | 300 | 3000 | — |
| 22 | 8 (OPT-DIM-W1) | — | 1편 가로(mm) | **NUMERIC** | — | 200 | 2000 | `OPT-LAY == '1x2' OR OPT-LAY == '1x3'` |

- `is_default = true` 인 ENUM 값은 미선택 시 자동 적용.
- `numeric_min ≤ 입력값 ≤ numeric_max` 실시간 유효성 검증.
- `enablement_condition` FALSE 시 해당 NUMERIC 필드는 disable/hide.
- **NUMERIC 옵션값은 `optionsHash` 계산에서 제외** — 카디널리티 폭발 차단 (용어사전 v1.3 §13.1).

#### 5.6.2 BOM Rule 레이어 — "옵션 선택 시 BOM이 어떻게 변하는가" (v1.4 정합)

`BOM_RULE` 은 `when`(조건식) 으로 옵션 조합을 판별하고, `action`(SET/REPLACE/ADD/REMOVE) + 타깃·산식 필드로 **BOM에 수행할 변경**을 정의한다. v1.3 이전의 `BOM_RULE_ACTION` 별도 테이블은 폐기되었다.

**BOM_RULE 예시 (v1.4 — 4동사 단일 테이블, 5컬럼 확장 반영):**

| rule_id | product_id | rule_name | priority | when | action | target | formula/qty | scope_type | template_id | template_instance_id |
|:---:|:---:|------|:---:|------|------|------|------|------|------|------|
| 1 | 1 | 2연창 수평연결 추가 | 1 | `OPT-LAY == '1x2'` | `ADD` | CPL-HOR-001 | qty=1 | MASTER | TPL-ADD-BY-OPT | INST-0001 |
| 2 | 1 | 2연창 가스켓 추가 | 1 | `OPT-LAY == '1x2'` | `ADD` | CPL-GSK-001 | qty=1 | MASTER | TPL-ADD-BY-OPT | INST-0001 |
| 3 | 1 | 독립 우틀 제거 | 1 | `OPT-LAY == '1x2'` | `REMOVE` | FRM-RGT-001 | — | MASTER | TPL-ADD-BY-OPT | INST-0001 |
| 4 | 1 | 직각절단 로스율 세팅 | 2 | `OPT-CUT == 'BUTT'` | `SET` | FRM-TOP-001.lossRate | value=0.015 | MASTER | TPL-FORMULA-BY-RANGE | INST-0002 |
| 5 | 1 | 사선절단 로스율 세팅 | 2 | `OPT-CUT == 'MITER'` | `SET` | FRM-TOP-001.lossRate | value=0.04 | MASTER | TPL-FORMULA-BY-RANGE | INST-0002 |
| 6 | 1 | 로이유리 치환 (외측) | 3 | `OPT-GLZ == 'LOW-E'` | `REPLACE` | GLS-OUT-P1 → GLS-OUT-P1L | — | MASTER | TPL-ITEM-REPLACE-BY-OPT | INST-0003 |
| 7 | 1 | 로이유리 간봉 치환 | 3 | `OPT-GLZ == 'LOW-E'` | `REPLACE` | GLS-SPC-01 → GLS-SPC-02 | — | MASTER | TPL-ITEM-REPLACE-BY-OPT | INST-0003 |
| 8 | 1 | PVC 코너용접봉 | 4 | `OPT-CUT == 'MITER' AND OPT-MAT == 'PVC'` | `ADD` | MAT-WRD-PVC-001 | qty=1 | MASTER | — | — |
| 9 | 1 | 광폭 보강재 (가로≥2000) | 5 | `OPT-DIM-W >= 2000` | `ADD` | HDW-RNF-001 | qty=2 | MASTER | TPL-REINFORCE-SIZE | INST-0005 |
| 10 | 1 | 윈드클로저 추가 | 5 | `OPT-ACC.WIND_CLOSER == 'YES'` | `ADD` | HDW-WCL-001 | qty=2 | MASTER | TPL-ADD-BY-OPT | INST-0006 |

**포인트**:
- 동일 `template_instance_id` (예: INST-0001) 는 **논리적 1 단위**로 생성·삭제된다.
- Rule 1·2·3 은 `TPL-ADD-BY-OPT` 템플릿의 한 인스턴스가 3행으로 컴파일된 결과.
- Rule 9 는 NUMERIC 옵션(`OPT-DIM-W`)을 `>=` 연산자로 참조.
- `scope_type = 'ESTIMATE'` 오버레이 규칙은 동일 테이블에 `estimate_id` 외래키로 저장, RuleEngine resolve 시 MASTER 평가 후 ESTIMATE 오버레이 (Phase 2 ES 상세 설계에서 확정).

**`when` 평가 방식 (v1.4)**:

조건식은 간단한 DSL 이며 AST 로 파싱·캐시된다 (용어사전 v1.3 §13.1).

```
지원 연산자: ==, !=, AND, OR, >=, <=, >, <, IN
지원 옵션: ENUM 값(단순 문자열 비교), NUMERIC 값(관계 연산자 포함)

예시:
  OPT-LAY == '1x2'
  OPT-DIM-W >= 2000 AND OPT-DIM-W <= 3000
  OPT-CUT IN ('MITER', 'MIXED')
  OPT-GLZ == 'LOW-E' AND OPT-MAT != 'PVC'

평가 로직 (의사코드):
1. when → AST 파싱 (`wims-rule-engine` 모듈, 기동 시 warm-up; §NFR-MT-PM-001)
2. 사용자 선택 옵션 바인딩(selectedOptions: ENUM + NUMERIC 혼합)
3. AST 평가 → TRUE 인 규칙만 매칭
4. 매칭 규칙을 priority 오름차순 + 동등순위 내 REMOVE>REPLACE>SET>ADD 순으로 적용
5. 산식(SET action 의 qtyFormula/cutLengthFormula) 평가 → `*_evaluated` 스냅샷
```

**priority(우선순위) 처리**: priority 값이 낮을수록(1이 최우선) 먼저 적용. 동일 우선순위에서는 **REMOVE > REPLACE > SET > ADD** 순. 두 규칙의 조건 교집합이 비어있지 않으면서 동일 타깃에 경합 액션이면 **충돌**로 분류, 결정표 뷰(SCR-PM-013B §9.3.4.2) 에서 자동 감지한다.

#### 5.6.3 구성 선택 레이어 — "이 주문은 어떤 옵션 조합인가"

영업팀이 주문별로 옵션을 선택하면 PRODUCT_CONFIG + CONFIG_OPTION에 저장된다.

**PRODUCT_CONFIG 예시:**

| config_id | product_id | config_name | status |
|-----------|:---:|------|------|
| CFG-001 | 1 | 단독/사선/일반복층/PVC/백색 | RELEASED |
| CFG-002 | 1 | 2연창/직각/로이복층/AL/브라운 | RELEASED |
| CFG-003 | 1 | 3연창/사선/삼중유리/AL-TB/그레이 | DRAFT |

**CONFIG_OPTION 예시 (CFG-002의 선택 내역):**

| config_option_id | config_id | option_group_id | option_value_id |
|:---:|-----------|:---:|:---:|
| 1 | CFG-002 | 1 (OPT-LAY) | 2 (1x2) |
| 2 | CFG-002 | 2 (OPT-CUT) | 7 (BUTT) |
| 3 | CFG-002 | 3 (OPT-GLZ) | LOW-E |
| 4 | CFG-002 | 4 (OPT-MAT) | AL |
| 5 | CFG-002 | 5 (OPT-FIN) | BROWN |
| 6 | CFG-002 | 6 (OPT-ACC) | WC-YES |

status 흐름 (용어사전 v1.4 §4 — 정정): `DRAFT` → `RELEASED` → `DEPRECATED`
- **DRAFT**: 옵션 선택·편집 가능. Resolved BOM 은 편집 가능한 상태로 유지되며 MES 에 미노출.
- **RELEASED**: 확정(frozen) 처리. **`*_evaluated` · `actual_cut_length` · `rule_engine_version` 필드 불변**. MES 조회 가능 상태. 구조 변경 불가.
- **DEPRECATED**: 신규 바인딩 불가. 이력 조회 전용. 재평가가 필요한 경우 신규 `standardBomVersion` 으로 Resolved 를 새로 생성한 뒤 기존 행을 DEPRECATED 로 전환.

> [!warning] v1.4 정정 — 폐기된 상태 `RESOLVED`
> v1.3 이전의 `RESOLVED` 중간 상태는 폐기되었다. 해석 결과(Resolved BOM)가 저장되었다는 사실은 `status=DRAFT` 에서도 유효하므로 별도 상태로 관리할 필요가 없다. 대신 `frozen` 불리언과 `released_at` 타임스탬프로 확정 시점을 기록한다.

#### 5.6.4 Resolved BOM — "최종 확정 BOM" (DE24-1 v1.8 응답 DTO 정합)

시스템이 Base MBOM에 매칭된 Rule들의 Action을 순차 적용하고 산식을 평가하여 생성한 최종 BOM 스냅샷이다. **MES는 이 테이블만 조회한다.**

**RESOLVED_BOM 예시 (CFG-002, 절단 속성 8 신규 필드 포함):**

| resolved_bom_id | config_id | child_item_id | qty | cut_direction | cut_length_evaluated | cut_qty_evaluated | actual_cut_length | supply_division | frozen | item_category | rule_engine_version | rule_applied |
|:---:|----|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|------|
| 1 | CFG-002 | ASY-FRM-001 | 1 | — | — | — | — | 공통 | ✓ | — | UNIQUE_V1 | — |
| 2 | CFG-002 | FRM-TOP-001 | 1 | W | 1460 | 1 | 1481.9 | 공통 | ✓ | PROFILE | UNIQUE_V1 | 직각절단 로스율 세팅 |
| 3 | CFG-002 | CPL-HOR-001 | 1 | W | 1460 | 1 | 1481.9 | 공통 | ✓ | PROFILE | UNIQUE_V1 | 2연창 수평연결 추가 |
| 4 | CFG-002 | HDW-CAP-001 | 16 | — | — | 16 | — | 공통 | ✓ | HARDWARE | UNIQUE_V1 | 직각절단 로스율 세팅 |
| 5 | CFG-002 | GLS-OUT-P1L | 2 | — | — | 2 | — | 외창 | ✓ | GLASS | UNIQUE_V1 | 로이유리 치환 (외측) |
| 6 | CFG-002 | HDW-WCL-001 | 2 | — | — | 2 | — | 공통 | ✓ | HARDWARE | UNIQUE_V1 | 윈드클로저 추가 |

**신규 필드 설명 (DE24-1 v1.8)**:

| 필드 | 타입 | 의미 |
|------|------|------|
| `cut_direction` | enum | 절단 방향 (W/H/W1/H1/H2/H3). 프로파일 외 품목은 NULL |
| `cut_length_evaluated` | BIGDECIMAL | 1차 절단 길이 산식 평가값 (mm) |
| `cut_length_evaluated_2` | BIGDECIMAL | 2차 절단 길이(유리 세로 등) |
| `cut_qty_evaluated` | BIGDECIMAL | 절단 개수 평가값 |
| `actual_cut_length` | BIGDECIMAL | `cut_length_evaluated × (1 + lossRate)` |
| `supply_division` | enum | **공통 / 외창 / 내창** (`산식구분` 폐기 후 단일화 — 용어사전 v1.3 §3) |
| `frozen` | BOOLEAN | snapshot 불변 여부. TRUE 전환 이후 위 평가 필드 100% 불변 (§NFR-RL-PM-001) |
| `item_category` | enum | **PROFILE / GLASS / HARDWARE / CONSUMABLE / SEALANT / SCREEN** |
| `rule_engine_version` | String | 평가 엔진 버전(`UNIQUE_V1`) — V2 업그레이드 시 판정 근거 |

`rule_applied` 컬럼은 이 행이 **어떤 Rule 에 의해 추가/변경되었는지** 추적하기 위한 참조 필드이다. Base BOM 에서 변경 없이 그대로 온 행은 NULL 이다. `rule_applied` 는 `template_instance_id` 로도 역참조 가능.

**외부 API 조회 경로 (DE24-1 v1.8)**:
- `GET /api/external/v1/bom/resolved/{resolvedBomId}`
- 쿼리: `?supplyDivision=외창` (다층 제품 분리), `?itemCategory=PROFILE,GLASS` (카테고리 필터)
- 단방향 읽기 전용, `ROLE_MES_READER` 권한 필수.

#### 5.6.5 Resolved BOM을 별도 테이블에 저장하는 이유

매 조회 시 Rule을 실시간 재계산하는 방식 대신 Resolved BOM을 물리적으로 저장하는 설계를 채택하였다. 근거는 다음과 같다.

| # | 근거 | 설명 |
|---|------|------|
| 1 | **MES 응답 성능** | Rule 재계산 시 응답시간 2초(NFR-PF-PM-002) 초과 위험. 사전 계산된 테이블 조회가 빠름 |
| 2 | **이력 보존** | BOM Rule이 변경되더라도 기존 주문의 Resolved BOM은 그대로 유지. 과거 주문이 어떤 BOM으로 생산되었는지 추적 가능 |
| 3 | **검증 단계 분리** | 해석 결과를 담당자가 확인·검증한 뒤 Released 상태로 전환해야 MES에 노출. 실시간 계산은 이 검증 단계를 건너뛸 위험 |
| 4 | **캐시 효과** | Released 상태의 Resolved BOM은 변경 빈도가 낮으므로, API 캐싱(TTL 5분)과 조합하면 DB 부하 최소화 |

단, BOM Rule이 변경되었을 때 기존 DRAFT 상태의 Config는 **재해석(Re-Resolution)**이 필요하며, Released 상태의 Config에 대해서는 변경 영향도 알림을 제공한다.

---

## 6. BOM 해석(Resolution) 프로세스 (v1.4 — frozen 전환 트리거 명시)

사용자가 제품 구성(옵션 조합)을 선택하면, 시스템이 Base BOM 에 BOM_RULE 을 순차 적용하고 산식을 평가하여 최종 BOM(Resolved BOM) 을 자동 생성한다.

**STEP 1. 옵션 선택**
→ 설치구성·절단방식·유리사양·프레임재질·색상·부속 + **NUMERIC 옵션(치수 W/H/W1/H1/H2/H3)** 입력
→ `enablement_condition` FALSE 인 NUMERIC 필드는 disable

**STEP 2. Base BOM 로드**
→ Base EBOM + Base MBOM + 해당 `standardBomVersion` 의 `BOM_RULE` (scope_type='MASTER') 로드

**STEP 3. Rule 매칭 및 적용 (우선순위순)**
→ `when` 조건식 AST 평가 (warm-up 된 AST 캐시 사용, §NFR-MT-PM-001)
→ 매칭 규칙 priority 오름차순 + 동점 순위 내 REMOVE > REPLACE > SET > ADD 순
→ 충돌 감지 시 경고 표시 (결정표 뷰 SCR-PM-013B §9.3.4.2 와 동일 알고리즘)

**STEP 4. 산식 평가 및 Resolved BOM 생성**
→ `SET` action 의 `cutLengthFormula/cutLengthFormula2/cutQtyFormula/lossRate` 산식을 `UNIQUE_V1` 엔진으로 평가
→ 평가 결과를 `cut_length_evaluated*`, `cut_qty_evaluated`, `actual_cut_length` 에 스냅샷
→ `supply_division`, `item_category`, `rule_engine_version` 기록
→ `frozen = FALSE` 로 저장 (아직 DRAFT 상태)

**STEP 5. 검증 및 확정 (frozen 전환)**
→ 부품 누락 검증, 수량 정합성 검증, 담당자 확인
→ **frozen 전환 트리거 3종** (용어사전 v1.4 §4):
  - **T1 — 견적서 CONFIRMED**: 견적이 고객 승인되면 관련 Resolved BOM 자동 frozen
  - **T2 — 작업지시 RELEASED**: MF 서브시스템이 작업지시서를 발행하면 자동 frozen
  - **T3 — PM UI 명시적 "확정" 버튼**: PM 관리자가 Resolved 편집 화면에서 수동 확정
→ 전환 즉시 `frozen=TRUE`, `status=RELEASED`, DB 트리거로 `*_evaluated` 필드 UPDATE 차단 (§NFR-RL-PM-001)
→ `BOM_RULE_HISTORY` 에 `event_type=RELEASE` 이벤트 기록

**재평가 금지 원칙**: `frozen=TRUE` 이후에는 RuleEngine 버전 업그레이드·BOM_RULE 상수 변경 시에도 재평가하지 않는다. 재평가가 필요하면 기존 Resolved 를 `DEPRECATED` 로 전환하고 신규 `standardBomVersion` 에 대한 신규 Resolved 를 생성한다. 이력은 완전 보존된다.

---

## 7. 새로운 BOM 구성 업무 절차

이 장은 하나의 새로운 제품에 대해 BOM을 처음부터 구성하여 MES에 전달하기까지의 **전체 업무 순서**를 설명한다. 각 단계별로 담당자, 사용 화면, 전제조건, 산출물, 다음 단계 전환 조건을 명시한다.

### 7.0 전제조건 — 마스터 데이터 사전 준비

BOM 구성을 시작하기 전에 아래 마스터 데이터가 등록되어 있어야 한다. 이 데이터가 없으면 BOM 트리에 노드를 배치할 수 없다.

| # | 마스터 데이터 | 담당 | 등록 화면 | 설명 |
|---|-------------|------|----------|------|
| 1 | **자재 마스터** | 설계팀/자재팀 | SCR-PM-001~004 | BOM에 배치할 원자재·부자재가 등록되어 있어야 함 (자재코드, 규격, 분류) |
| 2 | **공정 마스터** | 생산팀 | SCR-PM-007~009 | MBOM에 공정코드를 배정하려면 공정이 사전 등록되어 있어야 함 (공정코드, 유형, 작업장) |
| 3 | **거래처·단가** (선택) | 구매팀 | SCR-PM-005~006 | 원가 시뮬레이션이 필요한 경우 거래처별 단가가 등록되어 있어야 함 |

> **실무 팁:** 자재 마스터와 공정 마스터는 제품 등록과 병행하여 점진적으로 추가할 수 있다. 다만 EBOM 확정(STEP 3) 전까지 해당 제품에 사용되는 자재가 모두 등록되어야 하고, MBOM 편집(STEP 4) 전까지 공정이 등록되어야 한다.

### 7.1 전체 흐름 요약

```
┌─────────────────────────────────────────────────────────────────┐
│                  사전 준비 (마스터 데이터)                        │
│     자재 등록 (SCR-PM-001~004)  ·  공정 등록 (SCR-PM-007~009)   │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
              STEP 1. 제품 기본정보 등록
              (SCR-PM-011, 설계팀/영업팀)
                           │
                           ▼
              STEP 2. EBOM 등록 — 자재 구성
              (SCR-PM-013 EBOM 모드, 설계팀)
                           │
                           ▼
              STEP 3. EBOM 확정 (승인)
              (SCR-PM-014, 설계팀 리더)
                           │
                    ┌──────┴──────┐
                    ▼             │
            [MBOM 초안 자동 생성]  │
                    │             │
                    ▼             │
              STEP 4. MBOM 편집 — 공정 구성
              (SCR-PM-013 MBOM 모드, 생산팀)
                           │
                           ▼
              STEP 5. 옵션 그룹/값 정의
              (SCR-PM-013B 옵션 그룹 관리, 설계팀)
                           │
                           ▼
              STEP 6. BOM Rule 정의
              (SCR-PM-013B 옵션별 규칙 관리, 설계팀)
                           │
                           ▼
              STEP 7. 옵션 구성 생성 및 BOM 해석
              (SCR-PM-013B 옵션 구성 목록, 영업팀/설계팀)
                           │
                           ▼
              STEP 8. 확정 구성표 검증 및 MES 전달
              (SCR-PM-013B 확정 구성표, 생산팀 리더)
                           │
                           ▼
                    MES 조회 가능
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 각 단계 상세

---

#### STEP 1. 제품 기본정보 등록

| 항목 | 내용 |
|------|------|
| **담당자** | 설계팀 또는 영업팀 |
| **사용 화면** | SCR-PM-011 (제품 등록) |
| **전제조건** | 없음 (가장 첫 단계) |
| **산출물** | PRODUCT 레코드 생성 (product_code, product_name, product_type, status=DRAFT) |
| **다음 단계 전환 조건** | 제품코드 자동 생성 완료, 필수 항목(제품명, 유형, 분류) 입력 완료 |

**수행 내용:**
1. 제품 분류체계 선택 — 카테고리(미서기/프로젝트/시스템 등), 등급, 재질, 단열 등급
2. 제품 코드 자동 생성 — 분류 기반 코드 부여 (FR-PM-015)
3. 제품 메타정보 입력 — 제품명, 규격(W×H), 설명, 적용 현장 등
4. 저장 → 제품 상세 화면(SCR-PM-012)으로 이동

> 이 시점에서 제품은 DRAFT 상태이며, BOM 탭에 진입할 수 있지만 아직 빈 트리 상태이다.

---

#### STEP 2. EBOM 등록 — 자재 구성 (설계 관점)

| 항목 | 내용 |
|------|------|
| **담당자** | 설계팀 |
| **사용 화면** | SCR-PM-013 BOM 트리뷰 (BOM 유형: **자재 구성(EBOM)**) |
| **전제조건** | STEP 1 완료 (제품 레코드 존재), 사용할 자재가 자재 마스터에 등록됨 |
| **산출물** | EBOM 트리 구조 (version=v1, status=DRAFT) |
| **다음 단계 전환 조건** | 모든 기능군(L1)과 하위 부품(L2~L3)이 배치되고, 설계 수량이 입력됨 |

**수행 내용:**
1. 제품 상세(SCR-PM-012) > [BOM] 탭 진입 > BOM 유형을 **자재 구성(EBOM)**으로 선택
2. **기능군(Level 1) 생성** — 구조부, 유리부, 개폐부, 밀봉부, 방충부 등 기능 단위 노드 추가
3. **부품 배치(Level 2~3)** — 좌측 자재 검색 패널에서 자재를 찾아 해당 기능군 하위로 드래그&드롭
4. **설계 수량 입력** — 각 부품의 이론 소요량을 노드 상세 패널에서 입력
5. **대체 부품 등록** (선택) — 호환 가능 부품 관계 설정 (예: 투명유리 ↔ 로이유리)
6. **검증** — 누락 부품 여부 확인, 수량 정합성 확인
7. **버전 저장** — [버전 저장] 클릭 → EBOM v1 (DRAFT) 생성

> **핵심:** EBOM에서는 공정코드, 작업순서, 로스율을 입력하지 않는다. 순수하게 "이 제품이 어떤 부품들로 구성되는가"만 정의한다.

---

#### STEP 3. EBOM 확정 (승인)

| 항목 | 내용 |
|------|------|
| **담당자** | 설계팀 리더 (검토/승인 권한) |
| **사용 화면** | SCR-PM-014 (BOM 버전 관리) |
| **전제조건** | STEP 2 완료 (EBOM DRAFT 버전 존재) |
| **산출물** | EBOM 상태 APPROVED 전환, **MBOM 초안 자동 생성** |
| **다음 단계 전환 조건** | EBOM 버전 상태가 APPROVED 이상 |

**수행 내용:**
1. SCR-PM-014에서 [자재 구성 버전] 탭 진입
2. DRAFT 버전 선택 → [상태 변경] 드롭다운
3. **DRAFT → UNDER_REVIEW** — 검토 요청 (검토자에게 알림 발송)
4. 검토자가 BOM 내용 확인 후 **UNDER_REVIEW → APPROVED** — 승인 처리
5. **APPROVED 전환 시 시스템 자동 동작:**
   - EBOM 구조를 기반으로 **MBOM 초안 자동 생성** (기능군 → 조립체 매핑 템플릿 적용)
   - EBOM↔MBOM 초기 매핑 관계 자동 생성
   - 생산팀에 "MBOM 편집 가능" 알림 발송

> **자동 생성 규칙:** EBOM의 기능군(구조부, 유리부 등)이 MBOM의 조립체(창틀, 외측 창짝 등)로 변환된다. 변환 템플릿은 제품유형별로 사전 정의되어 있으며, 부품(L2~L3)은 해당 조립체 하위에 자동 배치된다.

---

#### STEP 4. MBOM 편집 — 공정 구성 (제조 관점)

| 항목 | 내용 |
|------|------|
| **담당자** | 생산팀 |
| **사용 화면** | SCR-PM-013 BOM 트리뷰 (BOM 유형: **공정 구성(MBOM)**) |
| **전제조건** | STEP 3 완료 (MBOM 초안이 자동 생성됨), 공정이 공정 마스터에 등록됨 |
| **산출물** | MBOM 트리 구조 (공정·로스율·실소요량 포함) |
| **다음 단계 전환 조건** | 모든 조립체에 공정코드·작업순서가 배정되고, 부품에 로스율이 설정됨 |

**수행 내용:**
1. 제품 상세(SCR-PM-012) > [BOM] 탭 > BOM 유형을 **공정 구성(MBOM)**으로 전환
2. **조립체 구조 확인/재구성** — 자동 생성된 MBOM 초안의 조립체 계층을 확인하고, 필요 시 노드 이동/추가/삭제
3. **공정코드 배정** — 각 노드의 상세 패널에서 공정 드롭다운 선택 (예: PRC-CUT-M45, PRC-WLD-CNR)
4. **작업순서 설정** — 조립체(L1) 간 작업순서를 숫자로 지정 (창틀→외측창짝→내측창짝→하드웨어→기밀→방충)
5. **로스율 입력** — 부품별 절단/조립 손실률 입력 (DE35-1 부록 B 참조, 일괄 설정 기능 활용 가능)
6. **실소요량 자동 계산 확인** — 이론수량 × (1 + 로스율)이 자동 계산됨
7. **작업장 배정** — 각 조립체가 어떤 작업장(WC-FRAME, WC-SASH 등)에서 처리되는지 설정
8. **EBOM↔MBOM 매핑 확인** — [자재↔공정 연결] 버튼으로 매핑 관계 확인/편집 (미매핑 노드 빨간색 경고)
9. **버전 저장** — MBOM v1 (DRAFT) 저장

> **핵심:** MBOM은 EBOM과 동일한 부품을 다루되, 제조 관점(조립체 단위, 공정, 로스율)을 추가한다. EBOM 변경 시 영향받는 MBOM 노드가 자동 하이라이트된다.

---

#### STEP 5. 옵션 그룹/값 정의

| 항목 | 내용 |
|------|------|
| **담당자** | 설계팀 (생산팀 협의) |
| **사용 화면** | SCR-PM-013B > **[옵션 그룹 관리]** 서브탭 |
| **전제조건** | STEP 2, 4 완료 (Base EBOM + Base MBOM이 존재) |
| **산출물** | OPTION_GROUP + OPTION_VALUE 레코드, 옵션 제약 조건 |
| **다음 단계 전환 조건** | 모든 필수 옵션 그룹(6개)이 정의되고, 각 그룹에 1개 이상 선택지가 등록됨 |

**수행 내용:**
1. 제품 상세(SCR-PM-012) > [자재/공정 구성] 탭 > [옵션 구성] > **[옵션 그룹 관리]** 서브탭 진입
2. **옵션 그룹 등록** — 6개 옵션 차원 정의 (설치구성, 절단방식, 유리사양, 프레임재질, 색상, 부속)
   - 각 그룹에 필수 여부(is_required)와 적용 대상(BOTH/MBOM) 설정
3. **옵션 값 등록** — 각 그룹의 선택 가능한 값 등록 (예: OPT-LAY → 1x1, 1x2, 1x3, 2x2, L-TYPE)
   - 기본값(is_default) 지정 (예: OPT-LAY의 기본값 = 1x1 단독)
4. **옵션 제약 조건 설정** — 무효한 옵션 조합을 사전 차단하는 규칙 등록
   - 상호 배타: L-TYPE → BUTT만 허용
   - 필수 종속: 2x2 → AL 필수
   - 기본값 연동: 연창 → 윈드클로저 기본 YES

> **주의:** 옵션 그룹/값은 Base BOM의 변형 가능 범위를 정의하는 것이다. 이 단계에서는 아직 BOM에 어떤 변경이 적용되는지(Rule)는 정의하지 않는다.

---

#### STEP 6. BOM Rule 정의

| 항목 | 내용 |
|------|------|
| **담당자** | 설계팀 (생산팀 협의) |
| **사용 화면** | SCR-PM-013B > **[옵션별 규칙 관리]** 서브탭 |
| **전제조건** | STEP 5 완료 (옵션 그룹/값 정의됨) |
| **산출물** | BOM_RULE 레코드 (`action_json` 4동사 통합) |
| **다음 단계 전환 조건** | 모든 옵션 값에 대응하는 Rule이 등록되고, 시뮬레이션 검증 통과 |

**수행 내용:**
1. **[옵션별 규칙 관리]** 서브탭 진입
2. **규칙 추가** — [+ 규칙 추가] 버튼으로 규칙 생성
   - 규칙명 입력 (예: "2연창 연결프레임 추가")
   - 조건식 작성 (예: `OPT-LAY = '1x2'`)
   - BOM 유형 선택 (EBOM / MBOM / BOTH)
   - 우선순위 설정
3. **액션 정의** — 규칙 상세 펼침 > [+ 액션 추가]
   - 액션 유형 선택: SET / REPLACE / ADD / REMOVE (용어사전 v1.4 §13.2 4동사 공식 스키마. 구 `QTY_CHANGE`·`LOSS_CHANGE` 는 `SET` + `cutQtyFormula`/`lossRate` 산식으로 흡수)
   - 대상 품목, 신규 품목, 수량/비율 입력
4. **규칙 반복 등록** — 모든 옵션 조합에 대해 필요한 BOM 변경 규칙을 등록
5. **시뮬레이션 검증** — 대표적인 옵션 조합으로 BOM 변경 미리보기를 확인하여 규칙이 올바르게 동작하는지 검증
6. **충돌 확인** — 동일 품목에 상충하는 액션이 있는지 확인, 우선순위 조정

> **설계 원칙:** STEP 5에서 "무엇을 선택할 수 있는가"를 정의했다면, STEP 6에서는 "선택 시 BOM이 어떻게 변하는가"를 정의한다. 이 두 단계는 밀접하게 연관되므로 병행 작업이 가능하다.

---

#### STEP 7. 옵션 구성 생성 및 BOM 해석

| 항목 | 내용 |
|------|------|
| **담당자** | 영업팀 또는 설계팀 |
| **사용 화면** | SCR-PM-013B > **[옵션 구성 목록]** 서브탭 |
| **전제조건** | STEP 6 완료 (BOM Rule 정의됨) |
| **산출물** | PRODUCT_CONFIG + CONFIG_OPTION 레코드, RESOLVED_BOM (status=RESOLVED) |
| **다음 단계 전환 조건** | Resolved BOM이 생성되고, 부품 누락/수량 정합성 검증을 통과 |

**수행 내용:**
1. **[옵션 구성 목록]** 서브탭 > [+ 옵션 구성 추가] 클릭
2. **옵션 선택** — 모달에서 6개 옵션 차원의 값을 선택
   - 필수 옵션 5개 + 선택 옵션 1개
   - 옵션 제약 조건 실시간 검증 (위반 시 선택 불가)
3. **BOM 변경 미리보기 확인** — 선택한 옵션에 따라 적용될 Rule 목록과 BOM 변경 내역을 확인
4. **[옵션 구성 추가]** 클릭 → PRODUCT_CONFIG 레코드 생성 (status=DRAFT)
5. **BOM 해석(Resolution) 실행** — 시스템이 자동으로:
   - Base EBOM + Base MBOM 로드
   - 매칭된 Rule을 우선순위 순으로 적용
   - Resolved EBOM + Resolved MBOM 생성
6. **검증** — 부품 누락 검증, 수량 정합성 검증 → 통과 시 status=RESOLVED 자동 전환

> **반복 가능:** 하나의 제품에 대해 여러 옵션 구성(CFG-001, CFG-002, ...)을 생성할 수 있다. 예를 들어 "단독/사선/일반/PVC/백색"과 "2연창/직각/로이/AL/브라운"은 별도의 옵션 구성이다.

---

#### STEP 8. 확정 구성표 검증 및 MES 전달

| 항목 | 내용 |
|------|------|
| **담당자** | 생산팀 리더 (MES 전달 권한) |
| **사용 화면** | SCR-PM-013B > **[확정 구성표 미리보기]** |
| **전제조건** | STEP 7 완료 (RESOLVED 상태의 옵션 구성 존재) |
| **산출물** | RELEASED 상태의 옵션 구성, MES에서 조회 가능한 확정 구성표 |
| **다음 단계 전환 조건** | — (최종 단계) |

**수행 내용:**
1. **확정 구성표 검토** — Resolved BOM 트리에서 Base BOM 대비 변경 사항 확인 (색상 코딩: 추가/제거/대체/변경)
2. **소요량 요약 확인** — [소요량 요약 (플랫)] 버튼으로 전체 자재 소요량 테이블 확인
3. **Base BOM 비교** — [Base BOM과 비교] 버튼으로 원본 대비 차이 검토
4. **상태 변경** — [MES 전달] 버튼 클릭
   - RESOLVED → RELEASED 상태 전환
   - 확인 다이얼로그 표시 (Released 후 되돌릴 수 없음 안내)
5. **MES 연동 활성화** — RELEASED 상태의 확정 구성표가 MES REST API에 노출됨
   - MES는 `/bom/products/{code}/configs/{id}/resolved` 엔드포인트로 조회

> **변경 관리:** Released 후 BOM 변경이 필요한 경우, 기존 버전을 ARCHIVED 처리하고 새 버전의 BOM을 생성하여 STEP 2부터 다시 진행한다. BOM Rule만 변경된 경우, 해당 Config의 재해석(Re-Resolution)으로 STEP 7부터 다시 진행할 수 있다.

### 7.3 단계별 역할 및 화면 매핑 요약

| 단계 | 담당자 | 화면 | 주요 입력 | 주요 산출물 | 상태 전이 |
|------|--------|------|----------|-----------|----------|
| 사전준비 | 자재팀/생산팀 | SCR-PM-001~009 | 자재코드, 공정코드 | 자재 마스터, 공정 마스터 | — |
| STEP 1 | 설계팀/영업팀 | SCR-PM-011 | 제품명, 유형, 분류 | PRODUCT (DRAFT) | — |
| STEP 2 | 설계팀 | SCR-PM-013 (EBOM) | 기능군, 부품, 수량 | EBOM 트리 (DRAFT) | — |
| STEP 3 | 설계팀 리더 | SCR-PM-014 | 검토/승인 | EBOM (APPROVED) + MBOM 초안 | DRAFT→APPROVED |
| STEP 4 | 생산팀 | SCR-PM-013 (MBOM) | 공정, 작업순서, 로스율 | MBOM 트리 (DRAFT) | — |
| STEP 5 | 설계팀 | SCR-PM-013B (옵션 그룹) | 옵션 차원, 값, 제약 | OPTION_GROUP, OPTION_VALUE | — |
| STEP 6 | 설계팀 | SCR-PM-013B (규칙) | 조건식, 액션 | BOM_RULE (`action_json` 4동사) | — |
| STEP 7 | 영업팀/설계팀 | SCR-PM-013B (구성 목록) | 옵션 조합 | RESOLVED_BOM | DRAFT→RESOLVED |
| STEP 8 | 생산팀 리더 | SCR-PM-013B (확정 구성표) | 검증/승인 | MES 연동 활성화 | RESOLVED→RELEASED |

### 7.4 단계 간 의존관계 및 병행 가능 여부

```
STEP 1 ──→ STEP 2 ──→ STEP 3 ──→ STEP 4
                                     │
              STEP 5 ◄───────────────┤  (STEP 4와 STEP 5는 병행 가능)
                │                    │
                ▼                    │
              STEP 6 ◄───────────────┘  (STEP 4 완료 후 STEP 6 가능)
                │
                ▼
              STEP 7 ──→ STEP 8
```

- **STEP 1→2→3**: 순차 필수. 제품이 있어야 EBOM을 만들고, EBOM이 확정되어야 MBOM 초안이 생성된다.
- **STEP 4와 STEP 5**: 병행 가능. MBOM 편집과 옵션 그룹/값 정의는 독립적으로 진행할 수 있다.
- **STEP 6**: STEP 4(MBOM 편집)와 STEP 5(옵션 정의) 모두 완료 후 진행. Rule의 액션이 MBOM 노드를 참조하고, 조건식이 옵션 값을 참조하기 때문이다.
- **STEP 7→8**: 순차 필수. Resolved BOM이 생성된 후에야 확정·MES 전달이 가능하다.

---

## 8. 화면 구성 요약 (v1.4 — UI 용어 표준 + 3뷰 체계)

> [!info] UI 표기 용어 표준 (용어사전 v1.4 §2)
> 기술 용어와 화면 라벨을 구분한다. DB·API 에서는 기술 용어를, 사용자 화면에서는 **한글 표준 라벨**을 사용한다.
>
> | 기술 용어 | UI 라벨 | 화면 |
> |----|----|----|
> | EBOM | **자재구성** | SCR-PM-013 |
> | MBOM | **공정구성** | SCR-PM-013 |
> | Config | **옵션구성** | SCR-PM-013B |
> | BOM_RULE | **옵션별규칙** | SCR-PM-013B (3뷰 체계) |
> | Resolved BOM | **확정구성표** | SCR-PM-013B §9.3.4.3 |

### 8.1 자재구성(EBOM) 편집 화면 — SCR-PM-013

좌측에 **기능군 기반 트리** (구조부 > 상틀, 하틀... / 유리부 > 복층유리...), 우측에 **부품 상세 패널** (사양 정보, 대체 부품 관계). 설계팀이 부품을 기능 단위로 정의하고 사양을 확정하는 화면이다. 옵션 영향을 받는 품목은 보라색 태그로 표시한다.

### 8.2 공정구성(MBOM) 편집 화면 — SCR-PM-013

좌측에 **조립체 기반 트리** (창틀조립체 > 상틀, 하틀, 연결프레임... / 외측창짝조립체 > ...), 우측에 **제조 상세 패널** (공정 흐름도, 로스율 게이지, 실소요량 테이블). 상단에 **옵션 구성 바** (적용된 옵션 칩 표시). 옵션에 의해 추가된 부품은 녹색, 로스율은 빨간색으로 구분 표시한다.

### 8.3 옵션별규칙(BOM_RULE) 관리 화면 — SCR-PM-013B **3뷰 체계** (BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived))

v1.3 이전의 단일 "옵션 구성 화면" 을 **3뷰 체계**로 재구성하였다. 동일한 BOM_RULE 집합을 세 가지 관점으로 제공하여 사용자의 숙련도·작업 맥락에 맞추어 선택 진입할 수 있게 한다. 모든 뷰에 **시뮬레이터 사이드 패널**이 공통 장착된다.

| 뷰 | 화면 섹션 | 대상 사용자 | 진입 상황 | 핵심 기능 |
|----|----|----|----|----|
| 📋 **템플릿 갤러리** | §9.3.4.1 | 견적 담당자 / 신규 사용자 (초급) | "규칙을 새로 만들고 싶다" | 빌트인 6종 템플릿 카드, 드롭다운·숫자 입력만으로 인스턴스 생성, 승격 마법사(전문가→템플릿) |
| 📊 **결정표** | §9.3.4.2 | PM 관리자 / 조감 필요 (중급) | "전체 규칙 상태·충돌을 보고 싶다" | 행=BOM_RULE 1행, 열=OPTION_GROUP + 액션 요약, 동일 `template_instance_id` 묶음 표시, 충돌·공백(gap) 자동 감지 |
| ⚙️ **전문가** | §9.3.4.3 | PM 관리자 (숙련) | "템플릿으로 표현 안 되는 복잡 규칙" | `when` DSL 직접 편집, AST 파서 문법 하이라이팅, 복잡 `action` 편집 (SET 산식 조합 등) |
| 🧪 **시뮬레이터 패널** | §9.3.4.4 | 전 뷰 공통 | "가상 옵션으로 결과 미리보기" | 옵션 조합 입력 → 매칭 규칙 리스트(기각 포함 사유), Base 대비 MBOM diff, 경고 목록. DB 저장 없음 (evaluate-only, `POST /api/pm/rules/simulate`) |

**공통 사이드바**: 편집 중 규칙의 저장 이력 (BOM_RULE_HISTORY), 우선순위 재정렬 드래그, `scope_type` 전환(MASTER↔ESTIMATE).

### 8.4 확정구성표(Resolved BOM) 조회 화면 — SCR-PM-013B §9.3.4.3

8개 신규 절단 속성(cutDirection, cutLength, cutLength2, cutQty, actualCutLength, supplyDivision, frozen 🔒, itemCategory) 테이블 표시. **frozen=TRUE 행은 🔒 아이콘 + 읽기 전용 배경색**. 상단 탭으로 `supply_division ∈ {공통/외창/내창}` 전환, `item_category` 다중 선택 필터. 엑셀 다운로드는 8개 속성 포함.

---

## 9. MES 연동 영향 (v1.4 — DE24-1 v1.8 정합)

핵심 원칙: **MES 는 Resolved BOM(`/api/external/v1/bom/resolved/{resolvedBomId}`) 만 조회**하며, Base BOM·EBOM·BOM_RULE 편집 엔드포인트에는 접근하지 않는다. **단방향 읽기 전용** — POST/PUT/DELETE 미제공.

| No | 항목 | 영향 및 대응 |
|----|------|--------------|
| 1 | 연동 대상 | 단일 BOM 뷰 → `RESOLVED_BOM` API 로 변경. v1.3 의 `/cutting-bom/{cuttingBomKey}` 신설안은 철회(용어사전 v1.3 §13 금지어 `CuttingBOM`). |
| 2 | 응답 DTO | **8 신규 필드** 추가 (cutDirection, cutLength, cutLength2, cutQty, actualCutLength, supplyDivision, frozen, itemCategory) — DE24-1 v1.8 §3. MES 는 필요에 따라 사용. |
| 3 | 쿼리 파라미터 | `?supplyDivision={공통/외창/내창}` 다층 제품 분리 조회, `?itemCategory=PROFILE,GLASS` 자재 카테고리 필터, `?debug=true` 진단 모드 |
| 4 | 공정 매핑 | MBOM 의 `processCode` + `workCenter` 를 MES 뷰에 포함. MES 팀과 코드 체계 합의 완료 (DE24-1 §2.4). |
| 5 | 실소요량 | `cutQtyEvaluated`·`actualCutLength` 로 통합 제공. MES 는 `actualCutLength` 기준 자재 불출. `산식구분` 폐기 후 `supplyDivision` 단일화. |
| 6 | 버전·불변성 | **`frozen=TRUE` 전환 후 모든 평가 필드 불변** (NFR-RL-PM-001). MES 가 이미 수신한 스냅샷이 시스템에서 조용히 변경되는 상황을 원천 차단. DRAFT 상태는 MES 미노출. |
| 7 | 권한 | `ROLE_MES_READER` 서비스 계정. 외부 경로(`/api/external/v1/**`) 만 허용. |
| 8 | 에러 처리 | DE24-1 v1.8 에 2종 신규 추가 — `422 RESOLVED_NOT_FROZEN` (DRAFT 상태 조회 차단), `410 RESOLVED_DEPRECATED` (DEPRECATED 에는 후속 가이드 URL 제공). |
| 9 | 하위 호환성 | 기존 필수 항목(품목코드, 품목명, Level, 수량, 단위) 동일 제공으로 호환 유지. 8 신규 필드는 선택적 확장. |

---

## 10. 향후 과제 (v1.4 — 착수 상태 갱신)

| No | 과제 | 상태 (2026-04-21 기준) | 설명 |
|----|------|----|------|
| 1 | ECO/MCO 프로세스 | 📝 Phase 1 후반 | EBOM 변경(ECO) → MBOM 영향도 자동 분석 → MCO 발행 프로세스 상세 설계 |
| 2 | BOM_RULE 편집기 | ✅ **해결** — FR-PM-025~027 (v1.1-r1) | 3뷰 체계(📋 템플릿 갤러리 / 📊 결정표 / ⚙️ 전문가) + 시뮬레이터 패널. BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived). S2~S3 구현 착수 예정 |
| 3 | 옵션 유효성 검증 | ✅ **해결** — FR-PM-020 (v1.1) | NUMERIC 옵션 `enablement_condition`, `numeric_min/max` 실시간 검증 |
| 4 | MBOM 템플릿 | ✅ **해결** — RULE_TEMPLATE 엔티티 (용어사전 v1.4 §13.3) | 빌트인 6종 제공(TPL-REINFORCE-SIZE / TPL-CUT-DIRECTION / TPL-ITEM-REPLACE-BY-OPT / TPL-FORMULA-BY-RANGE / TPL-ADD-BY-OPT / TPL-DERIVATIVE-DIFF). Flyway 시드로 배포 |
| 5 | 권한 체계 | ✅ **해결** — DE11-1 §3 (RBAC) | ROLE_PM_ADMIN(전문가 뷰 + 템플릿 승격), ROLE_PM_VIEWER(시뮬레이터 조회), ROLE_MES_READER(외부 Resolved 전용) |
| 6 | 대량 등록 / Rule Import | 📝 Phase 2 | 엑셀 업로드 기반 일괄 등록 — BOM_RULE_HISTORY 감사 필드와 정합 필요 |
| 7 | 보고서 | 📝 Phase 2 | EBOM 부품표, MBOM 작업지시서, Resolved BOM 비교표, 옵션별 원가 시뮬레이션 |
| 8 | 버전 이력 UI | ⚠️ **범위 축소** — 단일 `standardBomVersion` 단축 (§3.5) | 4요소 독립 버전 관리가 폐기되었으므로 "버전 연결 추적" 은 불필요. 대신 BOM_RULE_HISTORY 타임라인 UI 로 대체 |
| 9 | 파생제품·4계층 분류·다이스북 | ✅ **해결** — FR-PM-018/019/023 (v1.1) | DE35-1 v1.5 / 용어사전 §9·§14·§15 에서 상세 — 본 부록 D 범위 외 |
| 10 | scope_type=ESTIMATE 오버레이 | 📝 Phase 2 ES 상세 설계 | 견적 예외 규칙의 MASTER 오버레이 평가 — Resolve 순서·권한 검증 |

> 📝 = 미착수 / ⚠️ = 범위 변경 / ✅ = 해결 또는 설계 완료

---

## 11. 관련 산출물 (v1.4 갱신)

| 산출물 | 형식 | 설명 |
|--------|------|------|
| [[WIMS_용어사전_BOM_v1.4]] | Markdown | **BOM 도메인 용어사전 v1.4 (최신)** — 엔티티·BOM_RULE 스키마·금지어·RULE_TEMPLATE/BOM_RULE_HISTORY 정식 정의. 본 부록 D 의 전제 문서 |
| [[DE35-1_미서기이중창_표준BOM구조_정의서_v1.5]] | Markdown | **DE35-1 v1.5-r2 (최신)** — 표준 BOM 3-튜플·BOM_RULE 확장·템플릿 컴파일 반영. 본 부록 D 의 본문 |
| [[DE32-1_BOM도메인_ER다이어그램_v1.2]] | Markdown | DE32-1 v1.1 — BOM 도메인 통합 ER 다이어그램(엔티티 19 + BOM_RULE 5컬럼 + RULE_TEMPLATE·BOM_RULE_HISTORY) |
| [[DE24-1_인터페이스설계서_MES_REST_API_v1.8]] | Markdown | DE24-1 v1.8 — MES REST API 응답 DTO 8 신규 필드·쿼리·에러 스펙 |
| [[DE11-1_소프트웨어_아키텍처_설계서_v1.2]] | Markdown | DE11-1 v1.3 — RuleEngine §11, 템플릿 컴파일러 §11.7, 시뮬레이터 §11.8, 결정표 §11.9 |
| [[DE22-1_화면설계서_v1.5]] | Markdown | DE22-1 v1.5-r2 — 28 화면, §9.3.4 옵션별규칙 3뷰 체계 |
| BOM-RULE-UI 스펙 (v1-r1, 2026-04-16, archived) | Markdown | BOM 옵션별규칙 관리 UI 3뷰 체계 설계 스펙 |
| [[AN12-1_요구사항정의서_Phase1_v1.1]] | Markdown | AN12-1-P1 v1.1-r1 — FR-PM-018~027, NFR-PF/RL/MT-PM 신규 |
| DE35-1_부록D_EBOM_MBOM_분리구성_개념설계서.docx | Word | 정식 개념 설계서 (docx 산출물, v1.4 반영 예정) |
| EBOM·MBOM·옵션구성_편집화면_UI목업.html | HTML | 초기 UI 목업 (3뷰 체계 도입 전 버전 — 참고용) |

---

## 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0 | 2026.03.23 | 코드크래프트 | 최초 작성 — EBOM/MBOM 분리 개념 |
| v1.1 | 2026.03.24 | 코드크래프트 | 구성형 BOM 관리 추가 (옵션 차원, BOM Rule, 해석 프로세스, 제약 조건, 화면 구성 요약) |
| v1.2 | 2026.04.14 | 코드크래프트 | DHS-AE225-D-1 BOM 정리 확정 반영 — §4.2.1 EBOM↔MBOM 1:N 실제 매핑 사례 추가, §5.1.1 위치 인스턴스 분할 운용 방식 및 실제 사례 추가; §5.1.1 `position_code` → `location_code` 필드명 통일 (DE11-1/DE24-1 정합), 제목·소제목 "확정" 표현 → "원본 BOM 데이터 기반 분석" 으로 중립화, Q9/Q16 회신 대기 주석 추가; 문서정비(2026.04.14): §5.1.1 [검토 중]→[미확정] 통일; §11 DE35-1 참조 v1.1→v1.2 |
| v1.3 | 2026.04.14 | 코드크래프트 | 단일 표준BOM 버전축 모델 반영 — §3.4에 변환 후 "표준BOM 단위 원자적 스냅샷 커밋" 원칙 명시; §3.5 신규 섹션 "묶음 버전 관리 원칙" 추가 (표준BOM = EBOM+MBOM+Config 묶음, 단일 `standardBomVersion` 축, 원자적 스냅샷 릴리스, `resolvedBomId` 결정적 함수, 버전 불일치 방지가 핵심 동기) |
| **v1.4** | **2026.04.21** | **코드크래프트** | **용어사전 v1.3/v1.4 정합 개정 — (1) §3.5 3축→**4축 묶음**(EBOM+MBOM+Config+**BOM_RULE**), `sbv{N}` 네이밍, scope_type=ESTIMATE 오버레이 언급. (2) §5.3 BOM Rule 5동사→**4동사 공식 스키마**(SET/REPLACE/ADD/REMOVE), `QTY_CHANGE`/`LOSS_CHANGE` 폐기(금지어), 조건식 예시 전면 재작성 (NUMERIC 옵션·IN 연산자 포함). (3) §5.5 데이터 모델 확장 — OPTION_VALUE NUMERIC(value_type/numeric_min/max/enablement_condition), BOM_RULE +5컬럼(template_id·template_instance_id·slot_values·scope_type·estimate_id), `RULE_TEMPLATE`·`BOM_RULE_HISTORY` 신규 엔티티, BOM_RULE_ACTION 폐기. (4) §5.6.1 OPTION_VALUE 예시에 NUMERIC 행 추가. (5) §5.6.2 BOM_RULE 예시 4동사 + template_instance_id 묶음으로 재작성. (6) §5.6.3 status 흐름 `DRAFT→RESOLVED→RELEASED` → **`DRAFT→RELEASED→DEPRECATED`** 정정, RESOLVED 중간 상태 폐기. (7) §5.6.4 Resolved BOM 예시에 절단 속성 8 신규 필드 반영 (DE24-1 v1.8). (8) §6 frozen 전환 트리거 3종(T1/T2/T3) + 재평가 금지 원칙 명시. (9) §8 화면 구성 — UI 용어 표준(자재구성/공정구성/옵션구성/옵션별규칙/확정구성표), 옵션별규칙 **3뷰 체계**(📋 템플릿 갤러리 / 📊 결정표 / ⚙️ 전문가) + 시뮬레이터 패널 반영. (10) §9 MES 연동 — DE24-1 v1.8 8 신규 필드·쿼리 파라미터·에러 처리. (11) §10 향후 과제 — FR-PM-020/025~027/018/019/023 해결 표시, 폐기·축소 항목 명시. (12) §11 관련 산출물 — 용어사전 v1.4, DE35-1 v1.5-r2, DE32-1 v1.1, DE11-1 v1.3, BOM-RULE-UI 스펙 추가** |
