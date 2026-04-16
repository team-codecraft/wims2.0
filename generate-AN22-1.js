/**
 * WIMS2.0_AN22-1_현행데이터분석서_v1.0.docx 생성 스크립트
 * 실행: node generate-AN22-1.js
 */
const docx = require("docx");
const fs = require("fs");

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, TableOfContents,
  PageBreak, Header, Footer, PageNumber, NumberFormat, Tab, TabStopType,
  ShadingType, VerticalAlign, ImageRun, convertInchesToTwip
} = docx;

// ─── 색상 상수 ───
const PRIMARY = "1F4E79";
const ACCENT = "2E75B6";
const HEADER_BG = "D6E4F0";
const LIGHT_BG = "F2F7FB";
const WHITE = "FFFFFF";
const BLACK = "000000";
const GRAY = "666666";
const LIGHT_GRAY = "E0E0E0";

// ─── 공통 스타일 헬퍼 ───
function heading1(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: "맑은 고딕", color: PRIMARY })],
  });
}
function heading2(text) {
  return new Paragraph({
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 26, font: "맑은 고딕", color: ACCENT })],
  });
}
function heading3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, font: "맑은 고딕", color: PRIMARY })],
  });
}
function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 20, font: "맑은 고딕", color: opts.color || BLACK, bold: opts.bold || false, italics: opts.italics || false })],
  });
}
function emptyLine() {
  return new Paragraph({ spacing: { after: 100 }, children: [] });
}

// ─── 테이블 헬퍼 ───
function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: PRIMARY },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text, bold: true, size: 18, font: "맑은 고딕", color: WHITE })]
    })],
  });
}
function dataCell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: opts.shading ? { type: ShadingType.SOLID, color: opts.shading } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text: text || "", size: 18, font: "맑은 고딕", color: opts.color || BLACK, bold: opts.bold || false })]
    })],
  });
}
function makeTable(headers, rows, widths) {
  const hRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => headerCell(h, widths[i])),
  });
  const dRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((c, ci) => dataCell(c, widths[ci], {
        center: ci === 0,
        shading: ri % 2 === 1 ? LIGHT_BG : undefined
      })),
    })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [hRow, ...dRows],
  });
}

// ─── 표지 ───
function coverPage() {
  return [
    emptyLine(), emptyLine(), emptyLine(), emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: "WIMS 시스템 개선 개발", size: 28, font: "맑은 고딕", color: ACCENT })]
    }),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "AN22-1", size: 56, bold: true, font: "맑은 고딕", color: PRIMARY })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "현행 데이터 분석서", size: 44, bold: true, font: "맑은 고딕", color: PRIMARY })]
    }),
    emptyLine(), emptyLine(),
    new Table({
      width: { size: 50, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          dataCell("문서 버전", 40, { bold: true, shading: HEADER_BG, center: true }),
          dataCell("v1.0", 60, { center: true }),
        ]}),
        new TableRow({ children: [
          dataCell("작성일", 40, { bold: true, shading: HEADER_BG, center: true }),
          dataCell("2026. 04. 07.", 60, { center: true }),
        ]}),
        new TableRow({ children: [
          dataCell("산출물 코드", 40, { bold: true, shading: HEADER_BG, center: true }),
          dataCell("AN22-1", 60, { center: true }),
        ]}),
        new TableRow({ children: [
          dataCell("작성자", 40, { bold: true, shading: HEADER_BG, center: true }),
          dataCell("김성현 (BA, 코드크래프트)", 60, { center: true }),
        ]}),
        new TableRow({ children: [
          dataCell("검토자", 40, { bold: true, shading: HEADER_BG, center: true }),
          dataCell("김지광 (PM, 코드크래프트)", 60, { center: true }),
        ]}),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 변경이력 ───
