# DE34-1 + DE41 산출물 작성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PP12-1 v2.2 §1 ●필수로 채택된 DE34-1 표준 데이터사전과 DE41 초기 데이터 시드 입력 정책서를 작성하여 Gate 2 진입조건을 충족한다.

**Architecture:** 두 산출물은 독립 SOT 영역(DE34-1=자재코드 체계 / DE41=시드 입력 정책)이라 서브 에이전트 병렬 작성. 본문은 인용 인덱스 + 단독 SOT + Phase 2 [TBD] 마커 패턴. 작성 후 STATUS·_INDEX 갱신 + 단일 commit.

**Tech Stack:** Obsidian Flavored Markdown (frontmatter·wikilink·callout·mermaid)

**Spec:** `docs/superpowers/specs/2026-04-27-de34-de41-design.md` (commit `e27f309`)

---

## File Structure

| 작업 | 파일 | 책임 |
|---|---|---|
| Create | `docs/3_DE(설계)/DE34-1_표준데이터사전_v1.0.md` | 자재코드 체계 단독 SOT, 컬럼사전·코드사전 인용 인덱스 |
| Create | `docs/3_DE(설계)/DE41_초기데이터시드입력정책서_v1.0.md` | 시드 입력 계획·도메인별 명세·검증 정책 |
| Modify | `docs/3_DE(설계)/_INDEX.md` | DE34-1·DE41 신규 산출물 등록 |
| Modify | `STATUS.md` | S2 Gate 2 산출물 섹션에 DE34-1·DE41 v1.0 추가 |

---

## Task 1: DE34-1 표준 데이터사전 v1.0 작성

**Files:**
- Create: `docs/3_DE(설계)/DE34-1_표준데이터사전_v1.0.md`

**입력 자료** (사전 Read):
- `docs/superpowers/specs/2026-04-27-de34-de41-design.md` §3 (DE34-1 구조)
- `docs/3_DE(설계)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.6.md` §4 (자재 카탈로그 87종)
- `docs/3_DE(설계)/DE33-1_DB물리스키마_설계서_v1.2.md` (컬럼 COMMENT 117건, 23 엔티티)
- `docs/참고자료/WIMS_용어사전_BOM_v1.4.md` §2.1 BOM Level 5단·§5.1 위치구분
- `docs/참고자료/분석/7_유니크시스템BOM_26.04.24_분석.md` §4 Gain A·B·C·D·E

- [ ] **Step 1.1: 입력 자료 5건 Read 또는 grep 인덱싱**

서브 에이전트가 본문 작성 전에 SOT 자료를 식별해야 한다.
- DE35-1 v1.6에서 §4 자재 87종 표 위치 파악
- DE33-1 v1.2에서 23 엔티티 목록 추출
- 용어사전 v1.4-r2에서 §2.1·§5.1 데이터 인용용 패턴 확보

```bash
grep -n "^##\|^###" docs/3_DE\(설계\)/DE35-1_미서기이중창_표준BOM구조_정의서_v1.6.md | head -30
grep -n "^##\|^###" docs/3_DE\(설계\)/DE33-1_DB물리스키마_설계서_v1.2.md | head -30
```

- [ ] **Step 1.2: 본문 작성 (~350~450행)**

spec §3 구조 그대로 적용:

```
frontmatter:
  title: 표준 데이터사전 v1.0
  version: 1.0
  updated: 2026-04-27
  type: 설계
  status: draft
  tags: [wims, de34, 데이터사전, 자재코드체계, 표준]
  related:
    - "[[PP12-1_방법론_테일러링_결과서_v2.2_산출물확정]]"
    - "[[DE33-1_DB물리스키마_설계서_v1.2]]"
    - "[[DE35-1_미서기이중창_표준BOM구조_정의서_v1.6]]"
    - "[[WIMS_용어사전_BOM_v1.4]]"
    - "[[7_유니크시스템BOM_26.04.24_분석]]"

§1 개요 (1.1 목적·1.2 범위·1.3 SOT 분담 표)
§2 자재 코드 체계 표준화 (단독 SOT)
   2.1 부여 규칙 (원자재·부자재·반제품·위치 인스턴스)
   2.2 자재 마스터 87종 인덱스 (DE35-1 §4 인용)
   2.3 협력업체 11개사
   2.4 공정 코드 카탈로그 (후렘13·문짝12·방충망6)
   2.5 BOM Level 5단 (정의는 용어사전 인용)
   2.6 Phase 2 도메인 코드 [TBD]
§3 컬럼 사전 인덱스 (DE33-1 23 엔티티 § 링크 표)
§4 코드 도메인 사전 인덱스 (용어사전 §4 인용)
§5 Phase 2 도메인 [TBD]
§6 변경 이력 + 관련 문서
```

§2.1 부여 규칙 예시 (반드시 본문에 포함):
```
원자재: UNI-A{치수}-{유형}
  예: UNI-A225-101 (225mm 1등급 미서기 후렘)

부자재: NN-XXXX (4자리 시리얼)
  - 02-* : 가람정밀 계열 (가이드·브라켓·연결재 등)
  - 04-* : 모헤어·가스켓·롤러
  - 01-* : 나사·피스 (대아볼텍)

반제품:
  - F-XXXX : 완제품 (Frame 완제품 등)
  - HC-XXX : 가공 반제품 (Half Cut·Half Carved)
  - HX-XXXX : 조립 반제품 (Half eXecuted)
  - {코드}-H : 널링 반제품 (예: UNI-A225-10H, UNI-A225-90H)

위치 인스턴스 (10종):
  H 계열: H01, H02, H02-1, H02-2, H03, H03-1, H03-2 (7종)
  W 계열: W01, W02, W03 (3종)
  접미사 -1·-2 = 동일 위치 sub-position (예: 중중연창 H03 분할)
```

- [ ] **Step 1.3: 자체 검증 (인용 인덱스 정합성)**

```bash
# §2 단독 SOT 본문 길이 (target: 100~150행)
sed -n '/^## §2\|^## 2\./,/^## §3\|^## 3\./p' docs/3_DE\(설계\)/DE34-1_표준데이터사전_v1.0.md | wc -l

# §3 컬럼 사전 인덱스가 DE33-1 wikilink로만 구성됐는지 (본문 복사 금지)
grep -c "DE33-1_DB물리스키마_설계서_v1.2" docs/3_DE\(설계\)/DE34-1_표준데이터사전_v1.0.md
# Expected: 5+ (각 도메인 섹션마다 인용)

# [TBD] 마커 위치
grep -n "TBD" docs/3_DE\(설계\)/DE34-1_표준데이터사전_v1.0.md
# Expected: §2.6 Phase 2 도메인 코드 / §5 Phase 2 도메인 — 2건
```

Pass 기준: §2 본문 100~150행 / DE33-1 wikilink 5건 이상 / TBD 2건 이하

- [ ] **Step 1.4: 본 task는 Task 4 통합 commit에 포함되므로 별도 commit 없음**

---

## Task 2: DE41 초기 데이터 시드 입력 정책서 v1.0 작성

**Files:**
- Create: `docs/3_DE(설계)/DE41_초기데이터시드입력정책서_v1.0.md`

**입력 자료** (사전 Read):
- `docs/superpowers/specs/2026-04-27-de34-de41-design.md` §4 (DE41 구조)
- `docs/2_AN(분석)/AN22-1_현행데이터분석서_v1.1.md` §5 (참고용 As-Is 분석)
- `docs/3_DE(설계)/DE33-1_DB물리스키마_설계서_v1.2.md` (To-Be 23 엔티티)
- `docs/3_DE(설계)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md` §7.3 (7 표준 ROLE)
- `docs/참고자료/분석/7_유니크시스템BOM_26.04.24_분석.md` (자재 87종·제품 25종)

- [ ] **Step 2.1: 입력 자료 5건 Read 또는 grep 인덱싱**

