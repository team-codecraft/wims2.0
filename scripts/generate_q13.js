const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

const FONT = '맑은 고딕';
const PRIMARY = '1F4E79';
const ACCENT = '2E75B6';
const HEADER_BG = 'D6E4F0';

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 100, line: 340 },
  alignment: opts.align || AlignmentType.LEFT,
  children: [new TextRun({ text, font: FONT, size: opts.size || 22, bold: opts.bold })],
});

const title = (text) => new Paragraph({
  spacing: { before: 200, after: 160 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text, font: FONT, size: 32, bold: true, color: PRIMARY })],
});

const h1 = (text) => new Paragraph({
  spacing: { before: 280, after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: PRIMARY, space: 4 } },
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: PRIMARY })],
});

const h2 = (text) => new Paragraph({
  spacing: { before: 200, after: 100 },
  children: [new TextRun({ text, font: FONT, size: 23, bold: true, color: ACCENT })],
});

const bullet = (text) => new Paragraph({
  spacing: { after: 60, line: 320 },
  indent: { left: 360, hanging: 220 },
  children: [
    new TextRun({ text: '· ', font: FONT, size: 22, bold: true }),
    new TextRun({ text, font: FONT, size: 22 }),
  ],
});

const cell = (text, opts = {}) => new TableCell({
  shading: opts.header ? { fill: HEADER_BG } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  children: [new Paragraph({
    alignment: opts.align || AlignmentType.CENTER,
    children: [new TextRun({ text, font: FONT, size: 20, bold: opts.header })],
  })],
});

const borders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  left: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  right: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
};

const mkTable = (rows, widths) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders,
  rows: rows.map((r, i) => new TableRow({
    tableHeader: i === 0,
    children: r.map(c => cell(c, { header: i === 0, align: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT })),
  })),
});

