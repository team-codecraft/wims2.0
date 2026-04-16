/**
 * DE24-1 인터페이스 설계서 (MES REST API) v1.7 — docx 생성 스크립트
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeightRule, PageBreak, VerticalAlign,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────
// 스타일 상수
// ─────────────────────────────────────────────────────────────
const FONT = '맑은 고딕';
const MONO = 'Consolas';
const PRIMARY = '1F4E79';
const ACCENT = '2E75B6';
const HEADER_BG = 'D6E4F0';
const CODE_BG = 'F5F5F5';
const NOTE_BG = 'FFF8E1';

// ─────────────────────────────────────────────────────────────
// 기본 Paragraph / 제목 헬퍼
// ─────────────────────────────────────────────────────────────
const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 100, line: 340 },
  alignment: opts.align || AlignmentType.LEFT,
  children: Array.isArray(text)
    ? runs(text)
    : [new TextRun({ text, font: FONT, size: opts.size || 22, bold: opts.bold, color: opts.color })],
});

const title = (text) => new Paragraph({
  spacing: { before: 200, after: 160 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text, font: FONT, size: 40, bold: true, color: PRIMARY })],
});

const subtitle = (text) => new Paragraph({
  spacing: { before: 80, after: 80 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: ACCENT })],
});

const h1 = (text) => new Paragraph({
  spacing: { before: 320, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: PRIMARY, space: 4 } },
  children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: PRIMARY })],
});

const h2 = (text) => new Paragraph({
  spacing: { before: 220, after: 100 },
  children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: ACCENT })],
});

const h3 = (text) => new Paragraph({
  spacing: { before: 180, after: 80 },
  children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: '333333' })],
});

const h4 = (text) => new Paragraph({
  spacing: { before: 140, after: 60 },
  children: [new TextRun({ text, font: FONT, size: 21, bold: true })],
});

const bullet = (text, opts = {}) => new Paragraph({
  spacing: { after: 60, line: 320 },
  indent: { left: 360 + (opts.level || 0) * 240, hanging: 220 },
  children: [
    new TextRun({ text: '· ', font: FONT, size: 22, bold: true }),
    ...runs(text),
  ],
});

const numbered = (n, text) => new Paragraph({
  spacing: { after: 60, line: 320 },
  indent: { left: 440, hanging: 280 },
  children: [
    new TextRun({ text: `${n}. `, font: FONT, size: 22, bold: true }),
    ...runs(text),
  ],
});

// 복합 본문 텍스트를 TextRun 배열로 변환
// 입력: 문자열 또는 [{t, bold, code, color}] 배열
function runs(input) {
  if (typeof input === 'string') return [new TextRun({ text: input, font: FONT, size: 22 })];
  return input.map(seg => {
    if (typeof seg === 'string') return new TextRun({ text: seg, font: FONT, size: 22 });
    if (seg.code) return new TextRun({ text: seg.t, font: MONO, size: 20, color: '333333' });
    return new TextRun({ text: seg.t, font: FONT, size: 22, bold: seg.bold, color: seg.color, italics: seg.italic });
  });
}

const spacer = () => new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: ' ', font: FONT, size: 22 })] });

// ─────────────────────────────────────────────────────────────
// 표 헬퍼
// ─────────────────────────────────────────────────────────────
const tblBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  left: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  right: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' },
};

// 셀 텍스트용 runs (표 내부는 size 20 사용)
function cellRuns(input) {
  if (typeof input === 'string') return [new TextRun({ text: input || ' ', font: FONT, size: 20 })];
  if (input instanceof TextRun) return [input];
  return input.map(seg => {
    if (typeof seg === 'string') return new TextRun({ text: seg || ' ', font: FONT, size: 20 });
    if (seg.code) return new TextRun({ text: seg.t || ' ', font: MONO, size: 18, color: '333333' });
    return new TextRun({ text: seg.t || ' ', font: FONT, size: 20, bold: seg.bold, color: seg.color, italics: seg.italic });
  });
}

const cell = (content, opts = {}) => new TableCell({
  shading: opts.header ? { fill: HEADER_BG } : (opts.fill ? { fill: opts.fill } : undefined),
  margins: { top: 80, bottom: 80, left: 100, right: 100 },
  verticalAlign: VerticalAlign.CENTER,
  children: (Array.isArray(content) ? content : [content]).map(c => {
    if (c instanceof Paragraph) return c;
    return new Paragraph({
      alignment: opts.align || (opts.header ? AlignmentType.CENTER : AlignmentType.LEFT),
      spacing: { after: 40, line: 300 },
      children: cellRuns(c),
    });
  }),
});

// 간단 2D 표: rows 는 [[...], [...]], widths (%) 배열 선택적
const mkTable = (rows, opts = {}) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: tblBorders,
  rows: rows.map((r, i) => new TableRow({
    tableHeader: i === 0,
    cantSplit: true,
    children: r.map((c, j) => cell(c, {
      header: i === 0,
      align: i === 0 ? AlignmentType.CENTER : (opts.aligns ? opts.aligns[j] : AlignmentType.LEFT),
    })),
  })),
});

// ─────────────────────────────────────────────────────────────
// 코드블록 (회색 배경 단일 셀 표)
// ─────────────────────────────────────────────────────────────
const codeBlock = (text, opts = {}) => {
  const lines = text.split('\n');
  return lines.map(ln => new Paragraph({
    spacing: { after: 0, line: 260 },
    indent: { left: 200 },
    children: [new TextRun({ text: ln || ' ', font: MONO, size: 18, color: '2E2E2E' })],
  }));
};

// ─────────────────────────────────────────────────────────────
// 인용문 (> ...) 블록 — 옅은 배경 + 좌 테두리
// ─────────────────────────────────────────────────────────────
const note = (content) => {
  const items = Array.isArray(content) ? content : [content];
  return items.map((ln, i) => {
    if (ln instanceof Paragraph) return ln;
    const prefix = i === 0 ? [new TextRun({ text: '※ ', font: FONT, size: 22, bold: true, color: ACCENT })] : [];
    return new Paragraph({
      spacing: { after: 60, line: 320 },
      indent: { left: 360 },
      children: [...prefix, ...runs(ln)],
    });
  });
};

// ─────────────────────────────────────────────────────────────
// 문서 내용 구성
// ─────────────────────────────────────────────────────────────
const children = [];

// ========== 표지 ==========
children.push(
  new Paragraph({ spacing: { before: 2400 }, children: [new TextRun({ text: ' ', font: FONT, size: 22 })] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: '[ WIMS 2.0 프로젝트 · Gate 1 산출물 ]', font: FONT, size: 22, color: '555555' })],
  }),
  title('인터페이스 설계서'),
  subtitle('MES REST API'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 800 },
    children: [new TextRun({ text: 'WIMS ↔ MES 연동 외부(External) API 명세', font: FONT, size: 22, color: '666666' })],
  }),
);

// 표지 메타 박스
const coverInfoRows = [
  ['문서코드', 'DE24-1'],
  ['문서번호', 'WIMS2.0_DE24-1_인터페이스설계서_MES_REST_API_v1.7'],
  ['버전', 'v1.7'],
  ['작성일', '2026.04.14'],
  ['작성자', '김진호 (BE, 코드크래프트)'],
  ['검토자', '김지광 (PM, 코드크래프트)'],
  ['MES팀 확인', '배봉균, 신세은 (MES팀)'],
  ['상태', '초안 — MES팀 협의 후 확정 예정'],
];
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: tblBorders,
  rows: coverInfoRows.map(([k, v]) => new TableRow({
    cantSplit: true,
    children: [
      cell(k, { header: true, align: AlignmentType.CENTER }),
      cell(v, { align: AlignmentType.LEFT }),
    ],
  })),
}));

children.push(
  new Paragraph({ spacing: { before: 2400 }, children: [new TextRun({ text: ' ', font: FONT, size: 22 })] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: '코드크래프트 (CodeCraft)', font: FONT, size: 24, bold: true, color: PRIMARY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '2026', font: FONT, size: 22, color: '666666' })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ========== 변경 이력 ==========
children.push(h1('변경 이력'));
children.push(mkTable([
  ['버전', '일자', '작성자', '변경 내용'],
  ['v1.7', '2026.04.14', '김진호', 'BOM API 를 단일 표준BOM 버전축 기반으로 통일, productVersion/configVersion 분리 축 제거 — §5.1 다이어그램을 3-레이어(표준BOM 마스터·버전·Resolved 스냅샷) 단일 축으로 재설계, 묶음 스냅샷 원칙 명시(EBOM+MBOM+Config 셋 중 하나라도 변경 시 standardBomVersion 상승). §5.2 BOM 엔드포인트를 {standardBomId}/{standardBomVersion} 단일 파라미터 구조로 리팩토링 (#3~#9, 기존 5계층 10개→3계층 7개). 요청/응답 스키마의 productVersion/configVersion 필드를 standardBomVersion 으로 교체. resolvedBomId 생성 규칙을 3키(standardBomId, standardBomVersion, 옵션선택값 해시) 기반으로 변경. §5.4 MES 연동 엔드포인트(/bom/resolved/{resolvedBomId}) 유지하되 상위 키가 standardBomVersion 기반임을 명시. §6.1 DTO 목록 정합 반영. 문서정비(검증 반영, 동일자): (1) location_code → locationCode 네이밍 일괄 정정(API 필드 camelCase 원칙, 용어사전 §8). (2) §5.4.1 응답 예시 appliedOptionsHash 중복 제거. (3) §7.1 에 HTTP 410, §7.2 에 RESOLVED_BOM_NOT_FOUND·RESOLVED_BOM_DEPRECATED 코드 등재. (4) §9.2 캐싱 전략을 Resolved 스냅샷(영구)과 표준BOM 마스터(TTL 5분) 로 분리 명시(§5.4.1 정합). (5) §4.2 Content-Type 필수 플래그 해제(GET-only 문서). (6) 부록 OpenAPI paths 를 §5.2 구조(/bom/standard, /bom/resolved/{resolvedBomId}) 와 정합. (7) 변경이력 표 시간 역순(최신→과거) 으로 정렬'],
  ['v1.6', '2026.04.14', '김진호', '외부(External) / 내부(Internal) API path prefix 분리 정책 도입 — 본 문서를 외부 API 전용 명세서로 한정. §4.1 Base URL 을 /api/v1 → /api/external/v1 로 변경, §4.1.1 prefix 분리 정책 신설. §3.2 MES 서비스 계정 허용 경로 한정. §4.2 엔드포인트 목록, §5.3~§5.6 본문 모든 경로 일괄 prefix 적용. §8.1 외부/내부 독립 버저닝 명시. §8.2 v2 확장 엔드포인트 3개도 /api/external/v2/ 로 갱신. OpenAPI 부록 servers URL 갱신. 엔드포인트 정합성 검증 완료(§4.2 표 ↔ §5.3.1~5.6.2 본문 전수 일치)'],
  ['v1.5', '2026.04.14', '김진호', '식별자(Code) vs 버전(Version) 축 분리 전면 반영 (DE35-1 v1.4 §6.2 정합) — 명명 일괄 치환(configId→configCode, baseMbomVersion→productVersion). resolvedBomId 생성 규칙을 4키 결정적 조합(RBOM-{productCode}-pv{N}-{configCode}-cv{M})으로 정정. URL 경로 깊은 계층 구조로 재설계. §5.4.1~5.4.5 5개 절로 재구성. DTO 9종 정비. 역조회 엔드포인트는 정규 플로우 원칙(resolvedBomId 캡처) 보호 차원에서 도입하지 않음. §5.4.6(WIMS 내부 검증용) 절 삭제 — MES 인터페이스 문서 범위 외. §5.1 BOM API 매핑을 §5.2 신구조와 정합'],
  ['v1.4', '2026.04.14', '김진호', 'Resolved BOM 불변 스냅샷 모델 도입 (DE35-1 §6.2.1 정합) — 주문에 바인딩된 BOM 이 설계 변경의 영향을 받지 않도록 시점 고정. §4.2 신설: /bom/products/{code}/configs/{configId}/versions, /bom/resolved/{resolvedBomId}(MES 정규). §5.4 안내문 재작성(불변 스냅샷 원칙·6단계 운영 시나리오). §6.1 DTO 목록에 ResolvedBomVersionDto 추가'],
  ['v1.3', '2026.04.14', '김진호', 'Config 조회 엔드포인트 2종 MES 노출 API 로 추가 — configId 유효성·상태 검증용. §5.4.1 Config 목록 조회, §5.4.2 Config 단건 메타데이터 조회 신설. §5.4 안내문 재정의. §6.1 DTO 목록에 ConfigSummaryDto, ConfigDetailDto 추가'],
  ['v1.2', '2026.04.14', '김진호', '§5.4.1 format=flat 응답 형식 제거 — 관리 포인트 축소(DTO·테스트·캐시 단일화). tree 단일 응답으로 통일. tree leaf 노드(RAW/SUB)에 lossRate·actualQty 필드 추가. §6.1 ResolvedBomItemDto 행 삭제'],
  ['v1.1', '2026.04.14', '김진호', 'DHS-AE225-D-1 BOM 정리 분석 결과 반영: API DTO 에 locationCode 필드 추가; MBOM API(#5·#6) 를 MES 연동 범위 외로 분리; MES 비노출 API 스펙 전체 제거(문서 범위를 MES 제공 인터페이스로 한정); API 응답 예시를 실데이터로 치환; 문서정비'],
  ['v1.0', '2026.04.07', '김진호', '초안 — MES REST API 인터페이스 규격 설계 (엔드포인트 7개, 인증, 에러 처리, 데이터 모델)'],
], { widths: [8, 12, 10, 70] }));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ========== 목차 ==========
const tocRow = (label, level = 0) => new Paragraph({
  spacing: { after: 60, line: 320 },
  indent: { left: 200 + level * 360 },
  children: [new TextRun({ text: label, font: FONT, size: level === 0 ? 22 : 20, bold: level === 0 })],
});

children.push(h1('목차'));
const tocItems = [
  ['1. 개요', 0], ['1.1 목적', 1], ['1.2 연동 방식 변경 경위', 1], ['1.3 적용 범위', 1],
  ['1.4 참조 문서', 1], ['1.5 관련 요구사항', 1],
  ['2. 인터페이스 아키텍처', 0], ['2.1 시스템 구성도', 1], ['2.2 연동 원칙', 1],
  ['3. 인증 및 보안', 0], ['3.1 인증 방식', 1], ['3.2 MES 전용 서비스 계정', 1],
  ['3.3 토큰 발급 API', 1], ['3.4 토큰 갱신 API', 1], ['3.5 JWT 클레임 구조', 1], ['3.6 API 호출 로그', 1],
  ['4. API 공통 규격', 0], ['4.1 Base URL', 1], ['4.1.1 외부/내부 API Prefix 분리 정책', 2],
  ['4.2 공통 헤더', 1], ['4.3 공통 응답 구조', 1], ['4.4 페이징 파라미터', 1], ['4.5 날짜/시간 형식', 1],
  ['5. API 엔드포인트 상세', 0], ['5.1 BOM API 매핑', 1], ['5.2 엔드포인트 목록', 1],
  ['5.3 표준BOM API', 1], ['5.4 Resolved BOM API (MES 정규 연동)', 1],
  ['5.5 자재 마스터 API', 1], ['5.6 공정 마스터 API', 1],
  ['6. 데이터 모델 (DTO)', 0], ['7. 에러 처리', 0], ['8. 버전 관리', 0],
  ['9. 성능 요구사항 및 최적화', 0], ['10. MES팀 협의 사항', 0],
  ['부록 A. Swagger/OpenAPI 3.0 명세 (요약)', 0],
];
tocItems.forEach(([label, lvl]) => children.push(tocRow(label, lvl)));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ========== 1. 개요 ==========
children.push(h1('1. 개요'));

children.push(h2('1.1 목적'));
children.push(p('본 문서는 WIMS 2.0 시스템과 MES(제조실행시스템) 간의 REST API 인터페이스 규격을 정의한다. MES 시스템이 WIMS 의 BOM, 자재, 공정 데이터를 조회할 수 있도록 API 엔드포인트, 요청/응답 스키마, 인증 방식, 에러 처리를 설계한다.'));

children.push(h2('1.2 연동 방식 변경 경위'));
children.push(mkTable([
  ['항목', '현행 (초기 계획)', '변경 (개발계획서 v1.2 확정)'],
  ['연동 방식', 'DB 직접 연동 (Read-Only 뷰)', 'REST API'],
  ['접근 제어', 'DB 계정 권한', 'JWT Bearer Token'],
  ['데이터 포맷', 'SQL 쿼리 결과', 'JSON'],
  ['문서화', '뷰/테이블 DDL', 'Swagger/OpenAPI 3.0'],
  ['변경 영향', '뷰 구조 변경 시 MES 직접 영향', 'API 버전 관리로 하위 호환성 보장'],
], { widths: [20, 35, 45] }));
children.push(spacer());
children.push(...note('변경 근거: 개발계획서 v1.2 에서 "MES 연동 방식 변경 (DB 직접 → REST API)" 로 확정. REST API 방식이 시스템 간 결합도를 낮추고, 향후 확장(양방향 연동, 메시지 큐 등)에 유리함.'));

children.push(h2('1.3 적용 범위'));
children.push(mkTable([
  ['구분', '내용'],
  ['Phase 1 (본 문서)', 'BOM 조회, 자재 조회, 공정 조회 — 읽기 전용 (Read-Only)'],
  ['Phase 2 (향후)', '실측 데이터 수신, 제작도 데이터 동기화, 양방향 연동 확장'],
  ['제외', 'MES 내부 로직, MES→WIMS 데이터 쓰기'],
], { widths: [25, 75] }));

children.push(h2('1.4 참조 문서'));
children.push(mkTable([
  ['문서코드', '문서명', '용도'],
  ['FR-PM-013', 'MES 연동 BOM 데이터 인터페이스 (AN12-1 Phase1)', '핵심 기능 요구사항'],
  ['AN12-1-P1', '요구사항 정의서 Phase 1', 'NFR-IF, NFR-SC, NFR-PF 요구사항'],
  ['DE35-1', '미서기이중창 표준 BOM 구조 정의서', 'BOM 계층 구조, 품목코드 체계'],
  ['DE35-1 부록D', 'BOM 구성에 대한 고찰', 'EBOM/MBOM 분리 모델, MES 연동 영향'],
], { widths: [18, 50, 32] }));

children.push(h2('1.5 관련 요구사항'));
children.push(mkTable([
  ['요구사항 ID', '요구사항명', '유형'],
  ['FR-PM-013', 'MES 연동 BOM 데이터 인터페이스', '기능'],
  ['NFR-IF-PM-001', 'MES REST API 규격 정의', '인터페이스'],
  ['NFR-IF-PM-002', 'API 버전 관리 (Semantic Versioning)', '인터페이스'],
  ['NFR-IF-PM-003', '데이터 캡슐화 (DTO 기반 I/O)', '인터페이스'],
  ['NFR-SC-PM-001', 'MES 전용 서비스 계정 발급 및 관리', '보안'],
  ['NFR-PF-PM-002', 'MES REST API 응답시간 2초 이내', '성능'],
], { widths: [20, 60, 20] }));

// ========== 2. 인터페이스 아키텍처 ==========
children.push(h1('2. 인터페이스 아키텍처'));

children.push(h2('2.1 시스템 구성도'));
children.push(p('아래는 WIMS 2.0 서버와 MES 시스템 간의 연동 아키텍처를 개념적으로 정리한 것이다.'));
children.push(...codeBlock(
`┌──────────────────────────────┐           ┌──────────────────────────────────────┐
│   MES 시스템 (제조실행)      │           │   WIMS 2.0 서버 (Spring Boot 3)      │
│                              │           │                                      │
│   · BOM 데이터 조회          │           │   API Gateway                        │
│   · 자재 마스터 조회         │ ─ HTTPS ─▶│     ├── Auth Service                 │
│   · 공정 정보 조회           │   JWT     │     ├── BOM Service ──┐              │
│                              │◀─ JSON ── │     ├── Material Svc ─┼── MariaDB   │
└──────────────────────────────┘           │     └── Process Svc ──┘   10.11 LTS│
                                            └──────────────────────────────────────┘
  전송 규격: HTTPS (TLS 1.2+) · Authorization: Bearer <JWT> · GET 요청만 허용`));

children.push(h2('2.2 연동 원칙'));
children.push(mkTable([
  ['#', '원칙', '설명'],
  ['1', '단방향 (Phase 1)', 'MES → WIMS 방향으로 조회만 가능. WIMS → MES 데이터 푸시 없음'],
  ['2', '읽기 전용', 'MES 계정은 GET 요청만 허용. POST/PUT/DELETE 차단'],
  ['3', 'Resolved MBOM 기준', 'MES 는 Resolved MBOM 만 조회. Base BOM, EBOM 에는 접근 불가'],
  ['4', 'Released 버전만 노출', 'Released 상태의 최신 MBOM 만 API 에 노출. Draft/Under Review 미노출'],
  ['5', '하위 호환성 보장', 'API 변경 시 기존 v1 엔드포인트 최소 3개월 병행 운영'],
], { widths: [6, 22, 72] }));

// ========== 3. 인증 및 보안 ==========
children.push(h1('3. 인증 및 보안'));

children.push(h2('3.1 인증 방식'));
children.push(mkTable([
  ['항목', '규격'],
  ['방식', 'JWT (JSON Web Token) Bearer Token'],
  ['알고리즘', 'HS256 (HMAC-SHA256) 이상'],
  ['토큰 유효기간', '8시간 (28,800초)'],
  ['갱신 방식', 'Refresh Token (유효기간 7일)'],
  ['전송 방식', 'Authorization: Bearer <token> 헤더'],
], { widths: [25, 75] }));

children.push(h2('3.2 MES 전용 서비스 계정'));
children.push(mkTable([
  ['항목', '내용'],
  ['계정 유형', '서비스 계정 (Service Account) — 사람이 아닌 시스템용'],
  ['계정 ID', 'mes-service (협의 확정 예정)'],
  ['역할 (Role)', 'ROLE_MES_READER'],
  ['허용 메서드', 'GET 만 허용'],
  ['허용 경로', '/api/external/v1/bom/**, /api/external/v1/materials/**, /api/external/v1/processes/**'],
  ['IP 제한', 'MES 서버 IP 화이트리스트 적용 (협의 확정 예정)'],
], { widths: [22, 78] }));

children.push(h2('3.3 토큰 발급 API'));
children.push(p([{ t: 'POST ', bold: true }, { t: '/api/external/v1/auth/token', code: true }]));
children.push(p('Request Body:', { bold: true }));
children.push(...codeBlock(`{
  "clientId": "mes-service",
  "clientSecret": "****"
}`));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 28800,
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}`));

children.push(h2('3.4 토큰 갱신 API'));
children.push(p([{ t: 'POST ', bold: true }, { t: '/api/external/v1/auth/refresh', code: true }]));
children.push(p('Request Body:', { bold: true }));
children.push(...codeBlock(`{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}`));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...(신규)",
  "tokenType": "Bearer",
  "expiresIn": 28800,
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...(신규)"
}`));

children.push(h2('3.5 JWT 클레임 구조'));
children.push(...codeBlock(`{
  "sub": "mes-service",
  "role": "ROLE_MES_READER",
  "iat": 1711843200,
  "exp": 1711872000,
  "iss": "wims-api"
}`));

children.push(h2('3.6 API 호출 로그'));
children.push(p('모든 API 호출에 대해 다음 항목을 로그에 기록한다.'));
children.push(mkTable([
  ['항목', '설명'],
  ['timestamp', '요청 일시 (ISO 8601)'],
  ['clientId', '호출 계정 ID'],
  ['method', 'HTTP 메서드'],
  ['endpoint', '요청 URI'],
  ['statusCode', '응답 코드'],
  ['responseTime', '응답 소요 시간 (ms)'],
  ['requestId', '고유 요청 ID (UUID)'],
], { widths: [25, 75] }));

// ========== 4. API 공통 규격 ==========
children.push(h1('4. API 공통 규격'));

children.push(h2('4.1 Base URL'));
children.push(...codeBlock('https://{host}/api/external/v1'));
children.push(mkTable([
  ['환경', 'Host'],
  ['개발 (DEV)', 'dev-api.wims.local'],
  ['테스트 (TEST)', 'test-api.wims.local'],
  ['스테이징 (STG)', 'stg-api.wims.example.com'],
  ['운영 (PROD)', 'api.wims.example.com'],
], { widths: [30, 70] }));
children.push(spacer());
children.push(...note('주: 실제 도메인은 인프라 구성 시 확정.'));

children.push(h3('4.1.1 외부(External) / 내부(Internal) API Prefix 분리 정책'));
children.push(p('WIMS API 는 노출 대상에 따라 path prefix 로 분리하여 운영한다.'));
children.push(mkTable([
  ['구분', 'Path Prefix', '노출 대상', '본 문서 범위'],
  ['외부 (External)', '/api/external/v1/...', 'MES, 향후 추가될 외부 B2B 파트너 시스템', '✅'],
  ['내부 (Internal)', '/api/internal/v1/...', 'WIMS GUI(Vue 프론트엔드), 운영자/관리자 콘솔, 사내 도구', '✗ (별도 문서)'],
], { widths: [18, 26, 44, 12] }));
children.push(spacer());
children.push(p('분리 효과:', { bold: true }));
children.push(bullet('WAF/ALB 라우팅 단계에서 prefix 단위로 rate limit · IP whitelist · 인증 정책 차등 적용'));
children.push(bullet('/api/external/* 만 인터넷 노출, /api/internal/* 는 운영 단계에서 VPC·사내망 한정 라우팅 가능 (인프라 정책에 따라 결정)'));
children.push(bullet('외부 API 의 URI 버저닝(/external/v1 → /external/v2) 과 내부 API 버저닝은 독립적으로 관리 — 외부 계약을 깨지 않고 내부 리팩터링 가능'));
children.push(spacer());
children.push(p([{ t: 'MES 서비스 계정 권한 (§3.2 정합): ', bold: true }, 'ROLE_MES_READER 는 /api/external/v1/** 경로만 호출 가능. /api/internal/** 호출 시 ', { t: '403 FORBIDDEN_PREFIX', code: true }, ' 응답을 반환한다.']));
children.push(spacer());
children.push(p([{ t: '본 문서 적용 범위: ', bold: true }, '본 DE24-1 은 외부(External) API 전용 인터페이스 명세서이다. 내부 API 는 별도 산출물(향후 작성) 에서 관리하며, 내부 API 추가 시 본 문서의 외부 prefix 와 절대 충돌하지 않는다.']));

children.push(h2('4.2 공통 헤더'));
children.push(h4('요청 (Request)'));
children.push(mkTable([
  ['헤더', '필수', '값', '설명'],
  ['Authorization', '✓', 'Bearer <token>', 'JWT 인증 토큰'],
  ['Content-Type', '', 'application/json', '요청 본문 형식. 본 문서의 모든 엔드포인트는 GET 이므로 실제 요청에서는 불필요. 향후 v2 에서 POST 계열 엔드포인트 추가 시 필수'],
  ['Accept', '✓', 'application/json', '응답 형식'],
  ['X-Request-ID', '', 'UUID', '요청 추적 ID (미전송 시 서버 자동 생성)'],
], { widths: [22, 10, 28, 40] }));

children.push(h4('응답 (Response)'));
children.push(mkTable([
  ['헤더', '값', '설명'],
  ['Content-Type', 'application/json; charset=UTF-8', '응답 형식'],
  ['X-Request-ID', 'UUID', '요청 추적 ID (요청 헤더와 동일)'],
  ['X-Response-Time', '123ms', '서버 처리 시간'],
], { widths: [25, 38, 37] }));

children.push(h2('4.3 공통 응답 구조'));
children.push(p('성공 응답:', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-04-07T09:30:00+09:00",
    "apiVersion": "v1"
  }
}`));
children.push(p('페이징 응답:', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  },
  "meta": { ... }
}`));
children.push(p('에러 응답:', { bold: true }));
children.push(...codeBlock(`{
  "success": false,
  "error": {
    "code": "BOM_NOT_FOUND",
    "message": "요청한 제품의 BOM 데이터를 찾을 수 없습니다.",
    "details": "productCode: DHS-AE225-D-1, version: 1"
  },
  "meta": { ... }
}`));

children.push(h2('4.4 페이징 파라미터'));
children.push(mkTable([
  ['파라미터', '타입', '기본값', '설명'],
  ['page', 'int', '1', '페이지 번호 (1부터 시작)'],
  ['size', 'int', '20', '페이지당 항목 수 (최대 100)'],
], { widths: [20, 15, 15, 50] }));

children.push(h2('4.5 날짜/시간 형식'));
children.push(mkTable([
  ['항목', '형식', '예시'],
  ['날짜/시간', 'ISO 8601 with timezone', '2026-04-07T09:30:00+09:00'],
  ['날짜만', 'YYYY-MM-DD', '2026-04-07'],
  ['타임존', 'Asia/Seoul (KST, UTC+09:00)', '—'],
], { widths: [20, 40, 40] }));

// ========== 5. API 엔드포인트 상세 ==========
children.push(h1('5. API 엔드포인트 상세'));

children.push(h2('5.1 BOM API 매핑'));
children.push(p('BOM 구성에 대한 고찰 및 DE35-1 §6.2 의 단일 표준BOM 버전축 모델을 API 경로에 반영한다.'));
children.push(...note('묶음 스냅샷 원칙: 하나의 standardBomVersion 은 EBOM·MBOM·Config(옵션구성 규칙) 세 구성요소를 원자적 묶음으로 캡슐화한다. 세 요소 중 하나라도 변경되면 standardBomVersion 이 상승하며, 이전 버전 스냅샷은 불변으로 보존된다. 외부(MES) 관점에서는 {standardBomId}/{standardBomVersion} 두 파라미터만으로 특정 시점의 완전한 BOM 묶음을 식별·재현할 수 있다.'));
children.push(...codeBlock(
`┌─────────────────────────────────────────────────┐
│  표준BOM 마스터 (standardBomId, 영속 식별자)     │
│  /bom/standard/{standardBomId}                  │
└────────────────────┬────────────────────────────┘
                     │ 버전 이력
                     ▼
┌─────────────────────────────────────────────────┐
│  표준BOM 버전 (standardBomVersion, 정수)         │
│  /bom/standard/{standardBomId}/versions/{sbv}   │
│  EBOM + MBOM + Config 원자적 묶음               │
└────────────────────┬────────────────────────────┘
                     │ 릴리즈 시 동결 (옵션값 바인딩)
                     ▼
┌═════════════════════════════════════════════════┐
║  Resolved BOM 스냅샷 (resolvedBomId, 결정적)    ║
║  /bom/resolved/{resolvedBomId}                  ║
║  ◀═══ MES 정규 조회 경로 (불변) ═══▶            ║
╚═════════════════════════════════════════════════╝`));
children.push(spacer());
children.push(p('계층 매핑 (URL 경로의 자기문서화):', { bold: true }));
children.push(mkTable([
  ['계층', '식별자/버전', '주 사용자', 'API 경로 패턴'],
  ['표준BOM 마스터', 'standardBomId (불변)', 'WIMS 내부 + MES', '/bom/standard/{standardBomId}'],
  ['표준BOM 버전', 'standardBomVersion (정수)', 'WIMS 내부 + MES', '/bom/standard/{standardBomId}/versions/{standardBomVersion}'],
  ['Resolved BOM 스냅샷', 'resolvedBomId (결정적, 불변)', 'MES (정규)', '/bom/resolved/{resolvedBomId}'],
], { widths: [22, 28, 18, 32] }));
children.push(spacer());
children.push(p('MES 노출 원칙 (§2.2 원칙 #3 정합):', { bold: true }));
children.push(bullet('MES 서비스 계정 ROLE_MES_READER 는 위 3계층 경로 모두 조회 가능 (탐색·디버깅·감사 시나리오 지원)'));
children.push(bullet([{ t: '단, ' }, { t: '생산 작업지시 생성', bold: true }, { t: '은 반드시 ' }, { t: '/bom/resolved/{resolvedBomId}', code: true }, { t: ' (불변 스냅샷) 경로만 사용한다 (§5.4 운영 시나리오 1번)' }]));
children.push(bullet('단일 GET /bom/standard/{standardBomId}/versions/{standardBomVersion} 호출로 EBOM+MBOM+Config 세 묶음을 원자적으로 제공한다. MES 는 개별 구성요소를 따로 조회할 필요가 없다.'));
children.push(bullet('EBOM 편집, 옵션 그룹/규칙 정의(POST/PUT), 옵션 조합 관리 등 영업·설계팀 작업용 API 는 별도 설계되며 MES 비노출'));
children.push(spacer());
children.push(p('resolvedBomId 식별자 체계:', { bold: true }));
children.push(...codeBlock(
`RBOM-{standardBomId}-sbv{standardBomVersion}-{optionsHash}
예: RBOM-DHS-AE225-D-1-sbv1-a3f9c2b1`));
children.push(p('standardBomId + standardBomVersion + 옵션선택값 조합(해시) 으로부터 결정적으로 생성되므로 동일 조합은 동일 ID. standardBomVersion 이 RELEASED 되고 옵션값이 바인딩되는 순간 동결되며, 이후 불변. optionsHash: 적용 옵션 키-값 쌍의 정규화(정렬) 후 SHA-256 앞 8자. 무옵션(기본 구성)은 default 고정.'));

children.push(h2('5.2 엔드포인트 목록'));
children.push(...note('경로 설계 원칙 (단일 표준BOM 버전축): URL 은 {standardBomId}/{standardBomVersion} 단일 버전 파라미터를 사용한다. 하나의 standardBomVersion 이 EBOM·MBOM·Config 세 구성요소를 원자적으로 포함하므로, MES 는 개별 구성요소를 따로 탐색할 필요 없이 /bom/resolved/{resolvedBomId} 한 경로로 생산용 BOM 전체를 수신한다.'));

children.push(h3('인증 API'));
children.push(mkTable([
  ['#', '메서드', '엔드포인트', '설명', '요구사항'],
  ['1', 'POST', '/api/external/v1/auth/token', '토큰 발급', 'NFR-SC-PM-001'],
  ['2', 'POST', '/api/external/v1/auth/refresh', '토큰 갱신', 'NFR-SC-PM-001'],
], { widths: [5, 8, 45, 27, 15] }));

children.push(h3('BOM API — 표준BOM 마스터 및 버전'));
children.push(mkTable([
  ['#', '메서드', '엔드포인트', '설명', '요구사항'],
  ['3', 'GET', '/api/external/v1/bom/standard', '표준BOM 목록 조회 (standardBomId 기준 마스터)', 'FR-PM-013'],
  ['4', 'GET', '/api/external/v1/bom/standard/{standardBomId}', '표준BOM 마스터 조회 (영속 식별자 기준)', 'FR-PM-013'],
  ['5', 'GET', '/api/external/v1/bom/standard/{standardBomId}/versions', '표준BOM 버전 이력 조회 (standardBomVersion 목록)', 'FR-PM-013'],
  ['6', 'GET', '/api/external/v1/bom/standard/{standardBomId}/versions/{standardBomVersion}', '표준BOM 특정 버전 상세 (EBOM+MBOM+Config 원자적 묶음 제공)', 'FR-PM-013'],
], { widths: [5, 8, 50, 22, 15] }));

children.push(h3('BOM API — Resolved BOM 스냅샷'));
children.push(mkTable([
  ['#', '메서드', '엔드포인트', '설명', '요구사항'],
  ['7', 'GET', '/api/external/v1/bom/resolved/{resolvedBomId}', 'Resolved BOM 스냅샷 조회 (MES 정규 경로) — 상위 키: standardBomVersion 기반', 'FR-PM-013'],
], { widths: [5, 8, 45, 27, 15] }));
children.push(...note('IF-MES-BOM-001 (MES 연동 핵심): MES 생산 플로우에서 사용하는 정규 엔드포인트는 #7 단독이다. #3~#6 은 탐색·감사·디버깅 시나리오에서만 사용하며, resolvedBomId 는 standardBomId + standardBomVersion + 옵션선택값 해시로부터 결정적으로 도출된다.'));

children.push(h3('자재/공정 마스터 API'));
children.push(mkTable([
  ['#', '메서드', '엔드포인트', '설명', '요구사항'],
  ['8', 'GET', '/api/external/v1/materials', '자재 마스터 목록 조회', 'FR-PM-001, FR-PM-002'],
  ['9', 'GET', '/api/external/v1/materials/{itemCode}', '자재 상세 조회', 'FR-PM-001'],
  ['10', 'GET', '/api/external/v1/processes', '공정 마스터 목록 조회', 'FR-PM-008'],
  ['11', 'GET', '/api/external/v1/processes/{processCode}', '공정 상세 조회', 'FR-PM-009'],
], { widths: [5, 8, 45, 25, 17] }));

children.push(h2('5.3 표준BOM API'));

children.push(h3('5.3.1 표준BOM 목록 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/bom/standard', code: true }]));
children.push(p('Released 상태의 표준BOM 목록을 조회한다. 하나의 standardBomId 는 제품의 EBOM·MBOM·Config 를 통합 관리하는 표준BOM 마스터 단위이다.'));
children.push(p('Query Parameters:', { bold: true }));
children.push(mkTable([
  ['파라미터', '타입', '필수', '설명'],
  ['category', 'string', '', '제품 분류 필터 (SLD, DSLD, CW 등)'],
  ['status', 'string', '', '상태 필터 (기본값: RELEASED)'],
  ['keyword', 'string', '', '제품명/BOM 명칭 검색'],
  ['page', 'int', '', '페이지 번호 (기본: 1)'],
  ['size', 'int', '', '페이지 크기 (기본: 20)'],
], { widths: [20, 15, 10, 55] }));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": [
    {
      "standardBomId": "DHS-AE225-D-1",
      "standardBomName": "225mm 단열 중중연 이중창",
      "category": "SLD",
      "grade": "1등급",
      "material": "AL",
      "insulation": true,
      "latestStandardBomVersion": 1,
      "latestVersionStatus": "RELEASED",
      "versionCount": 1,
      "releasedAt": "2026-04-01T10:00:00+09:00",
      "updatedAt": "2026-04-07T14:30:00+09:00"
    }
  ],
  "pagination": { ... },
  "meta": { ... }
}`));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리'));

children.push(h3('5.3.2 표준BOM 마스터 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/bom/standard/{standardBomId}', code: true }]));
children.push(p('표준BOM 의 영속 식별자(standardBomId) 기준 마스터 정보. standardBomVersion 목록 요약 및 최신 RELEASED 버전 포인터를 반환한다. EBOM 세부 구조는 내부 API 에서 별도 제공 (§3 원칙 #3).'));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": {
    "standardBomId": "DHS-AE225-D-1",
    "standardBomName": "225mm 단열 중중연 이중창",
    "category": "SLD",
    "status": "ACTIVE",
    "latestStandardBomVersion": 1,
    "latestReleasedVersion": 1,
    "versionCount": 1,
    "deprecatedVersionCount": 0,
    "createdAt": "2026-04-01T10:00:00+09:00",
    "updatedAt": "2026-04-07T14:30:00+09:00"
  },
  "meta": { ... }
}`));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리'));

children.push(h3('5.3.3 표준BOM 버전 이력 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/bom/standard/{standardBomId}/versions', code: true }]));
children.push(p('표준BOM 의 전체 standardBomVersion 이력 목록. EBOM·MBOM·Config 세 구성요소 중 하나라도 변경된 시점마다 버전이 상승하므로, 변경 내용 추적에 활용한다.'));
children.push(p('Query Parameters:', { bold: true }));
children.push(mkTable([
  ['파라미터', '타입', '필수', '설명'],
  ['status', 'string', '', '상태 필터 (DRAFT / RELEASED / DEPRECATED)'],
], { widths: [20, 15, 10, 55] }));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": [
    {
      "standardBomId": "DHS-AE225-D-1",
      "standardBomVersion": 1,
      "status": "RELEASED",
      "totalItems": 38,
      "changeNotes": "초기 릴리즈 — EBOM·MBOM·Config 통합 확정",
      "changedComponents": ["EBOM", "MBOM", "Config"],
      "releasedAt": "2026-04-01T10:00:00+09:00",
      "releasedBy": "yms@uniqsys.co.kr",
      "supersededAt": null
    }
  ],
  "meta": { ... }
}`));
children.push(...note('changedComponents: 해당 버전에서 변경된 구성요소 목록 (EBOM / MBOM / Config 중 해당 항목). supersededAt 은 상위 버전 릴리즈로 대체된 시각이며 null 이면 현 시점 최신.'));

children.push(h3('5.3.4 표준BOM 특정 버전 상세 조회 (EBOM+MBOM+Config 원자적 묶음)'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/bom/standard/{standardBomId}/versions/{standardBomVersion}', code: true }]));
children.push(p('특정 standardBomVersion 의 EBOM·MBOM·Config 세 구성요소를 원자적 묶음으로 제공한다. 단일 호출로 해당 버전의 완전한 BOM 정보를 수신할 수 있다. MES 는 탐색·감사 시나리오에서 이 엔드포인트를 사용하며, 생산 작업지시 생성 시에는 §5.4.1(/bom/resolved/{resolvedBomId}) 을 사용한다.'));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": {
    "standardBomId": "DHS-AE225-D-1",
    "standardBomVersion": 1,
    "standardBomName": "225mm 단열 중중연 이중창",
    "status": "RELEASED",
    "mbom": {
      "totalItems": 38,
      "assemblies": ["후렘(프레임) 공정 라인", "문짝 공정 라인"]
    },
    "config": {
      "totalOptionGroups": 6,
      "optionGroups": ["설치구성", "절단방식", "유리사양", "프레임재질", "색상", "부속"],
      "releasedConfigCount": 1
    },
    "changeNotes": "초기 릴리즈 — EBOM·MBOM·Config 통합 확정",
    "changedComponents": ["EBOM", "MBOM", "Config"],
    "releasedAt": "2026-04-01T10:00:00+09:00",
    "releasedBy": "yms@uniqsys.co.kr"
  },
  "meta": { ... }
}`));

children.push(h2('5.4 Resolved BOM API (MES 정규 연동)'));
children.push(p('구성형 BOM 은 표준BOM 버전 + 옵션 선택값 → Resolved BOM 의 구조이다. 6개 옵션 차원(설치구성, 절단방식, 유리사양, 프레임재질, 색상, 부속)의 조합에 따라 BOM 이 자동 해석된다.'));
children.push(...note([
  '단일 표준BOM 버전축 원칙:',
  '· standardBomId (불변) + standardBomVersion (정수 증분) → EBOM·MBOM·Config 세 구성요소의 원자적 묶음을 지칭',
  '· resolvedBomId = RBOM-{standardBomId}-sbv{standardBomVersion}-{optionsHash} — 3키 결정적 조합, 전역 유일·불변',
  '· 세 구성요소 중 하나라도 변경되면 standardBomVersion 이 상승하며, 이전 스냅샷은 보존됨',
]));
children.push(...note([
  '불변 스냅샷 원칙 (DE35-1 §6.2.4): standardBomVersion 이 RELEASED 되고 옵션값이 바인딩되는 순간 Resolved BOM 은 resolvedBomId 식별자의 불변 스냅샷 레코드로 동결된다. 주문은 생성 시점의 resolvedBomId 를 캡처하며, 이후 설계 변경이 있어도 해당 주문의 스냅샷은 변하지 않는다.',
]));
children.push(p('MES 노출 범위:', { bold: true }));
children.push(bullet('§5.3 표준BOM 마스터/버전 이력/버전 상세 (#3~#6): 탐색·감사·디버깅 시나리오'));
children.push(bullet([{ t: '§5.4.1 Resolved BOM 스냅샷 조회 (', bold: true }, { t: 'resolvedBomId', code: true }, { t: ' 기반, MES 정규 경로, #7)', bold: true }]));
children.push(spacer());
children.push(p('WIMS 내부 전용(MES 비노출):', { bold: true }));
children.push(p('옵션 그룹 조회(/options), 구성 생성·수정(POST/PUT /standard-bom), 옵션 조합 규칙 관리 등 영업·설계팀 작업용 API 는 별도 설계한다.'));
children.push(spacer());
children.push(p('운영 시나리오 (4가지):', { bold: true }));
children.push(p('1) 정상 플로우 (주문 기반 — MES 정규):', { bold: true, color: ACCENT }));
children.push(numbered(1, '영업·주문 생성 시 WIMS 가 현 시점 RELEASED 스냅샷의 resolvedBomId 를 주문 엔티티에 캡처(불변)'));
children.push(numbered(2, 'MES 가 주문 수신 시 resolvedBomId 전달받음'));
children.push(numbered(3, 'MES → §5.4.1 (/bom/resolved/{resolvedBomId}) 로 생산용 BOM 조회 — 한 번의 호출로 EBOM+MBOM+Config 완전 수신'));
children.push(numbered(4, 'MES 측 캐싱 키는 반드시 resolvedBomId 를 포함 (불변이므로 영구 캐싱 가능, TTL 불필요)'));
children.push(p('2) 탐색 플로우 (운영·디버깅):', { bold: true, color: ACCENT }));
children.push(numbered(1, '§5.3.3 표준BOM 버전 이력 → "언제 BOM 구성요소가 변경됐나" 확인 (changedComponents 필드)'));
children.push(numbered(2, '§5.3.4 특정 standardBomVersion 상세 → 해당 버전의 Config 목록 및 옵션 그룹 확인'));
children.push(numbered(3, '§5.4.1 로 스냅샷 직접 조회 (resolvedBomId 는 standardBomVersion + 옵션선택값으로 계산)'));
children.push(p('3) 감사 플로우:', { bold: true, color: ACCENT }));
children.push(bullet('주문 감사·리뷰 시 주문에 캡처된 resolvedBomId 로 §5.4.1 호출 → 불변 스냅샷이 언제나 원본 재현'));
children.push(bullet('설계 변경 이력은 §5.3.3 (standardBomVersion 이력 + changedComponents) 로 추적'));
children.push(p('4) ECO(Engineering Change Order) 플로우:', { bold: true, color: ACCENT }));
children.push(bullet('이미 스냅샷 바인딩된 주문에 설계 변경 반영이 필요하면 영업·생산 승인 ECO 프로세스를 거쳐 주문의 resolvedBomId 를 신규 스냅샷 ID 로 교체'));
children.push(bullet('교체 이력은 감사 로그로 보존 — 기존 스냅샷 자체는 삭제되지 않음'));

children.push(h3('5.4.1 Resolved BOM 스냅샷 조회 (MES 정규 경로, IF-MES-BOM-001)'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/bom/resolved/{resolvedBomId}', code: true }]));
children.push(p('MES 가 생산 작업지시 생성 시 사용하는 정규 엔드포인트. 주문 엔티티에 캡처된 resolvedBomId 로 불변 스냅샷을 조회한다. 동일 resolvedBomId 로 언제 호출해도 동일한 응답이 반환된다(멱등).', { bold: true }));
children.push(...note([
  '핵심 원칙 (DE35-1 §6.2.4):',
  '· 스냅샷은 불변(frozen) — 응답의 immutable: true, frozenAt 이후 데이터 변경 없음',
  '· MES 측 캐싱은 resolvedBomId 를 캐시 키에 포함하면 영구 캐싱 가능 (TTL 불필요)',
  '· 설계 변경은 새 resolvedBomId 로 반영되며, 기존 스냅샷에는 영향 없음',
  '· resolvedBomId 는 standardBomId + standardBomVersion + 옵션선택값 해시(3키) 로부터 결정적으로 생성되므로, 응답 본문에서도 3키(standardBomId, standardBomVersion, appliedOptionsHash) 를 함께 반환하여 역추적·감사 가능',
  '· 상위 키(standardBomVersion) 기반: 이 스냅샷의 모든 BOM 데이터는 해당 standardBomVersion 이 원자적으로 확정한 EBOM·MBOM·Config 묶음에서 파생된다.',
]));
children.push(p('응답 형식:', { bold: true }));
children.push(p('계층구조(tree) 단일 응답. MES 측에서 작업지시·자재불출 처리 시 leaf 노드 평탄화가 필요하면, tree 응답을 순회하여 processCode·workOrder·locationCode·actualQty 기준으로 전개한다 (본 문서는 tree 를 정규 계약으로 규정하며, 평탄화 방식·정렬 규칙은 MES 측 구현 자유).'));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": {
    "resolvedBomId": "RBOM-DHS-AE225-D-1-sbv1-a3f9c2b1",
    "standardBomId": "DHS-AE225-D-1",
    "standardBomVersion": 1,
    "standardBomName": "225mm 단열 중중연 이중창",
    "appliedOptionsHash": "a3f9c2b1",
    "bomType": "RESOLVED_MBOM",
    "status": "RELEASED",
    "immutable": true,
    "frozenAt": "2026-04-07T14:00:00+09:00",
    "releasedBy": "yms@uniqsys.co.kr",
    "totalItems": 38,
    "appliedOptions": {
      "설치구성": "외부창",
      "절단방식": "45도",
      "유리사양": "24mm 복층유리",
      "프레임재질": "AL 압출",
      "색상": "화이트",
      "부속": "기본"
    },
    "tree": [
      {
        "level": 0,
        "itemCode": "DHS-AE225-D-1",
        "itemName": "225mm 단열 중중연 이중창",
        "itemType": "PRODUCT",
        "qty": 1,
        "unit": "SET",
        "children": [
          {
            "level": 1,
            "itemCode": "HF-0007",
            "itemName": "조립후 가공품",
            "itemType": "ASSEMBLY",
            "processCode": "HF-0007",
            "processName": "미서기 조립",
            "workOrder": 1,
            "workCenter": "WC-FRAME",
            "children": [
              {
                "level": 2,
                "itemCode": "UNI-A225-101-HC",
                "itemName": "225-H-프레임-1",
                "itemType": "SEMI",
                "category": "반제품",
                "qty": 1,
                "unit": "EA",
                "processCode": "HF-0002",
                "processName": "미서기 피스홀 가공",
                "workOrder": 1,
                "locationCode": "H01",
                "children": [
                  {
                    "level": 3,
                    "itemCode": "UNI-A225-101A",
                    "itemName": "19년 225mm 1등급 미서기 후렘-외부 A",
                    "itemType": "RAW",
                    "category": "원자재",
                    "qty": 1,
                    "unit": "EA",
                    "theoreticalQty": 1,
                    "lossRate": null,
                    "actualQty": 1,
                    "locationCode": "H01",
                    "children": []
                  }
                ]
              },
              {
                "level": 2,
                "itemCode": "02-0094-1",
                "itemName": "후레임연결재-1(19년형)",
                "itemType": "SUB",
                "category": "부자재",
                "qty": 5,
                "unit": "EA",
                "theoreticalQty": 5,
                "lossRate": null,
                "actualQty": 5,
                "processCode": "HF-0006",
                "processName": "미서기 후렘 연결",
                "locationCode": null,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  "meta": { ... }
}`));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리 §4(공장 BOM — 후렘) / §7(반제품·공정 품번). 단가 필드는 자재 마스터 API(§5.5)에서 별도 제공.'));
children.push(...note('locationCode 필드 안내: 후렘·문짝 파일에서 사용되는 위치구분 코드. 후렘 파일 실 운용 값: H01~H04, W01~W03 / 문짝 파일 실 운용 값: H01, H03, W01, W02. 해당 위치구분 코드가 없는 자재(유리, 부자재 등)는 null 로 반환. H/W 명명 규칙 및 번호 부여 기준은 Q16 회신 대기 중.'));
children.push(p('Error Responses:', { bold: true }));
children.push(mkTable([
  ['HTTP', '코드', '상황'],
  ['404', 'RESOLVED_BOM_NOT_FOUND', '존재하지 않는 resolvedBomId'],
  ['410', 'RESOLVED_BOM_DEPRECATED', 'DEPRECATED 스냅샷 — 기존 주문 조회는 200 으로 허용, 신규 주문 바인딩 불가'],
], { widths: [10, 35, 55] }));

children.push(h2('5.5 자재 마스터 API'));

children.push(h3('5.5.1 자재 목록 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/materials', code: true }]));
children.push(p('Query Parameters:', { bold: true }));
children.push(mkTable([
  ['파라미터', '타입', '필수', '설명'],
  ['category', 'string', '', '자재 분류 (프레임, 원자재, 부자재)'],
  ['type', 'string', '', '자재 유형 필터'],
  ['keyword', 'string', '', '자재명/코드 검색'],
  ['page', 'int', '', '페이지 번호'],
  ['size', 'int', '', '페이지 크기'],
], { widths: [20, 15, 10, 55] }));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": [
    {
      "itemCode": "UNI-A225-101A",
      "itemName": "19년 225mm 1등급 미서기 후렘-외부 A",
      "category": "원자재",
      "itemType": "알루미늄 압출",
      "unit": "EA",
      "spec": "6.3",
      "material": "AL",
      "status": "ACTIVE"
    },
    {
      "itemCode": "UNI-A225-901B",
      "itemName": "19년 225mm 1등급 미서기 양후렘-내부 B",
      "category": "원자재",
      "itemType": "알루미늄 압출",
      "unit": "EA",
      "spec": "6.3",
      "material": "AL",
      "status": "ACTIVE"
    },
    {
      "itemCode": "02-0094-1",
      "itemName": "후레임연결재-1(19년형)",
      "category": "부자재",
      "itemType": "구매품",
      "unit": "EA",
      "spec": null,
      "material": null,
      "status": "ACTIVE"
    }
  ],
  "pagination": { ... },
  "meta": { ... }
}`));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리 §6(자재 마스터)'));

children.push(h3('5.5.2 자재 상세 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/materials/{itemCode}', code: true }]));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": {
    "itemCode": "UNI-A225-101A",
    "itemName": "19년 225mm 1등급 미서기 후렘-외부 A",
    "category": "원자재",
    "itemType": "알루미늄 압출",
    "unit": "EA",
    "spec": "6.3",
    "material": "AL",
    "supplier": null,
    "unitPrice": null,
    "status": "ACTIVE",
    "createdAt": "2026-01-15T10:00:00+09:00",
    "updatedAt": "2026-04-07T14:30:00+09:00"
  },
  "meta": { ... }
}`));
children.push(...note('거래처·단가는 자재 마스터에 포함하지 않음 — WIMS 내부 API 에서 자재-거래처 매핑 및 단가 이력 별도 제공 (FR-PM-003). 단가 체계 Q18 회신 대기 — 단가(U)/단가(H) 구분 미확정으로 단가 필드 미노출.'));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리 §6.1(UNI-* 프로파일 계열)'));

children.push(h2('5.6 공정 마스터 API'));

children.push(h3('5.6.1 공정 목록 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/processes', code: true }]));
children.push(p('Query Parameters:', { bold: true }));
children.push(mkTable([
  ['파라미터', '타입', '필수', '설명'],
  ['type', 'string', '', '공정 유형 (절단, 용접, 코팅, 조립 등)'],
  ['workCenter', 'string', '', '작업장 필터'],
  ['page', 'int', '', '페이지 번호'],
  ['size', 'int', '', '페이지 크기'],
], { widths: [20, 15, 10, 55] }));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": [
    {
      "processCode": "HF-0001",
      "processName": "미서기 배수홀 가공",
      "processType": "가공",
      "workCenter": "WC-FRAME",
      "unitPrice": null,
      "unit": "EA",
      "description": "배수홀 가공품 — W 계열 프레임 적용",
      "status": "ACTIVE"
    },
    {
      "processCode": "HF-0002",
      "processName": "미서기 피스홀 가공",
      "processType": "가공",
      "workCenter": "WC-FRAME",
      "unitPrice": null,
      "unit": "EA",
      "description": "피스홀 가공품 — H/W 계열 프레임 공용",
      "status": "ACTIVE"
    },
    {
      "processCode": "HF-0003",
      "processName": "미서기 가네고 가공",
      "processType": "가공",
      "workCenter": "WC-FRAME",
      "unitPrice": null,
      "unit": "EA",
      "description": "가네고 가공품 — H 계열 프레임 적용",
      "status": "ACTIVE"
    },
    {
      "processCode": "HF-0006",
      "processName": "미서기 후렘 연결",
      "processType": "조립",
      "workCenter": "WC-FRAME",
      "unitPrice": null,
      "unit": "EA",
      "description": "양후렘연결재 가공품 — H/W 계열 연결재 체결",
      "status": "ACTIVE"
    },
    {
      "processCode": "HF-0007",
      "processName": "미서기 조립",
      "processType": "조립",
      "workCenter": "WC-FRAME",
      "unitPrice": null,
      "unit": "EA",
      "description": "조립후 가공품 — 최종 조립 공정 (후렘·문짝 공용)",
      "status": "ACTIVE"
    }
  ],
  "pagination": { ... },
  "meta": { ... }
}`));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리 §7(반제품·공정 품번 HF-0001~HF-0007)'));

children.push(h3('5.6.2 공정 상세 조회'));
children.push(p([{ t: 'GET ', bold: true }, { t: '/api/external/v1/processes/{processCode}', code: true }]));
children.push(p('Response (200 OK):', { bold: true }));
children.push(...codeBlock(`{
  "success": true,
  "data": {
    "processCode": "HF-0002",
    "processName": "미서기 피스홀 가공",
    "processType": "가공",
    "workCenter": "WC-FRAME",
    "unitPrice": null,
    "unit": "EA",
    "description": "피스홀 가공품. H 계열(H01~H04) 및 W 계열(W01~W03) 프레임 공용 공정. 후렘(F) 시트 및 문짝(D) 시트 양쪽에 출현.",
    "requiredEquipment": null,
    "estimatedTime": null,
    "estimatedTimeUnit": null,
    "applicableMaterials": ["UNI-A225-101-HC", "UNI-A225-101-HC2", "UNI-A225-101-WC", "UNI-A225-101-WC-2"],
    "status": "ACTIVE",
    "createdAt": "2026-02-01T10:00:00+09:00",
    "updatedAt": "2026-04-07T11:00:00+09:00"
  },
  "meta": { ... }
}`));
children.push(...note('실데이터 출처: DHS-AE225-D-1 BOM 정리 §7(반제품·공정 품번 HF-0002 / F·D 시트 공용)'));

// ========== 6. 데이터 모델 (DTO) ==========
children.push(h1('6. 데이터 모델 (DTO)'));

children.push(h2('6.1 DTO 목록'));
children.push(mkTable([
  ['DTO 클래스', '용도', '사용 엔드포인트'],
  ['StandardBomSummaryDto', '표준BOM 목록 항목 (standardBomId 기준 마스터, latestStandardBomVersion 포함)', 'GET /bom/standard'],
  ['StandardBomMasterDto', '표준BOM 마스터 상세 (standardBomVersion 카운트, 최신 릴리즈 포인터)', 'GET /bom/standard/{standardBomId}'],
  ['StandardBomVersionSummaryDto', 'standardBomVersion 이력 항목 (status, totalItems, changedComponents, supersededAt)', 'GET /bom/standard/{standardBomId}/versions'],
  ['StandardBomVersionDetailDto', 'standardBomVersion 특정 버전 상세 (MBOM·Config 원자적 묶음 요약, changeNotes)', 'GET /bom/standard/{standardBomId}/versions/{standardBomVersion}'],
  ['ResolvedBomDto', 'Resolved BOM 스냅샷 (resolvedBomId + 3키: standardBomId·standardBomVersion·appliedOptionsHash, immutable, frozenAt, appliedOptions, tree) — MES 정규 (IF-MES-BOM-001)', 'GET /bom/resolved/{resolvedBomId}'],
  ['ResolvedBomNodeDto', 'Resolved BOM 트리 노드 (level, itemCode, itemType, qty, processCode, locationCode 등)', 'GET /bom/resolved/{resolvedBomId} (tree 배열 원소)'],
  ['MaterialDto', '자재 마스터', 'GET /materials'],
  ['MaterialDetailDto', '자재 상세 (거래처·단가는 WIMS 내부 API 별도 제공)', 'GET /materials/{code}'],
  ['ProcessDto', '공정 마스터', 'GET /processes'],
  ['ProcessDetailDto', '공정 상세', 'GET /processes/{code}'],
  ['TokenResponseDto', '토큰 발급 응답', 'POST /auth/token, /auth/refresh'],
  ['ApiResponseDto<T>', '공통 응답 래퍼', '전체'],
  ['ErrorResponseDto', '에러 응답', '전체 (에러 시)'],
  ['PaginationDto', '페이징 정보', '목록 조회 전체'],
], { widths: [24, 46, 30] }));

children.push(h2('6.2 BOM 데이터 필수 항목 (MES 팀 협의 기준)'));
children.push(p('DE35-1 §7 MES 연동 고려사항 기반:'));
children.push(mkTable([
  ['#', '항목', '필드명', '타입', '필수', '설명'],
  ['1', '품목코드', 'itemCode', 'string', '✓', 'DE35-1 §6.1 코드 체계 준수'],
  ['2', '품목명', 'itemName', 'string', '✓', '한글 자재명'],
  ['3', 'BOM 계층', 'level', 'int', '✓', '0(완제품)~3(원자재)'],
  ['4', '수량', 'qty', 'decimal', '✓', '이론 소요량'],
  ['5', '단위', 'unit', 'string', '✓', 'EA, SET, M, M2, KG 등'],
  ['6', '자재분류', 'category', 'string', '✓', '프레임, 원자재, 부자재, 공정'],
  ['7', '공정코드', 'processCode', 'string', '✓', 'MBOM 필수 (예: HF-0002 미서기 피스홀 가공)'],
  ['8', '작업순서', 'workOrder', 'int', '', 'MBOM 조립 순서'],
  ['9', '로스율', 'lossRate', 'decimal', '', '절단/조립 손실률'],
  ['10', '실소요량', 'actualQty', 'decimal', '', '이론 × (1 + 로스율)'],
  ['11', '작업장', 'workCenter', 'string', '', 'MES 작업장 코드'],
  ['12', '위치구분 코드', 'locationCode', 'string', '', '후렘·문짝 파일에서 사용되는 위치구분 코드. 후렘: H01~H04, W01~W03 / 문짝: H01, H03, W01, W02. 해당 없는 자재는 null'],
], { widths: [5, 15, 18, 12, 6, 44] }));

// ========== 7. 에러 처리 ==========
children.push(h1('7. 에러 처리'));

children.push(h2('7.1 HTTP 상태 코드'));
children.push(mkTable([
  ['코드', '의미', '사용 상황'],
  ['200', 'OK', '정상 응답'],
  ['400', 'Bad Request', '잘못된 요청 파라미터'],
  ['401', 'Unauthorized', '토큰 없음/만료/변조'],
  ['403', 'Forbidden', '권한 부족 (GET 외 메서드 시도 등)'],
  ['404', 'Not Found', '요청한 리소스 없음'],
  ['410', 'Gone', 'DEPRECATED 된 Resolved BOM 스냅샷 — 신규 주문 바인딩 불가 (기존 주문 조회는 200 허용)'],
  ['429', 'Too Many Requests', 'Rate Limit 초과'],
  ['500', 'Internal Server Error', '서버 내부 오류'],
], { widths: [10, 30, 60] }));

children.push(h2('7.2 에러 코드 체계'));
children.push(mkTable([
  ['에러 코드', 'HTTP 코드', '설명'],
  ['AUTH_TOKEN_EXPIRED', '401', 'JWT 토큰 만료'],
  ['AUTH_TOKEN_INVALID', '401', 'JWT 토큰 변조/잘못된 형식'],
  ['AUTH_UNAUTHORIZED', '403', '해당 리소스 접근 권한 없음'],
  ['AUTH_METHOD_NOT_ALLOWED', '403', '허용되지 않은 HTTP 메서드 (POST/PUT/DELETE 시도)'],
  ['FORBIDDEN_PREFIX', '403', 'MES 계정으로 /api/internal/** 경로 호출 시도'],
  ['BOM_NOT_FOUND', '404', 'BOM 데이터 없음'],
  ['BOM_NOT_RELEASED', '404', 'Released 상태의 BOM 없음'],
  ['RESOLVED_BOM_NOT_FOUND', '404', '존재하지 않는 resolvedBomId'],
  ['RESOLVED_BOM_DEPRECATED', '410', 'DEPRECATED 스냅샷 — 신규 주문 바인딩 불가 (MES 는 주문 상태와 함께 확인)'],
  ['MATERIAL_NOT_FOUND', '404', '자재 코드 조회 실패'],
  ['PROCESS_NOT_FOUND', '404', '공정 코드 조회 실패'],
  ['INVALID_PARAMETER', '400', '잘못된 요청 파라미터'],
  ['RATE_LIMIT_EXCEEDED', '429', 'API 호출 제한 초과'],
  ['INTERNAL_ERROR', '500', '서버 내부 오류'],
], { widths: [30, 14, 56] }));

children.push(h2('7.3 Rate Limiting'));
children.push(mkTable([
  ['항목', '제한'],
  ['분당 요청 수', '60 requests/min'],
  ['시간당 요청 수', '1,000 requests/hour'],
  ['초과 시 응답', '429 Too Many Requests + Retry-After 헤더'],
], { widths: [30, 70] }));

// ========== 8. 버전 관리 ==========
children.push(h1('8. 버전 관리'));

children.push(h2('8.1 버전 전략'));
children.push(mkTable([
  ['항목', '내용'],
  ['버전 표기', 'URI 경로 기반 (/api/external/v1/... → /api/external/v2/...). 내부 API 는 별도 prefix(/api/internal/v{N}) 로 독립 버저닝'],
  ['현재 버전', 'v1 (Phase 1)'],
  ['다음 버전', 'v2 (Phase 2 — 제조관리 연동 확장 시)'],
  ['하위 호환', 'v1 → v2 전환 시 v1 엔드포인트 최소 3개월 병행 운영'],
  ['Deprecation', '폐기 예정 엔드포인트는 Deprecated: true 응답 헤더 + 문서 공지'],
], { widths: [18, 82] }));

children.push(h2('8.2 v2 확장 예정 (Phase 2)'));
children.push(mkTable([
  ['엔드포인트', '방향', '설명'],
  ['POST /api/external/v2/measurements', 'MES→WIMS', '현장실측 데이터 수신'],
  ['GET /api/external/v2/drawings/{productCode}', 'MES←WIMS', '제작도 데이터 조회'],
  ['GET /api/external/v2/cutting-plans/{orderNo}', 'MES←WIMS', '절단 지시서 조회'],
], { widths: [45, 15, 40] }));

// ========== 9. 성능 요구사항 및 최적화 ==========
children.push(h1('9. 성능 요구사항 및 최적화'));

children.push(h2('9.1 성능 기준'));
children.push(mkTable([
  ['#', '항목', '목표', '측정 기준', '요구사항'],
  ['1', '단일 제품 BOM 조회', '평균 500ms, P99 2초 이내', 'API 호출 → JSON 응답 완료', 'NFR-PF-PM-002'],
  ['2', '자재 마스터 목록 (1만건)', '5초 이내', '페이징 적용 기준', 'NFR-PF-PM-001'],
  ['3', '동시 접속', '30인 기준 안정성 보장', '에러율 0%', 'NFR-PF-CM-002'],
], { widths: [5, 22, 25, 30, 18] }));

children.push(h2('9.2 최적화 전략'));
children.push(mkTable([
  ['#', '전략', '적용 대상', '설명'],
  ['1', '응답 캐싱', 'BOM 트리 조회', 'Resolved BOM 스냅샷(§5.4.1) 은 불변이므로 resolvedBomId 키 기반 영구 캐싱(TTL 불필요). 표준BOM 마스터/버전(§5.3) 은 RELEASED 상태 메모리 캐시 TTL 5분 (DEPRECATED/ECO 반영 지연 허용치)'],
  ['2', 'DB 연결 풀링', '전체', 'HikariCP 연결 풀 (최소 5, 최대 20)'],
  ['3', '페이징', '목록 조회', '대량 데이터는 반드시 페이징 처리 (최대 100건/페이지)'],
  ['4', 'N+1 해결', 'BOM 트리', 'Fetch Join 또는 배치 로딩으로 쿼리 최적화'],
  ['5', '캐시 무효화', 'BOM 변경 시', 'BOM Released 상태 변경 시 해당 제품 캐시 즉시 무효화'],
], { widths: [5, 18, 20, 57] }));

// ========== 10. MES팀 협의 사항 ==========
children.push(h1('10. MES팀 협의 사항'));

children.push(h2('10.1 협의 완료 항목'));
children.push(mkTable([
  ['#', '항목', '합의 내용', '합의일'],
  ['1', '연동 방식', 'DB 직접 → REST API 변경', '2026.03 (개발계획서 v1.2)'],
  ['2', '데이터 방향', 'Phase 1: MES→WIMS 조회(단방향)', '2026.03'],
  ['3', '데이터 범위', 'Resolved MBOM, 자재 마스터, 공정 마스터', '2026.03'],
], { widths: [5, 20, 45, 30] }));

children.push(h2('10.2 협의 필요 항목 (Gate 1 전 확정 필요)'));
children.push(mkTable([
  ['#', '항목', '현재 상태', '협의 대상', '목표일'],
  ['1', 'MES 서비스 계정 ID/Secret', '미확정 (초안: mes-service)', '배봉균', 'S1 내'],
  ['2', 'MES 서버 IP (화이트리스트)', '미확정', '배봉균', 'S1 내'],
  ['3', 'MES 작업장 코드 체계', '초안 (WC-FRAME 등)', '신세은', 'S2 초'],
  ['4', 'BOM 데이터 캐싱 허용 여부 및 TTL', '초안 (5분)', '배봉균', 'S2 초'],
  ['5', 'Rate Limit 적정 수준', '초안 (60 req/min)', '배봉균', 'S2 초'],
  ['6', 'v2 확장 범위 (Phase 2)', '예비 정의', '전체', 'S6'],
], { widths: [5, 28, 30, 20, 17] }));

children.push(h2('10.3 MES팀 검증 계획'));
children.push(mkTable([
  ['시점', '활동', '참여자'],
  ['S2 (04.20~05.03)', 'API 규격서 최종 리뷰 및 서명', '배봉균, 신세은'],
  ['S3 (05.04~05.17)', 'Mock API 기반 연동 사전 테스트', 'MES팀'],
  ['S4 (05.18~05.31)', '실 API 연동 테스트', 'MES팀 + BE팀(김진호)'],
  ['S5 (06.01~06.14)', '운영 환경 연동 검증 → Gate 3', 'MES팀 + PM'],
], { widths: [20, 45, 35] }));

// ========== 부록 A ==========
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1('부록 A. Swagger/OpenAPI 3.0 명세 (요약)'));
children.push(...note('전체 OpenAPI 명세는 별도 파일(openapi-wims-v1.yaml)로 관리하며, 서버 배포 시 Swagger UI(/api-docs)에서 인터랙티브 문서를 제공한다.'));
children.push(...codeBlock(`openapi: 3.0.3
info:
  title: WIMS 2.0 MES Integration API
  version: "1.7.0"
  description: MES 시스템 연동을 위한 BOM, 자재, 공정 데이터 조회 API (외부 API 전용)
  contact:
    name: 코드크래프트 BE팀
    email: dev@codecraft.example.com
servers:
  - url: https://api.wims.example.com/api/external/v1
    description: Production
  - url: https://stg-api.wims.example.com/api/external/v1
    description: Staging
security:
  - bearerAuth: []
paths:
  /bom/standard:
    get:
      summary: 표준BOM 목록 조회 (standardBomId 기준 마스터)
      tags: [BOM]
      ...
  /bom/standard/{standardBomId}:
    get:
      summary: 표준BOM 마스터 조회
      tags: [BOM]
      ...
  /bom/standard/{standardBomId}/versions:
    get:
      summary: 표준BOM 버전 이력 조회
      tags: [BOM]
      ...
  /bom/standard/{standardBomId}/versions/{standardBomVersion}:
    get:
      summary: 표준BOM 특정 버전 상세 (EBOM+MBOM+Config 원자적 묶음)
      tags: [BOM]
      ...
  /bom/resolved/{resolvedBomId}:
    get:
      summary: Resolved BOM 스냅샷 조회 (MES 정규 경로, IF-MES-BOM-001)
      tags: [BOM]
      ...
  /materials:
    get:
      summary: 자재 마스터 목록 조회
      tags: [Material]
      ...
  /materials/{itemCode}:
    get:
      summary: 자재 상세 조회
      tags: [Material]
      ...
  /processes:
    get:
      summary: 공정 마스터 목록 조회
      tags: [Process]
      ...
  /processes/{processCode}:
    get:
      summary: 공정 상세 조회
      tags: [Process]
      ...
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`));

// ========== 승인 ==========
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h1('승인'));
children.push(p('본 문서의 내용은 아래와 같이 승인되었음을 확인합니다.'));
children.push(spacer());
children.push(mkTable([
  ['구분', '소속', '역할', '성명', '서명', '일자'],
  ['작성', '코드크래프트', 'BE', '김진호', '', '2026.04.14'],
  ['검토', '코드크래프트', 'PM', '김지광', '', ''],
  ['검토', 'MES팀', 'MES 담당', '배봉균', '', ''],
  ['검토', 'MES팀', 'MES 담당', '신세은', '', ''],
  ['승인', '유니크시스템', '사업주', '유미숙', '', ''],
], { widths: [10, 18, 16, 14, 22, 20] }));

// ─────────────────────────────────────────────────────────────
// 문서 객체 구성 & 저장
// ─────────────────────────────────────────────────────────────
const doc = new Document({
  creator: 'CodeCraft',
  title: 'WIMS2.0 DE24-1 인터페이스 설계서 (MES REST API) v1.7',
  description: 'WIMS ↔ MES 외부 API 명세',
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

const outPath = path.resolve(__dirname, '../산출물/3_DE(설계)/WIMS2.0_DE24-1_인터페이스설계서_MES_REST_API_v1.7.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log('생성 완료:', outPath, `(${(buf.length / 1024).toFixed(1)} KB)`);
});