```bash
grep -n "^##\|^###" docs/2_AN\(분석\)/AN22-1_현행데이터분석서_v1.1.md | head -30
grep -n "ROLE_\|7 표준" docs/3_DE\(설계\)/DE11-1_소프트웨어_아키텍처_설계서_v1.2.md | head -10
```

- [ ] **Step 2.2: 본문 작성 (~500~600행)**

spec §4 구조 그대로 적용:

```
frontmatter:
  title: 초기 데이터 시드 입력 정책서 v1.0
  version: 1.0
  updated: 2026-04-27
  type: 설계
  status: draft
  tags: [wims, de41, 시드입력, 데이터정책, 마이그미실시]
  related:
    - "[[PP12-1_방법론_테일러링_결과서_v2.2_산출물확정]]"
    - "[[AN22-1_현행데이터분석서_v1.1]]"
    - "[[DE33-1_DB물리스키마_설계서_v1.2]]"
    - "[[DE34-1_표준데이터사전_v1.0]]"
    - "[[7_유니크시스템BOM_26.04.24_분석]]"

§1 개요
   1.1 목적 (PP12-1 v2.2 §1 ●필수, Gate 2 진입조건, 마이그 미실시 정책)
   1.2 범위 (빈 DB + 마스터 시드)
   1.3 As-Is 참고 분류 (AN22-1 v1.1 §5.2 7개 도메인 요약)
   1.4 참조 문서

§2 시드 입력 계획 (DE41-1 영역)
   2.1 입력 전략 (Phase 1 일괄 / Phase 2 점진)
   2.2 입력 일정 (S2 정의 → S3~4 준비 → S5 D-Day)
   2.3 입력 도구 (Flyway 시드 + 관리자 화면 + Excel→CSV)
   2.4 검증 정책 (전수 검증)
   2.5 권한 / 책임
   2.6 리스크

§3 도메인별 시드 입력 명세 (DE41-2 영역)
   3.1 시드 매트릭스 요약 (도메인 × 엔티티 × 시드 규모 × 입력 방식)
   3.2 인증·사용자 시드
   3.3 프로젝트 시드 (As-Is 미이관, 시드 0건)
   3.4 자재·제품 시드 (최고 깊이) ★
   3.5 시스템·공통 시드
   3.6 견적설계 시드 [TBD — Phase 2]
   3.7 계약·발주 시드 [TBD — Phase 2]
   3.8 도면·CAD 시드 [TBD — Phase 2]

§4 시드 입력 표준 규칙
   4.1 자재코드 표준 패턴 (DE34-1 §2 인용)
   4.2 ROLE 매핑 (DE11-1 §7.3 7표준)
   4.3 인코딩 (UTF-8)
   4.4 NULL·기본값 정책

§5 (없음) — 시드 데이터는 BOM_26.04.24 보완본·DE33-1 v1.2 등 사전 검증된
   마스터에서 가져오므로 사후 정제 불필요. 단 시드 입력 전 자재코드 표준
   패턴 적용 검증은 §4.1에서 수행

§6 검증 정책
   6.1 시드 입력 검증 SQL 카탈로그
   6.2 검증 결과 보고서 템플릿 (IM 단계 입력)
   6.3 합격 기준

§7 미해결 이슈 / 후속 과제
   7.1 Phase 2 도메인 시드 [TBD]
   7.2 운영 시작 후 추가 입력 운영 정책
   7.3 As-Is 시스템 병행 운영 종료 시점

§8 변경 이력 + 관련 문서
```