const children = [
  title('DHS-AE225-D-1 BOM — 유니크시스템 질의서'),
  p('섹션 10 검증 결과 중 확인이 필요한 항목만 발주사(유니크시스템)에 전달할 수 있게 정리한 질의서입니다. 이미 확정된 사항(숨김 시트 폐기, 제품 구조 2×2 = 4짝, W/H/W1/H1 공식 등)은 제외했습니다.'),
  p('파일 약칭 (본 문서 한정)', { bold: true }),
  bullet('BOM 파일 = DHS-AE225-D-1_유니크시스템 BOM_수정본.xlsx'),
  bullet('후렘 파일 = DHS-AE225-D-1_BOM리스트_225중중연창 후렘.Xls'),
  bullet('문짝 파일 = DHS-AE225-D-1_BOM리스트_225문짝.Xls'),
  p(' '),
  p('작성: 2026-04-13 · 코드크래프트 BA · 김성현'),

  // A
  h1('A. BOM 파일 — 데이터 보완 요청'),

  h2('Q1. 완제품 Part No 부여'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트, NO 1 행'),
  p('Part No 컬럼이 공란입니다. 정식 완제품 품번을 부여해 주세요.'),

  h2('Q2. 자재코드 미부여 부자재 3종'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트, NO 43 / 44 / 45'),
  p(' '),
  mkTable([
    ['NO', '자재명'],
    ['43', '일자크리센트 피스 3.5*7'],
    ['44', '8*13 사라직결피스'],
    ['45', '4.5*38 삼각피스'],
  ]),
  p(' '),
  p('자재코드 컬럼이 공란입니다. 정식 자재코드를 부여해 주세요.'),

  h2('Q3. Screw(8×13mm) 1 SET 소요량'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트, NO 21 (자재코드 X-003)'),
  p('Q\'TY 가 공란입니다 (시트 헤더에 "*피스수량 미기재" 주석 있음).'),
  p('참고: 후렘 파일의 동일 자재 SUB-003 은 1 EA 로 등재되어 있습니다.'),
  p('→ 가능하시면 정확한 1 SET 당 소요량을 확정해 주세요.'),

  h2('Q4. Glass Ass\'y 누락'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트 전체 (유리 항목 없음)'),
  bullet('(a) 유리는 별도 BOM/도면으로 관리되나요? (아니면 유리는 제외?)'),
  bullet('(b) 유리 결합공정에 필요한 자재 구성(원판, 간봉, 실런트 등)이 있나요?'),
  bullet('(c) 1 SET 당 유리 매수·면적 산정 기준은?'),

  // B
  h1('B. BOM 파일 — 표기 해석 확인'),

  h2('Q6. 길이 공식 자재 3종 — 공식 해석 확인'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트'),
  p('본 제품이 가로 2 × 세로 2 = 4짝(W1=W/4, H1=H/2) 임을 전제로, 길이형 자재의 Q\'TY 는 "규격 컬럼의 공식" 으로 산정한 것으로 해석됩니다. 아래 해석이 맞는지 확인 부탁드립니다.'),
  p(' '),
  mkTable([
    ['NO', '자재', '단위', '규격 표기', '해석 (per 1 사용처)'],
    ['29', '모헤어 04-0002 (Vent H1)', 'M', 'H/2', '1 사용처당 H/2 m'],
    ['41', '모헤어 04-0002 (Vent W1)', 'M', 'W/4', '1 사용처당 W/4 m'],
    ['48', '모헤어 04-0002 (Screen H1)', 'M', 'H/2', '1 사용처당 H/2 m'],
    ['52', '방충망 ZZ-ZZ03', 'M(?)', '(공란)', '단위 M 이 맞나요? 면 자재라 M² 가 자연스러움. 1짝 면적 ≈ (W/4)×(H/2)'],
    ['54', '가스켓 04-0018', 'M', 'H+W/2', '(H+W)/2 인가요, H+(W/2) 인가요? 단가 소수점(58.0556)의 의미는?'],
  ]),

  h2('Q7. Vent Ass\'y / Screen Ass\'y 단위 의미'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트, NO 22 (Vent Ass\'y = 16) / NO 46 (Screen Ass\'y = 8)'),
  p('4짝 기준으로 16÷4=4, 8÷4=2 입니다.'),
  bullet('(a) Vent Ass\'y 1단위 = "1짝의 한 변(프레임)" 으로 보면 1짝당 4변 → 16 이 맞나요?'),
  bullet('(b) Screen Ass\'y 1단위 = "1짝의 가로/세로 변" 으로 보면 1짝당 2변 → 8 이 맞나요?'),
  bullet('(c) 다른 해석이라면 정확한 산정 근거를 알려주세요.'),

  h2('Q8. NO 컬럼 / Level ● 표기 정합성'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트'),
  bullet('NO 번호 중복: NO 4 (3회), NO 14 (3회), NO 15·16·17 (각 2회). NO 컬럼은 단순 행번호인가요, 자재 식별 번호인가요?'),
  bullet('L4·L5 동시 ● 표기 9건: NO 30, 31, 33, 34, 42, 43, 48, 49, 50 (브라켓·가이드·크리센트·모헤어·롤러 등). 정확한 Level 은 4 인가요 5 인가요? 동시 표기의 의미는?'),

  h2('Q9. 중간 노드 Phantom 여부'),
  bullet('위치: DHS-AE225-D-1 Ass\'y 시트의 중간 가공/조립 노드 — HC-001, HC-002, HX-0001 (Q\'TY 공란)'),
  p('이들은 Phantom(가상 반제품 — 재고 없이 BOM 표기용)으로 처리하면 되나요? 실제 재고를 갖는 반제품인가요?'),

  // C
  h1('C. BOM 파일 — Level 체계'),

  h2('Q11. Level 단계 수 (5단 vs 6단)'),
  bullet('위치: BOM 파일의 Sheet2 (Level 정의 5단) ↔ DHS-AE225-D-1 Ass\'y 시트 (BOM Level 컬럼 1~6 사용)'),
  p('정식 Level 체계는 5단인가요, 6단인가요? 신규 시스템 표준은 어느 쪽으로 가져가야 하나요?'),

  // D
  h1('D. 후렘 파일 — 정합성 / 데이터'),

  h2('Q12. UNI-A225-901B 수량 불일치 (5 vs 3)'),
  bullet('후렘 파일 Sheet: H03 + H04 + W03 = 3 EA'),
  bullet('BOM 파일 DHS-AE225-D-1 Ass\'y 시트: 중간 Frame H 2×2 + 중간 Frame W 1×1 = 5 EA'),
  p('외부 A 계열(UNI-A225-101A)은 양쪽 4 EA 로 일치하는데, 내부 B 만 차이납니다. 어느 쪽이 정확한 수량인가요?'),

  h2('Q13. 02-0097 (후렘이탈방지) 중복 등재'),
  bullet('위치: 후렘 파일 Sheet 16행(L3 부자재, 1) + 17행(L2 공정, 1)'),
  p('의도된 중복인가요? 1 SET 당 실제 소요량 합산은 1 인가요 2 인가요?'),

  h2('Q14. 자재코드 이중 체계 (X-00x ↔ SUB-00x)'),
  p(' '),
  mkTable([
    ['자재명', '후렘 파일', 'BOM 파일'],
    ['8×16 둥근머리 (가공용)', 'SUB-001', 'X-001'],
    ['8×16 둥근머리 (조립용)', 'SUB-002', 'X-002'],
    ['Screw(8×13mm)', 'SUB-003', 'X-003'],
  ]),
  p(' '),
  p('어느쪽 자재코드를 기준으로 하면 되나요?'),

  // E
  h1('E. 후렘 / 문짝 공통 — 코드 체계'),

  h2('Q15. 반제품 품번 명명 규칙 (HF-* / H-* / HC-* / HX-*)'),
  p(' '),
  mkTable([
    ['품번 패턴', '출처', '사용 예'],
    ['HF-000x', '후렘 파일 / 문짝 파일', 'HF-0001 ~ HF-0007'],
    ['H-100x', '문짝 파일', 'H-1000 ~ H-1006'],
    ['H01005', '문짝 파일', '(5자리, 단독)'],
    ['HC-00x / HX-000x', 'BOM 파일', 'HC-001, HC-002, HX-0001'],
  ]),
  p(' '),
  p('각 접두사의 의미와 부여 규칙이 있으면 알려주세요 (의미 없으면 별 의미 없다고 알려주시면 됩니다).'),

  h2('Q16. 위치구분 코드 (H01~H04, W01~W03) 명명 규칙'),
  bullet('위치: 후렘 파일은 H01~H04 + W01~W03 모두 사용 / 문짝 파일은 H01, H03, W01, W02 만 사용'),
  bullet('(a) H = 수평(Horizontal) / W = 수직(Width) 가 맞나요?'),
  bullet('(b) 숫자(01~04)의 부여 기준은? (외부→내부, 위→아래, 설치 순서 등)'),
  bullet('(c) 후렘과 문짝의 사용 코드가 다른 이유는?'),
  bullet('(d) 다른 모델·제품에서 추가로 사용되는 위치 코드가 있나요?'),

  h2('Q17. 절단 품번 (UNI-A225-101-HC/HC2/HC3/HC4/WC/WC-2/WC-3)'),
  bullet('위치: 후렘 파일에만 존재 (BOM 파일에는 없음)'),
  bullet('(a) 위치(H01~W03)별로 자동 부여되는 코드인가요?'),
  bullet('(b) 신규 시스템에서 위치 인스턴스 엔터티의 식별자로 사용 가능한가요?'),

  // F
  h1('F. 문짝 파일 — 자재 누락'),

  h2('Q18. Vent 구성 4종 누락'),
  bullet('위치: 문짝 파일 Sheet (문짝 1개 per-unit 기준)'),
  p('BOM 파일의 Vent Ass\'y 구성요소 중 다음 4종이 문짝 파일에 등재되어 있지 않습니다.'),
  p(' '),
  mkTable([
    ['누락 자재', '자재코드'],
    ['문짝 단열재', 'UNI-P225-401'],
    ['문짝 가네고', 'UNI-A225-MB'],
    ['중간띠', 'UNI-A225-MV-A'],
    ['중간띠캡', 'UNI-A225-MV-B'],
  ]),
  p(' '),
  bullet('(a) 누락 이유는? (별도 공정/도장 외주 등)'),
  bullet('(b) 신규 BOM 통합 시 어떤 공정/위치로 매핑해야 하나요?'),

  // G
  h1('G. 공장 라우팅'),

  h2('Q19. 정식 공정 순서표 + 표준 작업시간'),
  bullet('위치: 후렘 파일 Sheet 라우팅 컬럼 (대부분 공란)'),
  bullet('미서기 포장 → 조립 → 나사 체결 → 가네고 가공 → 피스홀 가공 → 후렘 연결 → 절단 등의 정식 공정 순서표가 있나요?'),
  bullet('공정별 표준 작업시간(Cycle Time) 자료를 받을 수 있을까요? (MES 연동 설계 시 필요)'),

  p(' '),
  p('문서 작성: 2026-04-13 · WIMS 2.0 프로젝트 · visible 시트 4종(U, L, F, D)만을 정리 대상으로 함', { align: AlignmentType.RIGHT }),
];

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children,
  }],
});

const outPath = path.resolve(__dirname, '../docs/참고자료/DHS-AE225-D-1_유니크시스템_질의서.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log('생성 완료:', outPath);
});
