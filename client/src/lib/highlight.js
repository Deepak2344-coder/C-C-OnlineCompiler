const KEYWORDS = [
  "auto", "break", "case", "char", "const", "continue", "default", "do", "double",
  "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register",
  "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef",
  "union", "unsigned", "void", "volatile", "while", "bool", "true", "false", "NULL",
  "nullptr", "class", "new", "delete", "this", "template", "typename", "namespace",
  "using", "try", "catch", "throw", "public", "private", "protected", "virtual",
  "operator", "friend", "inline", "constexpr", "explicit", "std", "string", "cin",
  "cout", "cerr", "endl", "vector", "map", "set", "printf", "scanf", "malloc",
  "calloc", "realloc", "free", "strlen", "strcpy", "strcat", "strcmp", "include",
  "define",
].join("|");

const TOKEN_RE = new RegExp(
  [
    "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)", // 1: comments
    "(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')", // 2: strings / chars
    "(^[ \\t]*#[^\\n]*)", // 3: preprocessor lines
    "\\b(0[xX][0-9a-fA-F]+|\\d+\\.?\\d*[fFuUlL]*)\\b", // 4: numbers
    `\\b(${KEYWORDS})\\b`, // 5: keywords
    "([A-Za-z_]\\w*)(?=\\s*\\()", // 6: function calls
  ].join("|"),
  "gm"
);

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Tokenize C/C++ source into HTML with syntax-highlighting spans. */
export function highlight(code) {
  let out = "";
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const t = escapeHtml(m[0]);
    if (m[1]) out += `<span class="t-com">${t}</span>`;
    else if (m[2]) out += `<span class="t-str">${t}</span>`;
    else if (m[3]) out += `<span class="t-pre">${t}</span>`;
    else if (m[4]) out += `<span class="t-num">${t}</span>`;
    else if (m[5]) out += `<span class="t-kw">${t}</span>`;
    else out += `<span class="t-fn">${t}</span>`;
    last = m.index + m[0].length;
    if (m.index === TOKEN_RE.lastIndex) TOKEN_RE.lastIndex++; // safety
  }
  out += escapeHtml(code.slice(last));
  return out;
}
