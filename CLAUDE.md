# CLAUDE.md

WIMS 2.0 프로젝트 — Claude Code 작업 지침.

## 프로젝트 개요

- **WIMS**(Window & Curtain Wall Information Management System) 시스템 개선 개발
- 발주: 유니크시스템 / 개발: 코드크래프트
- 기간: 2026.03.23 ~ 2026.11.01 (8개월, S0~S15)
- 방법론: 특허청 SW 개발방법론 (CBD, ISO/IEC 12207 준용)
- Phase 1: 제품관리(PM) / Phase 2: 견적설계(ES), 발주관리(OM), 제조관리(MF), 현장실측(FS)

## 프로젝트 성격

**소스 코드가 아닌 문서/산출물 저장소** (Obsidian Vault). 소스는 별도 GitHub 레포.

## 기술 스택 (참조용)

- FE: Vue 3 + Vite + Pinia / BE: Kotlin + Spring Boot 3 + JPA / 모바일: Android (Kotlin)
- DB: MariaDB 10.11 / 인증: Spring Security + JWT / 스키마: Flyway
- 인프라: AWS (EC2/RDS/S3+CF), Docker 미사용, JAR 직배포
- CI/CD: GitHub Actions, GitHub Flow

## 폴더 구조

- `docs/` — 지침·참조 (`1_PP`, `2_AN`, `3_DE`, `4_CO`, `참고자료/`)
- `산출물/` — 7단계별 공식 산출물 docx/xlsx (`1_PP` ~ `7_TO`, `참고자료/`)
- `scripts/` — docx/xlsx 생성 Node.js 스크립트

## 5개 서브시스템

PM(제품관리)·ES(견적설계)·OM(발주관리)·MF(제조관리)·FS(현장실측)

## 핵심 규칙

1. **yarn 사용** (npm 금지)
2. **md 초안 우선** — docx/xlsx는 명시적 요청 시에만 생성
3. **용어사전 선행** — BOM 관련 문서 수정 전 `docs/참고자료/WIMS_용어사전_BOM_v1.3.md` (최신) 필수 Read

## 상세 지침 (필요 시 Read)

- 문서코드·산출물 작성 규칙: `docs/참고자료/문서코드_규칙.md`
- 주요 참조 문서 인덱스: `docs/참고자료/참조문서_인덱스.md`
- 진행 상황·스프린트·질의 회신 현황: `STATUS.md`
