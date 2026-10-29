// One CSV cell. Cells starting with = + - @ are prefixed so spreadsheets don't run them as formulas.
const csvCell = (value) => {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// BOM first so Excel opens Arabic text correctly.
const toCsv = (header, rows) => "\uFEFF" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

module.exports = { csvCell, toCsv };