§3.1 시드 매트릭스 (반드시 본문에 포함):
```
| 도메인 | 엔티티 | 시드 규모 | 입력 방식 | Phase |
|---|---|---|---|---|
| 인증·사용자 | user | 14명 (TFT) | 관리자 화면 | 1 |
| 인증·사용자 | role / permission | 7 ROLE (DE11-1 §7.3) | Flyway 시드 | 1 |
| 프로젝트 | project | 0건 (운영 시 신규) | 관리자 화면 (운영 시작 후) | 1 |
| 자재 | item (원자재) | 40종 | Excel→CSV 일괄 | 1 |
| 자재 | item (부자재) | 47종 | Excel→CSV 일괄 | 1 |
| 자재 | item_supplier | 87×N | Excel→CSV 일괄 | 1 |
| 자재 | dies_supplier | 11개사 | Excel→CSV 일괄 | 1 |
| 자재 | dies_book·revision | TBD | Excel→CSV | 1 |
| 제품 | product | 25종 (후렘18·문짝6·방충망1) | Excel→CSV 일괄 | 1 |
| 제품 | product_class | L1~L4 카탈로그 | Flyway 시드 | 1 |
| BOM | bom_master·item | 25개 BOM | Excel→CSV 일괄 | 1 |
| 시스템 | code_catalog | 단위·분류·공정·위치 등 | Flyway 시드 | 1 |
| 시스템 | system_setting | 12항목 | Flyway 시드 | 1 |
| 견적·발주·도면 | (각 엔티티) | [TBD] | [TBD] | 2 |
```

§6.3 합격 기준 (반드시 본문에 포함):
```
- 시드 row count 100% (계획 시드 규모 = 입력 후 row count)
- FK 무결성 100% (외래키 NULL/위반 0건)
- 표본 정성검증 (자재 87종 중 10종 sampling 검증)
- 자재코드 표준 패턴 위반 0건
- 코드 카탈로그 enum 값 누락 0건
```

- [ ] **Step 2.3: 자체 검증**

```bash
# §3.4 자재·제품 깊이 (target: 80~120행)
sed -n '/^### 3\.4/,/^### 3\.5/p' docs/3_DE\(설계\)/DE41_초기데이터시드입력정책서_v1.0.md | wc -l

# 마이그 색채 잔존 확인 (롤백 윈도우·전수 마이그 등 표현 0건이어야)
grep -E "롤백 윈도우|전수 마이그|병행 운영 SQL" docs/3_DE\(설계\)/DE41_초기데이터시드입력정책서_v1.0.md
# Expected: 0 matches

# Phase 2 [TBD] 마커
grep -c "TBD" docs/3_DE\(설계\)/DE41_초기데이터시드입력정책서_v1.0.md
# Expected: 4~6 (§3.6/3.7/3.8 + §7.1 등)

# DE34-1 §2 인용 확인
grep -c "DE34-1_표준데이터사전_v1.0\|DE34-1.*§2" docs/3_DE\(설계\)/DE41_초기데이터시드입력정책서_v1.0.md
# Expected: 2+ (§4.1 인용 + §3.4 인용)
```

Pass 기준: §3.4 본문 80행 이상 / 마이그 색채 표현 0건 / TBD 4~6건 / DE34-1 인용 2건 이상

- [ ] **Step 2.4: 본 task는 Task 4 통합 commit에 포함되므로 별도 commit 없음**

---

## Task 3: STATUS.md / 3_DE _INDEX.md 갱신

**Files:**
- Modify: `STATUS.md`
- Modify: `docs/3_DE(설계)/_INDEX.md`

- [ ] **Step 3.1: STATUS.md 추가 항목**

`## 현재 시점 (2026-04-27)` 섹션에 1불릿 추가 (마이그→시드 정책 반영 불릿 다음):

```
- **2026-04-27 DE34-1·DE41 산출물 작성:** Gate 2 진입조건 충족. **DE34-1 표준 데이터사전 v1.0** 신설(자재코드 체계 SOT·87종·11개사·공정13/12/6·위치10종, 컬럼사전·코드사전은 인용 인덱스). **DE41 초기 데이터 시드 입력 정책서 v1.0** 신설(§2 시드 계획·§3 도메인별 명세·§4 표준 규칙·§6 검증 정책. Phase 1 깊이/Phase 2 [TBD]). [[2026-04-27-de34-de41-design|spec]] 기반 작성.
```