function changeHistory() {
  return [
    heading1("변경 이력"),
    makeTable(
      ["버전", "일자", "작성자", "검토자", "변경 내용"],
      [
        ["v1.0", "2026.04.07", "김성현", "김지광", "초안 — 현행 시스템 데이터 구조 분석 (7개 도메인, 추정 테이블 45+)"],
      ],
      [10, 15, 12, 12, 51]
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 목차 ───
function tableOfContents() {
  const tocItems = [
    ["1.", "개요", 3], ["1.1", "목적", 3], ["1.2", "분석 범위 및 방법", 3], ["1.3", "참조 문서", 3],
    ["2.", "현행 시스템 아키텍처 개요", 4], ["2.1", "기술 스택", 4], ["2.2", "데이터 흐름 개요", 4],
    ["3.", "현행 데이터 도메인 분석", 5], ["3.1", "데이터 도메인 전체 현황", 5],
    ["3.2", "인증·사용자 도메인", 6], ["3.3", "프로젝트 도메인", 7],
    ["3.4", "자재·제품 도메인", 8], ["3.5", "견적설계 도메인", 10],
    ["3.6", "계약·발주 도메인", 11], ["3.7", "도면·CAD 도메인", 12],
    ["3.8", "시스템·공통 도메인", 13],
    ["4.", "현행 데이터 문제점 분석", 14], ["4.1", "데이터 구조 문제", 14], ["4.2", "데이터 품질 문제", 15], ["4.3", "데이터 연동 문제", 15],
    ["5.", "현행 → To-Be 데이터 전환 방향", 16], ["5.1", "전환 전략 개요", 16], ["5.2", "도메인별 전환 방향", 16],
    ["6.", "결론 및 후속 과제", 17],
  ];
  const items = tocItems.map(([num, title, page]) =>
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: num.includes(".") && num.length > 2 ? 400 : 0 },
      children: [
        new TextRun({ text: `${num} ${title}`, size: 20, font: "맑은 고딕", bold: !num.includes(".") || num.length <= 2 }),
        new TextRun({ text: `\t${page}`, size: 20, font: "맑은 고딕" }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
    })
  );
  return [
    heading1("목 차"),
    ...items,
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 1. 개요 ───
function section1() {
  return [
    heading1("1. 개요"),
    heading2("1.1 목적"),
    bodyText("본 문서는 WIMS(Window & Curtain Wall Information Management System) 현행 시스템의 데이터 구조를 분석하여 WIMS 2.0 설계의 기초 자료를 제공한다. 현행 시스템의 데이터 도메인, 주요 엔티티, 속성, 관계를 체계적으로 정리하고, 데이터 품질 문제와 구조적 한계를 식별하여 To-Be 데이터 모델 설계(DE32-1)의 근거를 확보한다."),
    heading2("1.2 분석 범위 및 방법"),
    heading3("1.2.1 분석 범위"),
    bodyText("• 현행 WIMS 시스템의 프론트엔드(Vue.js) 코드 기반 데이터 구조 역분석"),
    bodyText("• 현행 API 엔드포인트(80+개) 기반 백엔드 데이터 모델 추정"),
    bodyText("• Vuex 상태관리 모듈(18개) 기반 데이터 흐름 분석"),
    bodyText("• 현행 화면(59개 페이지) 기반 CRUD 패턴 분석"),
    heading3("1.2.2 분석 방법"),
    makeTable(
      ["방법", "대상", "산출물"],
      [
        ["코드 역분석", "unique-fe-static (master, 2023-08-07)", "API 호출 패턴, Vuex 스토어 구조"],
        ["화면 기능 분석", "AN21 사이트맵 59개 페이지", "화면별 데이터 항목, CRUD 매핑"],
        ["업무흐름 분석", "AN21-1~5 업무흐름도", "도메인별 데이터 흐름"],
        ["BOM 구조 분석", "DE35-1, BOM 고찰", "자재/제품/BOM 데이터 모델"],
        ["설문 결과 분석", "AN11-2 설문결과서", "현업 데이터 불편사항"],
      ],
      [20, 40, 40]
    ),
    heading2("1.3 참조 문서"),
    makeTable(
      ["문서코드", "문서명", "버전", "비고"],
      [
        ["AN21", "현행시스템 사이트맵", "v1.0", "59개 페이지 구조, API 80+개"],
        ["AN21-1~5", "서브시스템별 업무흐름도", "v1.0", "As-Is/To-Be 프로세스"],
        ["AN11-2", "사전설문조사 결과서", "v1.0", "현업 79건 응답, 핵심 13건"],
        ["AN12-1-P1", "요구사항정의서 Phase 1", "v1.0", "기능 23건, 비기능 34건"],
        ["DE35-1", "미서기이중창 표준BOM구조 정의서", "v1.1", "BOM 계층, 자재 분류"],
        ["DE35-1 부록D", "BOM 구성에 대한 고찰", "v1.1", "EBOM/MBOM 분리 모델"],
      ],
      [15, 30, 10, 45]
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 2. 현행 시스템 아키텍처 개요 ───
function section2() {
  return [
    heading1("2. 현행 시스템 아키텍처 개요"),
    heading2("2.1 기술 스택"),
    makeTable(
      ["계층", "기술", "버전/비고"],
      [
        ["프론트엔드", "Vue.js (Options API) + Vuex + Vue Router", "Vue 2.x 기반, SPA"],
        ["상태관리", "Vuex", "18개 모듈, 중앙 집중식"],
        ["백엔드", "Express.js (Node.js)", "REST API, 세션 기반 인증"],
        ["데이터베이스", "MariaDB", "관계형 DB, InnoDB"],
        ["인증", "세션(Cookie) 기반", "JWT 미적용"],
        ["파일저장", "서버 로컬 스토리지", "S3 미적용"],
      ],
      [20, 35, 45]
    ),
    heading2("2.2 데이터 흐름 개요"),
    bodyText("현행 시스템의 데이터 흐름은 다음과 같은 3-tier 구조를 따른다:"),
    emptyLine(),
    bodyText("  [Vue.js SPA] ←→ [Express.js REST API] ←→ [MariaDB]"),
    emptyLine(),
    bodyText("• 프론트엔드: Vuex 스토어를 통한 상태 관리, API 호출로 데이터 CRUD"),
    bodyText("• 백엔드: Express.js 라우터 기반 REST API (약 80+ 엔드포인트)"),
    bodyText("• 데이터베이스: MariaDB 단일 인스턴스, 트랜잭션 기반 데이터 처리"),
    bodyText("• 외부 연동: 없음 (MES 연동 미구현, 외부 API 호출 없음)"),
    heading3("2.2.1 Vuex 상태관리 모듈 구성"),
    makeTable(
      ["#", "모듈명", "용도", "주요 데이터"],
      [
        ["1", "auth", "인증 및 사용자 정보", "로그인 사용자, 권한, 세션"],
        ["2", "project", "프로젝트 데이터", "프로젝트 목록, 기본정보, 멤버"],
        ["3", "material", "자재 데이터", "원자재, 부품재, 구성원자재"],
        ["4", "product", "제품 데이터", "판매제품, 순번, 분류, 제작/시공비"],
        ["5", "estimate", "견적 데이터", "견적 분석, 설정, 계산, 예산"],
        ["6", "contract", "계약 데이터", "계약 현황, 대시보드 통계"],
        ["7", "order", "발주 데이터", "발주 목록, 발주서, 발주 현황"],
        ["8", "calculate", "실행예산 계산", "별도비, 제작비, 시공비, 수수료"],
        ["9", "partners", "거래처 데이터", "자재 거래처, 부품 거래처"],
        ["10", "sections", "CAD 섹션 데이터", "도면 섹션, 건축 요소"],
        ["11", "blueprint", "도면 데이터", "도면 세트, 블루프린트"],
        ["12", "system", "시스템 관리", "사용자 목록, 그룹"],
        ["13", "ui", "UI 상태", "헤더, 모달, 로더, GNB"],
        ["14", "resources", "공유 리소스", "공통 코드, 참조 데이터"],
        ["15", "identification", "식별번호 데이터", "견적 식별번호"],
        ["16", "comment", "코멘트", "체크리스트 코멘트"],
        ["17", "files", "파일 관리", "폴더/파일 트리"],
        ["18", "selector", "뷰어 선택기", "도면 선택 상태"],
      ],
      [5, 15, 25, 55]
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 3. 현행 데이터 도메인 분석 ───
function section3() {
  return [
    heading1("3. 현행 데이터 도메인 분석"),
    heading2("3.1 데이터 도메인 전체 현황"),
    bodyText("현행 시스템의 데이터를 API 엔드포인트, Vuex 모듈, 화면 구성을 기반으로 7개 도메인으로 분류하였다. 실제 DB 스키마가 아닌 프론트엔드 코드 역분석 기반의 추정 구조이므로, 실 DB 스키마 확인 시 보완이 필요하다."),
    emptyLine(),
    makeTable(
      ["#", "도메인", "추정 테이블 수", "주요 엔티티", "관련 API", "Vuex 모듈"],
      [
        ["1", "인증·사용자", "3~4", "User, Group, Auth", "6개", "auth, system"],
        ["2", "프로젝트", "5~7", "Project, Member, Checklist, File, Directory", "12+개", "project, files, comment"],
        ["3", "자재·제품", "8~12", "Material, GroupMaterial, Product, ProductPart, Category, PriceMap", "13개", "material, product"],
        ["4", "견적설계", "10~15", "Estimate, Blueprint, Section, Element, Budget, Extra, Identification", "15+개", "estimate, sections, blueprint, identification"],
        ["5", "계약·발주", "8~12", "Contract, Order, OrderForm, CuttingPlan, Coating, Process, Stock, Partner", "19+개", "contract, order, calculate, partners"],
        ["6", "도면·CAD", "5~8", "Blueprint, BlueprintSet, Section, Element (Window/Door/Mullion 등)", "5+개", "blueprint, sections, selector"],
        ["7", "시스템·공통", "3~5", "CodeMaster, Setting, Group", "4개", "ui, resources, system"],
      ],
      [5, 13, 12, 30, 10, 30]
    ),
    bodyText("총 추정 테이블 수: 45~65개 (프론트엔드 역분석 기반)", { bold: true }),

    // ─── 3.2 인증·사용자 ───
    new Paragraph({ children: [new PageBreak()] }),
    heading2("3.2 인증·사용자 도메인"),
    heading3("3.2.1 도메인 개요"),
    bodyText("사용자 인증, 권한 관리, 그룹 관리를 담당하는 도메인이다. 세션 기반 인증 방식을 사용하며, 4단계 권한 체계(SUPER, PR_MEM, ARCH_MEM, MEM)로 접근 제어를 수행한다."),
    heading3("3.2.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (화면/API 기반 추정)", "비고"],
      [
        ["USER", "시스템 사용자", "userNo(PK), email, password, name, position, team, authority(SUPER/PR_MEM/ARCH_MEM/MEM), status", "초대코드 기반 가입"],
        ["USER_GROUP", "사용자 그룹/팀", "groupId(PK), groupName, description", "시스템관리에서 관리"],
        ["AUTH_SESSION", "인증 세션", "sessionId, userNo(FK), loginAt, expireAt", "Cookie 기반 세션"],
        ["INVITE_CODE", "초대 코드", "code(PK), email, usedYn, createdAt", "회원가입용"],
      ],
      [15, 15, 50, 20]
    ),
    heading3("3.2.3 API 엔드포인트"),
    makeTable(
      ["메서드", "엔드포인트", "기능", "데이터 항목"],
      [
        ["POST", "/auth", "로그인", "email, password → session"],
        ["GET", "/auth", "현재 사용자 조회", "→ user info + authority"],
        ["PUT", "/auth", "프로필 수정", "name, position, team"],
        ["PUT", "/auth/password", "비밀번호 변경", "currentPassword, newPassword"],
        ["GET", "/auth/code/:code", "초대코드 검증", "→ email, valid"],
        ["POST", "/auth/code/:code", "초대코드 가입", "email, password, name"],
        ["GET/POST", "/user", "사용자 관리", "CRUD (SUPER 전용)"],
        ["DELETE", "/user/:userNo", "사용자 삭제", "SUPER 전용"],
        ["GET", "/user/groups", "그룹 목록", "→ group list"],
      ],
      [10, 25, 20, 45]
    ),

    // ─── 3.3 프로젝트 ───
    new Paragraph({ children: [new PageBreak()] }),
    heading2("3.3 프로젝트 도메인"),
    heading3("3.3.1 도메인 개요"),
    bodyText("건설 프로젝트(수주 건)를 중심으로 기본정보, 멤버(담당자), 체크리스트, 파일, 견적, 발주를 연결하는 핵심 도메인이다. 프로젝트가 다른 도메인(견적, 발주, 계약)의 상위 컨텍스트 역할을 한다."),
    heading3("3.3.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (화면/API 기반 추정)", "비고"],
      [
        ["PROJECT", "프로젝트(수주 건)", "projectNo(PK), projectName, projectType(유치원~군부대 7종), address, startDate, endDate, contractType(조달/사급/물품입찰/공사입찰/수의 5종), materialGrade(우수/마스일반), status, createdBy, createdAt", "핵심 마스터"],
        ["PROJECT_MEMBER", "프로젝트 담당자", "projectNo(FK), userNo(FK), role", "N:M 관계"],
        ["CHECKLIST", "체크리스트", "checklistId(PK), projectNo(FK), type(공통/설계노트), version, content, imageUrl, date, assignee, confirmedBy", "이미지+텍스트"],
        ["DIRECTORY", "파일 폴더 구조", "directoryId(PK), projectNo(FK), parentId, name, type(folder/file)", "트리 구조"],
        ["FILE", "업로드 파일", "fileId(PK), directoryId(FK), fileName, fileType, fileSize, uploadedBy, uploadedAt", "서버 로컬 저장"],
        ["PROJECT_FAVORITE", "즐겨찾기", "projectNo(FK), userNo(FK)", "N:M 관계"],
        ["PROJECT_STATUS_LOG", "상태 변경 이력", "logId, projectNo(FK), prevStatus, newStatus, changedBy, changedAt", "이력 추적"],
      ],
      [18, 12, 50, 20]
    ),
    heading3("3.3.3 데이터 관계"),
    bodyText("• PROJECT 1:N CHECKLIST — 하나의 프로젝트에 여러 체크리스트"),
    bodyText("• PROJECT 1:N DIRECTORY — 프로젝트별 파일 폴더 구조"),
    bodyText("• DIRECTORY 1:N FILE — 폴더별 파일 관리"),
    bodyText("• PROJECT N:M USER — PROJECT_MEMBER를 통한 담당자 매핑"),
    bodyText("• PROJECT 1:N ESTIMATE — 하나의 프로젝트에 여러 견적"),
    bodyText("• PROJECT 1:N ORDER — 하나의 프로젝트에 여러 발주"),

    // ─── 3.4 자재·제품 ───
    new Paragraph({ children: [new PageBreak()] }),
    heading2("3.4 자재·제품 도메인"),
    heading3("3.4.1 도메인 개요"),
    bodyText("창호 제조에 필요한 원자재, 부품재, 구성원자재, 판매제품을 관리하는 핵심 도메인이다. 현행 시스템에서 가장 만족도가 낮은 영역(1.33/5.0)이며, BOM 체계 미구현, 자재코드 중복 등 다수의 데이터 구조 문제가 존재한다."),
    heading3("3.4.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (화면/API 기반 추정)", "비고"],
      [
        ["MATERIAL_RAW", "원자재", "materialNo(PK), materialId(자재ID), materialName, productCategory(커튼월~방충망 8종), materialCategory, materialType, weight, height, width, thickness, partnerId(FK)", "중복코드 가능"],
        ["MATERIAL_SUB", "부품재(부자재)", "materialNo(PK), materialId, materialName, category, type, spec", "메뉴 HIDDEN"],
        ["GROUP_MATERIAL", "구성원자재", "groupMaterialNo(PK), groupName, productCategory, categoryType, weight, width, thickness, glassThickness", "자재 그룹"],
        ["GROUP_MATERIAL_ATTR", "구성원자재 속성", "attrId(PK), groupMaterialNo(FK), attrName, attrValue", "속성설정"],
        ["PRODUCT", "판매 제품", "productNo(PK), productName, category(8종), grade(우수/일반), material(AL/복합), insulation(Y/N), status(판매/단종)", "제품 마스터"],
        ["PRODUCT_PART", "제품 부품 구성", "partId(PK), productNo(FK), materialNo(FK), partType, tolerance, condition", "수동 매핑"],
        ["PRODUCT_SEQUENCE", "제품 순번", "productNo(FK), sequenceNo, sortOrder", "정렬 관리"],
        ["PRODUCT_PRICE", "제작/시공비", "priceId(PK), productNo(FK), priceType(제작/시공), unitPrice", "수동 설정"],
        ["PRODUCT_CATEGORY", "제품 분류 코드", "categoryId(PK), categoryName, parentId", "8종 분류"],
      ],
      [18, 12, 50, 20]
    ),
    heading3("3.4.3 제품 분류 체계"),
    makeTable(
      ["#", "분류명", "코드", "설명"],
      [
        ["1", "커튼월", "CW", "건물 외벽 유리 커튼월"],
        ["2", "미서기", "SLD", "좌우 슬라이딩 창"],
        ["3", "이중 미서기", "DSLD", "2중 슬라이딩 창"],
        ["4", "갤러리", "GAL", "갤러리형 창호"],
        ["5", "벤트", "VNT", "환기용 창호"],
        ["6", "교실출입문", "CLS", "학교 교실 출입문"],
        ["7", "시스템도어", "SYS", "시스템 도어"],
        ["8", "방충망", "SCR", "방충망 제품"],
      ],
      [5, 20, 10, 65]
    ),
    heading3("3.4.4 데이터 관계"),
    bodyText("• PRODUCT 1:N PRODUCT_PART — 제품별 구성 부품(수동 매핑)"),
    bodyText("• PRODUCT_PART N:1 MATERIAL_RAW — 부품이 원자재 참조"),
    bodyText("• PRODUCT 1:N PRODUCT_PRICE — 제품별 제작/시공비 단가"),
    bodyText("• GROUP_MATERIAL 1:N GROUP_MATERIAL_ATTR — 구성원자재 속성"),
    bodyText("• PRODUCT N:1 PRODUCT_CATEGORY — 제품 분류 (8종)"),
    emptyLine(),
    bodyText("※ BOM 계층 구조(Product → Assembly → Part → Material) 미구현", { bold: true, color: "CC0000" }),
    bodyText("※ 자재-거래처 간 단가 이력 관리 미구현", { bold: true, color: "CC0000" }),

    // ─── 3.5 견적설계 ───
    new Paragraph({ children: [new PageBreak()] }),
    heading2("3.5 견적설계 도메인"),
    heading3("3.5.1 도메인 개요"),
    bodyText("프로젝트에 연결된 견적 분석, CAD 도면 기반 설계, 실행예산 산출을 관리하는 도메인이다. 도면 뷰어(Canvas 기반)와 연동되어 건축 요소를 시각적으로 분석하고, 견적서/주문서를 출력하는 기능을 포함한다."),
    heading3("3.5.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (화면/API 기반 추정)", "비고"],
      [
        ["ESTIMATE", "견적 마스터", "estimateNo(PK), projectNo(FK), estimateName, status, createdBy, createdAt", "프로젝트 하위"],
        ["ESTIMATE_EXTRA", "견적 별도비", "estimateExtraNo(PK), estimateNo(FK), itemName, amount, type", "추가 비용"],
        ["ESTIMATE_CONFIG", "견적 설정", "configId(PK), estimateNo(FK), productNo(FK), settings(JSON)", "제품별 설정"],
        ["IDENTIFICATION", "식별번호", "identificationNo(PK), estimateNo(FK), code, type", "견적서 출력용"],
        ["BUDGET", "예산", "budgetNo(PK), projectNo(FK), estimateNo(FK)", "실행예산 마스터"],
        ["BUDGET_MANUFACTURE", "제작비", "id, budgetNo(FK), items, unitPrice, qty", "제작비 시트"],
        ["BUDGET_CONSTRUCTION", "시공비", "id, budgetNo(FK), items, unitPrice, qty", "시공비 시트"],
        ["BUDGET_COMMISSION", "수수료", "id, budgetNo(FK), rate, amount", "수수료 시트"],
        ["BUDGET_EXTRA", "별도비", "id, budgetNo(FK), itemName, amount", "별도비 시트"],
      ],
      [18, 12, 48, 22]
    ),

    // ─── 3.6 계약·발주 ───
    new Paragraph({ children: [new PageBreak()] }),
    heading2("3.6 계약·발주 도메인"),
    heading3("3.6.1 도메인 개요"),
    bodyText("계약 현황 관리, 발주 프로세스(발주서 생성, 코팅 설정, 절단 계획, 공정 설정), 재고 관리, 거래처 관리를 포괄하는 도메인이다."),
    heading3("3.6.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (화면/API 기반 추정)", "비고"],
      [
        ["CONTRACT", "계약", "contractId, estimateNo(FK), contractStatus, contractDate", "견적 기반"],
        ["ORDER", "발주", "orderNo(PK), projectNo(FK), orderType, status, createdAt", "프로젝트 하위"],
        ["ORDER_FORM", "발주서", "orderFormNo(PK), orderNo(FK), formData, status", "출력 문서"],
        ["ORDER_COATING", "코팅 설정", "coatingId, orderNo(FK), color, coatingType, spec", "색상/코팅"],
        ["ORDER_CUTTING_PLAN", "절단 계획", "cuttingId, orderNo(FK), materialNo, cutLength, qty", "자재 절단"],
        ["ORDER_PROCESS", "공정 설정", "processId, orderNo(FK), processType, processOrder", "공정 순서"],
        ["ORDER_STOCK", "재고 현황", "stockId, orderNo(FK), materialNo, qty, usedQty", "재고 사용"],
        ["PARTNER", "거래처", "partnerNo(PK), partnerName, partnerType(원자재/부품), contact, address", "공급 업체"],
      ],
      [18, 12, 48, 22]
    ),
    heading3("3.6.3 데이터 관계"),
    bodyText("• CONTRACT N:1 ESTIMATE — 견적 기반 계약 체결"),
    bodyText("• ORDER 1:N ORDER_FORM — 발주당 여러 발주서"),
    bodyText("• ORDER 1:1 ORDER_COATING — 발주별 코팅 설정"),
    bodyText("• ORDER 1:N ORDER_CUTTING_PLAN — 발주별 절단 계획"),
    bodyText("• ORDER 1:N ORDER_STOCK — 발주별 재고 현황"),
    bodyText("• PARTNER ↔ MATERIAL_RAW — 거래처-자재 연결 (구조 불명확)"),

    // ─── 3.7 도면·CAD ───
    new Paragraph({ children: [new PageBreak()] }),
    heading2("3.7 도면·CAD 도메인"),
    heading3("3.7.1 도메인 개요"),
    bodyText("Canvas 기반 CAD 도면 뷰어에서 사용하는 도면, 섹션, 건축 요소 데이터를 관리하는 도메인이다. 견적설계에서 진입하며, 도면 선택 → 섹션 분석 → 요소 편집의 흐름을 따른다."),
    heading3("3.7.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (추정)", "비고"],
      [
        ["BLUEPRINT", "도면", "blueprintNo(PK), estimateNo(FK), name, fileUrl, type", "도면 마스터"],
        ["BLUEPRINT_SET", "도면 세트", "ebNo(PK), setName, blueprints[]", "도면 그룹"],
        ["SECTION", "도면 섹션", "sectionNo(PK), blueprintNo(FK), sectionName, position, data(JSON)", "섹션 분석 단위"],
        ["ELEMENT", "건축 요소", "elementId(PK), sectionNo(FK), elementType(Window/Door/Mullion/Transome/Gallery/Pipe/Slab), properties(JSON)", "다양한 요소 타입"],
      ],
      [15, 15, 45, 25]
    ),
    bodyText("건축 요소 타입: Window, Door, Mullion, Transome, Gallery, Pipe, Slab 등 다수의 타입을 Canvas 렌더링으로 지원"),

    // ─── 3.8 시스템·공통 ───
    heading2("3.8 시스템·공통 도메인"),
    heading3("3.8.1 도메인 개요"),
    bodyText("사용자 관리, 그룹 관리, 공통 코드, UI 상태 등 시스템 전반에서 사용되는 공통 데이터를 관리하는 도메인이다."),
    heading3("3.8.2 주요 엔티티 (추정)"),
    makeTable(
      ["엔티티명", "설명", "주요 속성 (추정)", "비고"],
      [
        ["CODE_MASTER", "공통 코드", "codeId, codeGroup, codeName, codeValue, sortOrder", "코드 관리"],
        ["SYSTEM_SETTING", "시스템 설정", "settingKey, settingValue, description", "전역 설정"],
        ["USER_GROUP", "사용자 그룹", "groupId, groupName, permissions", "그룹별 권한"],
      ],
      [15, 15, 45, 25]
    ),
    heading3("3.8.3 권한 체계"),
    makeTable(
      ["권한 레벨", "코드", "접근 범위", "비고"],
      [
        ["최고관리자", "SUPER", "모든 기능, 사용자 관리, 시스템 설정", "시스템 전체 관리"],
        ["프로젝트 멤버", "PR_MEM", "배정된 프로젝트의 전체 기능", "프로젝트 단위 접근"],
        ["설계 멤버", "ARCH_MEM", "배정된 프로젝트의 견적/도면 기능", "설계 영역 한정"],
        ["일반 멤버", "MEM", "기본 조회 기능", "최소 권한"],
      ],
      [15, 15, 45, 25]
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 4. 현행 데이터 문제점 분석 ───
function section4() {
  return [
    heading1("4. 현행 데이터 문제점 분석"),
    heading2("4.1 데이터 구조 문제"),
    makeTable(
      ["#", "문제 영역", "현행 문제", "영향", "심각도", "관련 요구사항"],
      [
        ["1", "BOM 체계 부재", "제품-자재 간 계층 구조(BOM) 미구현. 제품 구성이 PRODUCT_PART 테이블의 플랫(flat) 매핑으로만 관리됨", "필요수량 수동 산출, 변경 추적 불가, MES 연동 불가", "상", "FR-PM-010, 011, 012"],
        ["2", "자재코드 중복", "자재ID 유일성 검증 없이 동일 코드 등록 가능. 코드 부여 체계 미표준화", "데이터 불일치, 견적 오류, 동일 자재 이중 관리", "상", "FR-PM-004"],
        ["3", "부자재 관리 미구현", "부자재(MATERIAL_SUB) 메뉴가 HIDDEN 상태. 원자재와 분리된 독립 관리 불가", "부자재 체계적 관리 불가, 원가 산출 부정확", "중", "FR-PM-002"],
        ["4", "단가 이력 미관리", "자재 단가 변경 시 기존 값 덮어쓰기. 이력 테이블 미존재", "과거 견적 단가 추적 불가, 단가 변경 시 기존 견적 소급 오류", "상", "FR-PM-003"],
        ["5", "공정 데이터 부재", "공정 유형, 공정 순서, 제조 단가 관련 테이블 미존재", "제조 원가 산출 불가, MES 공정 연동 불가", "상", "FR-PM-008, 009"],
        ["6", "제품 분류 체계 제한", "제품 분류가 8종 하드코딩. 신규 제품 유형 추가 시 코드 수정 필요", "확장성 부족", "하", "FR-PM-014"],
      ],
      [3, 12, 30, 25, 5, 25]
    ),

    heading2("4.2 데이터 품질 문제"),
    makeTable(
      ["#", "문제", "현상", "원인", "영향"],
      [
        ["1", "자재 데이터 중복", "동일 자재가 다른 코드로 다중 등록", "유일성 검증 부재, 코드 체계 미표준", "견적 불일치, 재고 오산"],
        ["2", "데이터 정합성 미보장", "프론트엔드 입력값 검증 의존. 서버 측 제약조건 확인 불가", "코드 역분석 한계", "데이터 무결성 위험"],
        ["3", "필수 항목 과다", "자재 등록 시 불필요한 항목까지 필수 입력", "사용자 편의 미고려 설계", "등록 시간 과다 (만족도 1.33점)"],
        ["4", "단가 소급 반영 오류", "자재 단가 변경 시 기존 견적까지 소급 변경", "단가 버전 관리 미구현", "확정 견적 금액 변동"],
        ["5", "비활성 데이터 잔존", "HIDDEN 메뉴의 데이터(부자재, 단종제품, 부품거래처)가 DB에 잔존", "화면만 숨김 처리, 데이터 정리 미시행", "불필요한 데이터 조회"],
      ],
      [3, 15, 25, 25, 32]
    ),

    heading2("4.3 데이터 연동 문제"),
    makeTable(
      ["#", "문제", "현상", "WIMS 2.0 대응"],
      [
        ["1", "MES 연동 부재", "외부 시스템과의 데이터 인터페이스 없음. BOM 데이터를 MES에 제공할 수 없음", "REST API 기반 BOM 데이터 연동 (FR-PM-013)"],
        ["2", "파일 저장소 로컬 의존", "업로드 파일이 서버 로컬에 저장. 서버 장애 시 파일 손실 위험", "AWS S3 + CloudFront 전환"],
        ["3", "세션 기반 인증 한계", "쿠키 기반 세션으로 모바일 앱 인증 지원 불가. CORS 이슈", "JWT 토큰 기반 인증 전환"],
        ["4", "실시간 데이터 동기화 없음", "다수 사용자 동시 편집 시 데이터 충돌 가능. 폴링 방식 갱신", "WebSocket/SSE 기반 실시간 동기화 검토"],
      ],
      [3, 18, 40, 39]
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 5. 전환 방향 ───
function section5() {
  return [
    heading1("5. 현행 → To-Be 데이터 전환 방향"),
    heading2("5.1 전환 전략 개요"),
    bodyText("WIMS 2.0은 현행 시스템의 데이터를 계승하되, 구조적 한계를 근본적으로 개선한다. 전환 전략은 다음 3개 축으로 구성된다:"),
    emptyLine(),
    bodyText("① 데이터 모델 재설계: BOM 계층 구조 도입, EBOM/MBOM 분리, 공정 마스터 신설"),
    bodyText("② 데이터 품질 강화: 자재코드 표준화, 유일성 검증, 단가 이력 관리"),
    bodyText("③ 데이터 연동 확장: MES REST API, JWT 인증, AWS S3 파일 관리"),
    heading2("5.2 도메인별 전환 방향"),
    makeTable(
      ["도메인", "현행 (As-Is)", "개선 (To-Be)", "핵심 변경", "관련 산출물"],
      [
        ["자재·제품", "플랫 자재 목록 + 수동 제품 매핑", "4단계 BOM 계층 + EBOM/MBOM 분리 + 구성형 BOM", "• 자재코드 표준화\n• BOM 트리 구조\n• 단가 이력 테이블\n• 공정 마스터", "DE32-1 ERD\nDE35-1 BOM"],
        ["프로젝트", "기본 CRUD + 파일 로컬 저장", "프로젝트 중심 통합 관리 + S3 파일 저장", "• 파일 S3 전환\n• 상태 워크플로우 강화", "DE32-1 ERD"],
        ["견적설계", "도면 기반 수동 견적", "CAD 블록 자동인식 + BOM 기반 자동 산출", "• BOM 연동 견적\n• 롤방충망 자동산출", "DE32-1 ERD"],
        ["계약·발주", "수동 발주서 + 단순 절단 계획", "최적 절단 알고리즘 + 자동 발주서 출력", "• 절단 최적화\n• 발주서 자동화", "DE32-1 ERD"],
        ["인증·사용자", "세션(Cookie) 기반", "JWT + Spring Security + 역할 기반 접근 제어", "• JWT 토큰\n• RBAC 강화", "DE32-1 ERD"],
        ["제조관리 (신규)", "미구현", "제작도 산출, 절단 지시서, MES 연동", "• 전면 신규 개발\n• MES REST API", "DE24-1, DE32-1"],
        ["현장실측 (신규)", "미구현", "Android 앱 + BLE + 오프라인 동기화", "• 모바일 전면 신규\n• BLE 연동", "DE32-1 ERD"],
      ],
      [12, 20, 25, 22, 21]
    ),

    heading2("5.3 데이터 마이그레이션 고려사항"),
    makeTable(
      ["#", "대상 데이터", "현행 규모 (추정)", "마이그레이션 방식", "주의사항"],
      [
        ["1", "자재 마스터", "수백~수천 건", "일괄 변환 + 코드 재부여", "중복 자재 정리 선행 필요"],
        ["2", "제품 마스터", "수십~수백 건", "일괄 변환 + 분류체계 매핑", "제품 코드 신규 부여"],
        ["3", "프로젝트", "수백 건", "그대로 이관 + 스키마 변환", "파일 S3 이관 병행"],
        ["4", "견적·계약", "수천 건", "스키마 변환 + 관계 재매핑", "과거 견적 단가 보존"],
        ["5", "사용자", "수십 건", "JWT용 패스워드 재설정", "세션 → JWT 전환"],
      ],
      [3, 15, 17, 25, 40]
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 6. 결론 ───
function section6() {
  return [
    heading1("6. 결론 및 후속 과제"),
    heading2("6.1 분석 결과 요약"),
    bodyText("현행 WIMS 시스템의 데이터 구조 분석 결과, 7개 도메인에 걸쳐 추정 45~65개의 테이블로 구성되어 있으며, 다음과 같은 핵심 문제가 확인되었다:"),
    emptyLine(),
    bodyText("1) BOM 계층 구조 부재: 제품-자재 관계가 플랫(flat) 매핑으로만 관리되어, 다단계 BOM 구성, 필요수량 자동 산출, MES 연동이 불가능한 상태이다.", { bold: true }),
    bodyText("2) 자재 데이터 품질 문제: 자재코드 중복, 단가 이력 미관리, 부자재 비활성 등 데이터 신뢰성이 낮다."),
    bodyText("3) 외부 연동 부재: MES 시스템과의 데이터 인터페이스가 전혀 없으며, 파일 저장이 로컬에 의존하고, 인증이 세션 기반이라 모바일 확장이 불가하다."),
    bodyText("4) 신규 도메인 필요: 제조관리(MF), 현장실측(FS) 도메인은 현행 시스템에 전혀 존재하지 않아 전면 신규 설계가 필요하다."),

    heading2("6.2 후속 과제"),
    makeTable(
      ["#", "후속 과제", "산출물", "일정", "비고"],
      [
        ["1", "논리/물리 ERD 설계", "DE32-1", "S2 (04.20~05.03)", "본 분석서를 기초 자료로 활용"],
        ["2", "MES 인터페이스 설계", "DE24-1", "S1 (Gate 1 필수)", "MES팀 협의 기반 API 설계"],
        ["3", "현행 DB 스키마 확인", "-", "S2", "백엔드 레포 코드 확인으로 보완"],
        ["4", "데이터 마이그레이션 계획", "-", "S4~S5", "Phase 1 오픈 전 마이그레이션 시행"],
        ["5", "요구사항 추적표 매핑", "AN14-1 RTM", "S1", "데이터 요구사항 ↔ 엔티티 매핑"],
      ],
      [5, 30, 12, 20, 33]
    ),
    bodyText("※ 본 문서는 프론트엔드 코드 역분석 기반의 추정 구조이며, 실 DB 스키마 확인 후 DE32-1(ERD) 작성 시 보완될 예정이다.", { italics: true, color: GRAY }),
  ];
}

// ─── 승인 테이블 ───
function approvalTable() {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("승인"),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          headerCell("구분", 15), headerCell("성명", 20), headerCell("소속", 25), headerCell("서명", 20), headerCell("일자", 20),
        ]}),
        new TableRow({ children: [
          dataCell("작성", 15, { center: true, bold: true }),
          dataCell("김성현", 20, { center: true }),
          dataCell("코드크래프트 (BA)", 25, { center: true }),
          dataCell("", 20, { center: true }),
          dataCell("2026.04.07", 20, { center: true }),
        ]}),
        new TableRow({ children: [
          dataCell("검토", 15, { center: true, bold: true }),
          dataCell("김지광", 20, { center: true }),
          dataCell("코드크래프트 (PM)", 25, { center: true }),
          dataCell("", 20, { center: true }),
          dataCell("", 20, { center: true }),
        ]}),
        new TableRow({ children: [
          dataCell("승인", 15, { center: true, bold: true }),
          dataCell("유미숙", 20, { center: true }),
          dataCell("유니크시스템 (사업주)", 25, { center: true }),
          dataCell("", 20, { center: true }),
          dataCell("", 20, { center: true }),
        ]}),
      ],
    }),
  ];
}

// ─── 문서 생성 ───
async function generate() {
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "맑은 고딕", size: 20 } },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "WIMS2.0_AN22-1_현행데이터분석서_v1.0", size: 16, font: "맑은 고딕", color: GRAY })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "- ", size: 16, font: "맑은 고딕", color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "맑은 고딕", color: GRAY }),
              new TextRun({ text: " -", size: 16, font: "맑은 고딕", color: GRAY }),
            ],
          })],
        }),
      },
      children: [
        ...coverPage(),
        ...changeHistory(),
        ...tableOfContents(),
        ...section1(),
        ...section2(),
        ...section3(),
        ...section4(),
        ...section5(),
        ...section6(),
        ...approvalTable(),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "산출물/2_AN(분석)/WIMS2.0_AN22-1_현행데이터분석서_v1.0.docx";
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ 생성 완료: ${outPath}`);
  console.log(`  파일 크기: ${(buffer.length / 1024).toFixed(1)} KB`);
}

generate().catch(console.error);
