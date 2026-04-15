const fs = require("fs");
const mammoth = require("mammoth");

const inputDocx = process.argv[2];
const outputHtml = process.argv[3];

if (!inputDocx || !outputHtml) {
  console.error("Usage: node scripts/docx_to_html_preview.js <input.docx> <output.html>");
  process.exit(1);
}

mammoth
  .convertToHtml({ path: inputDocx })
  .then((result) => {
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Calibri, Arial, sans-serif; margin: 32px; line-height: 1.35; color: #111; }
      p { margin: 0 0 10px; }
    </style>
  </head>
  <body>${result.value}</body>
</html>`;
    fs.writeFileSync(outputHtml, html);
    process.stdout.write(`Wrote HTML preview: ${outputHtml}\n`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