`## S2 Gate 2 산출물 (선행 완료)` 섹션에 2건 추가:
```
- DE34-1 표준 데이터사전 **v1.0** (2026-04-27 신설)
- DE41 초기 데이터 시드 입력 정책서 **v1.0** (2026-04-27 신설, 마이그 미실시·시드 입력 정책)
```

- [ ] **Step 3.2: 3_DE _INDEX.md 갱신**

DE 산출물 목록에 DE34-1·DE41 신규 항목 추가. 기존 패턴 유지.

```bash
# 기존 패턴 확인
grep -n "DE3" docs/3_DE\(설계\)/_INDEX.md
```

추가 위치: 기존 DE32-1·DE33-1·DE35-1 사이 적절히 (DE34-1은 DE33-1 다음, DE41은 DE35-1 다음).

- [ ] **Step 3.3: 자체 검증 — wikilink 무결성**

```bash
grep -n "DE34-1_표준데이터사전_v1\.0\|DE41_초기데이터시드입력정책서_v1\.0" \
  STATUS.md docs/3_DE\(설계\)/_INDEX.md
# Expected: STATUS·_INDEX 각 1건 이상
```

---

## Task 4: 통합 검증 + commit

**Files:**
- 모든 신규/수정 파일

- [ ] **Step 4.1: 외부 wikilink 정합성 검증**

신규 산출물 2건이 다른 문서에서 deadlink가 되지 않도록, 작성 후 외부 참조 패턴이 깨지지 않는지 확인:

```bash
cd /Users/jikwangkim/Documents/Claude/Projects/WIMS2.0
# DE34-1·DE41 wikilink가 정상 작동하는지 (이미 spec/STATUS/_INDEX에 wikilink 추가)
grep -rn "DE34-1_표준데이터사전\|DE41_초기데이터시드입력정책서" docs/ STATUS.md | wc -l
# Expected: 5+ (spec·STATUS·_INDEX·DE34-1 자기·DE41 자기)
```

- [ ] **Step 4.2: 양쪽 산출물 frontmatter·구조 무결성 점검**

```bash
# frontmatter 양식 확인
head -15 docs/3_DE\(설계\)/DE34-1_표준데이터사전_v1.0.md
head -15 docs/3_DE\(설계\)/DE41_초기데이터시드입력정책서_v1.0.md
# Expected: title·version: 1.0·updated: 2026-04-27·tags·related 모두 존재

# 변경이력 테이블 존재 확인
grep -E "## (변경 이력|변경이력)" docs/3_DE\(설계\)/DE34-1_표준데이터사전_v1.0.md docs/3_DE\(설계\)/DE41_초기데이터시드입력정책서_v1.0.md
# Expected: 각 1건
```

- [ ] **Step 4.3: 통합 commit**

