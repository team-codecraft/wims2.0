const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const FONT = '맑은 고딕';
const PRIMARY = '1F4E79';
const ACCENT = '2E75B6';

const DISPLAY_WIDTH_PX = 600;
const RENDER_WIDTH_PX = 1600;
const PNG_SCALE = 2;

const srcMd = process.argv[2] || path.join(__dirname, 'sample.md');
const outDocx = process.argv[3] || path.join(__dirname, 'out', 'mermaid-poc.docx');
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mmd-'));

const md = fs.readFileSync(srcMd, 'utf8');

function findMmdc() {
  const local = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'mmdc');
  return fs.existsSync(local) ? local : 'mmdc';
}

function renderMermaidPng(code, idx) {
  const mmd = path.join(workDir, `d${idx}.mmd`);
  const png = path.join(workDir, `d${idx}.png`);
  fs.writeFileSync(mmd, code);
  execFileSync(findMmdc(), ['-i', mmd, '-o', png, '-b', 'white', '-w', String(RENDER_WIDTH_PX), '-s', String(PNG_SCALE)], { stdio: 'pipe' });
  return fs.readFileSync(png);
}

function pngSize(pngBuf) {
  const w = pngBuf.readUInt32BE(16);
  const h = pngBuf.readUInt32BE(20);
  return { w, h };
}

function mermaidImageRun(code, idx) {
  const png = renderMermaidPng(code, idx);
  const { w, h } = pngSize(png);
  const width = DISPLAY_WIDTH_PX;
  const height = Math.round((h / w) * DISPLAY_WIDTH_PX);
  return new ImageRun({ type: 'png', data: png, transformation: { width, height } });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100, line: 340 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, font: FONT, size: opts.size || 22, bold: opts.bold })],
  });
}

function h(text, level) {
  const sizes = { 1: 30, 2: 26, 3: 22 };
  return new Paragraph({
    spacing: { before: 240, after: 140 },
    border: level === 1 ? { bottom: { style: BorderStyle.SINGLE, size: 8, color: PRIMARY, space: 4 } } : undefined,
    children: [new TextRun({ text, font: FONT, size: sizes[level] || 22, bold: true, color: level === 1 ? PRIMARY : ACCENT })],
  });
}

function imgPara(run) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 160 },
    children: [run],
  });
}

const children = [];
const lines = md.split(/\r?\n/);
let i = 0;
let diagramIdx = 0;
while (i < lines.length) {
  const line = lines[i];
  const fence = line.match(/^```(\w+)?\s*$/);
  if (fence && fence[1] === 'mermaid') {
    const buf = [];
    i += 1;
    while (i < lines.length && !/^```\s*$/.test(lines[i])) {
      buf.push(lines[i]);
      i += 1;
    }
    i += 1;
    children.push(imgPara(mermaidImageRun(buf.join('\n'), diagramIdx++)));
    continue;
  }
  const m1 = line.match(/^#\s+(.*)/);
  const m2 = line.match(/^##\s+(.*)/);
  const m3 = line.match(/^###\s+(.*)/);
  if (m1) children.push(h(m1[1], 1));
  else if (m2) children.push(h(m2[1], 2));
  else if (m3) children.push(h(m3[1], 3));
  else if (line.trim()) children.push(p(line));
  else children.push(new Paragraph({ children: [new TextRun('')] }));
  i += 1;
}

const doc = new Document({ sections: [{ properties: {}, children }] });

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outDocx, buf);
  console.log(`OK: ${outDocx} (${buf.length} bytes, diagrams=${diagramIdx})`);
});