```bash
cd /Users/jikwangkim/Documents/Claude/Projects/WIMS2.0
git add \
  STATUS.md \
  "docs/3_DE(설계)/_INDEX.md" \
  "docs/3_DE(설계)/DE34-1_표준데이터사전_v1.0.md" \
  "docs/3_DE(설계)/DE41_초기데이터시드입력정책서_v1.0.md"

git commit -m "$(cat <<'EOF'
docs: DE34-1 표준 데이터사전 + DE41 초기 데이터 시드 입력 정책서 신설

PP12-1 v2.2 §1 ●필수 채택 + Gate 2 진입조건 충족.

- DE34-1 표준 데이터사전 v1.0
  - §2 자재코드 체계 표준화 단독 SOT (원자재·부자재·반제품·위치 10종)
  - 자재 87종·협력업체 11개사·공정 13/12/6·BOM Level 5단
  - §3·§4 컬럼·코드 사전 인용 인덱스 (DE33-1·용어사전 SOT)
  - §5 Phase 2 [TBD] 자리확보
- DE41 초기 데이터 시드 입력 정책서 v1.0
  - §2 시드 입력 계획 (Phase 1 일괄·Phase 2 점진)
  - §3 도메인별 시드 명세 (자재·제품 최고 깊이, 견적·발주·도면 [TBD])
  - §4 시드 표준 규칙 (자재코드 패턴·ROLE 매핑·UTF-8)
  - §6 검증 정책 (전수 검증 SQL·합격 기준)
  - 마이그 색채 제거 (PO 2026-04-27 결정 후속)
- STATUS·3_DE _INDEX 갱신

spec: docs/superpowers/specs/2026-04-27-de34-de41-design.md
plan: docs/superpowers/plans/2026-04-27-de34-de41-implementation.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4.4: git log 확인**

```bash
git log -1 --stat | head -20
# Expected: 4 files changed (2 new + 2 modified)
```

---

## Self-Review

### Spec Coverage

| Spec 섹션 | Plan Task | 상태 |
|---|---|---|
| spec §3 DE34-1 §1 개요·1.3 SOT 분담 표 | Task 1 Step 1.2 frontmatter·§1 작성 | ✅ |
| spec §3 DE34-1 §2 자재코드 체계 단독 SOT (2.1~2.6) | Task 1 Step 1.2 §2 부여 규칙 예시 본문에 포함 | ✅ |
| spec §3 DE34-1 §3 컬럼 사전 인덱스 | Task 1 Step 1.2 §3 (인용 인덱스) | ✅ |
| spec §3 DE34-1 §4 코드 도메인 사전 인덱스 | Task 1 Step 1.2 §4 (인용 인덱스) | ✅ |
| spec §3 DE34-1 §5 Phase 2 [TBD] | Task 1 Step 1.2 §5 / Step 1.3 TBD 검증 | ✅ |
| spec §4 DE41 §1 개요 | Task 2 Step 2.2 frontmatter·§1 | ✅ |
| spec §4 DE41 §2 시드 계획 (DE41-1 영역) | Task 2 Step 2.2 §2 | ✅ |
| spec §4 DE41 §3 도메인별 명세 (3.1~3.8) | Task 2 Step 2.2 §3 + §3.1 매트릭스 본문 포함 | ✅ |
| spec §4 DE41 §4 시드 표준 규칙 | Task 2 Step 2.2 §4 | ✅ |
| spec §4 DE41 §5 (정제 불필요 사유 명시) | Task 2 Step 2.2 §5 본문에 인라인 | ✅ |
| spec §4 DE41 §6 검증 정책 (합격 기준) | Task 2 Step 2.2 §6.3 합격 기준 본문 포함 | ✅ |
| spec §4 DE41 §7 미해결 이슈 | Task 2 Step 2.2 §7 | ✅ |
| spec §5 작성 방식 (서브에이전트 병렬) | 본 plan Task 1·2 병렬 실행 가능 (subagent-driven) | ✅ |
| spec §6 영향 매트릭스 (STATUS·_INDEX) | Task 3 | ✅ |

**Coverage 100%** — 모든 spec 항목 task로 매핑됨.

### Placeholder Scan

- ❌ "TBD/TODO/구현 후" — Plan 본문 자체에는 placeholder 없음. Task 본문에 "[TBD]" 마커 명시는 산출물 의도된 자리확보 (Phase 2 보강 약속)이므로 정당한 사용.
- ❌ "Add appropriate error handling" 등 — 없음
- ❌ "Similar to Task N" — 없음. 각 Task 코드·검증 명령 모두 명시.
- ❌ 정의 안 된 함수/타입 참조 — 없음.

### Type Consistency

- 산출물 코드: DE34-1 / DE41 (PP12-1 v2.2 §3 묶음 표기 일관)
- 파일명: `DE34-1_표준데이터사전_v1.0.md` / `DE41_초기데이터시드입력정책서_v1.0.md` 일관
- 자재 87종 = 원자재 40 + 부자재 47 (DE35-1 v1.6·BOM_26.04.24 보완본 일관)
- 협력업체 11개사 / 공정 13·12·6 / 위치 10종 / Level 5단 — 모든 task에서 동일 수치 사용

**모든 정합성 확인 완료.**
