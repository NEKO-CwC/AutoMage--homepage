import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';

const OUT_DIR = 'out';
const HTML_FILE = join(OUT_DIR, 'index.html');
const OUTPUT_FILE = join(OUT_DIR, 'automage-single.html');

function findFiles(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...findFiles(full, ext));
    else if (extname(entry) === ext) results.push(full);
  }
  return results;
}

function toDataUri(filePath, mime) {
  const buf = readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function toRelPath(absolutePath) {
  const normalized = absolutePath.replace(/\\/g, '/');
  const outNorm = OUT_DIR.replace(/\\/g, '/');
  const idx = normalized.indexOf(outNorm);
  if (idx === -1) return '/' + normalized;
  return '/' + normalized.slice(idx + outNorm.length + 1);
}

let html = readFileSync(HTML_FILE, 'utf-8');

// Collect assets
const cssFiles = findFiles(join(OUT_DIR, '_next'), '.css');
const jsFiles = findFiles(join(OUT_DIR, '_next'), '.js');
const fontFiles = findFiles(join(OUT_DIR, '_next'), '.woff2');
const assetMap = new Map();
for (const p of cssFiles) assetMap.set(toRelPath(p), { path: p, mime: 'text/css' });
for (const p of jsFiles) assetMap.set(toRelPath(p), { path: p, mime: 'application/javascript' });
for (const p of fontFiles) assetMap.set(toRelPath(p), { path: p, mime: 'font/woff2' });

// Step 1: Inline CSS with font data URIs
for (const cssPath of cssFiles) {
  const relPath = toRelPath(cssPath);
  let cssContent = readFileSync(cssPath, 'utf-8');
  const cssDir = dirname(relPath);
  cssContent = cssContent.replace(/url\(([^)]+)\)/g, (match, url) => {
    if (url.startsWith('data:')) return match;
    let resolved = url.startsWith('/') ? url : cssDir + '/' + url;
    if (!url.startsWith('/')) {
      const parts = resolved.split('/');
      const norm = [];
      for (const p of parts) { if (p === '..') norm.pop(); else if (p !== '.' && p !== '') norm.push(p); }
      resolved = '/' + norm.join('/');
    }
    const info = assetMap.get(resolved);
    if (info) { console.log(`  Font: ${resolved}`); return `url(${toDataUri(info.path, info.mime)})`; }
    return match;
  });
  const tag = `<link rel="stylesheet" href="${relPath}" data-precedence="next"/>`;
  if (html.includes(tag)) { html = html.replace(tag, `<style>${cssContent}</style>`); console.log(`CSS: ${relPath}`); }
}

// Step 2: Remove preload links
html = html.replace(/<link rel="preload" as="script" fetchPriority="low" href="\/_next\/static\/chunks\/[^"]*"\/>/g, '');
for (const fp of fontFiles) {
  const rp = toRelPath(fp);
  const t = `<link rel="preload" href="${rp}" as="font" crossorigin="" type="font/woff2"/>`;
  if (html.includes(t)) { html = html.replace(t, ''); console.log(`Removed preload: ${rp}`); }
}

// Step 3: Inline favicon
html = html.replace(/href="\/favicon\.ico[^"]*"/g, `href="${toDataUri(join(OUT_DIR, 'favicon.ico'), 'image/x-icon')}"`);
console.log('Favicon inlined');

// Step 4: Collect JS chunks, store as base64 in data attributes, load via bootstrap
const chunkData = [];
for (const jsPath of jsFiles) {
  const relPath = toRelPath(jsPath);
  const jsContent = readFileSync(jsPath, 'utf-8');
  const b64 = Buffer.from(jsContent).toString('base64');

  const patterns = [
    `<script src="${relPath}" async=""></script>`,
    `<script src="${relPath}" noModule=""></script>`,
    `<script src="${relPath}" id="_R_" async=""></script>`,
    `<script src="${relPath}"></script>`,
  ];
  let found = false;
  for (const tag of patterns) {
    if (html.includes(tag)) {
      // Store chunk info for bootstrap
      const attrs = tag.includes('async') ? 'async' : tag.includes('noModule') ? 'noModule' : '';
      const id = tag.includes('id="_R_"') ? 'id="_R_"' : '';
      chunkData.push({ path: relPath, b64, attrs, id, order: html.indexOf(tag) });
      // Remove the original tag
      html = html.replace(tag, '');
      console.log(`Collected JS: ${relPath}`);
      found = true;
      break;
    }
  }
  if (!found) console.log(`  Skipped: ${relPath}`);
}

// Sort by original order
chunkData.sort((a, b) => a.order - b.order);

// Step 5: Generate bootstrap that loads chunks in order using new Function()
// We use a single inline script that decodes and executes all chunks in sequence.
const bootstrapCode = `(function(){
  var chunks = ${JSON.stringify(chunkData.map(c => ({ p: c.path, d: c.b64, a: c.attrs, i: c.id })))};
  var head = document.head || document.getElementsByTagName('head')[0];
  chunks.forEach(function(c) {
    try {
      var binary = atob(c.d);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      var code = new TextDecoder('utf-8').decode(bytes);
      var s = document.createElement('script');
      if (c.a === 'async') s.async = true;
      if (c.a === 'noModule') s.noModule = true;
      if (c.i) s.id = c.i;
      s.textContent = code;
      head.appendChild(s);
    } catch(e) { console.error('Chunk load failed:', c.p, e); }
  });
})();`;

// Insert bootstrap before </body>
html = html.replace('</body>', `<script>${bootstrapCode}</script></body>`);

// Step 6: Clean up remaining _next references
html = html.replace(/<link[^>]*href="\/_next\/[^"]*"[^>]*\/>/g, '');

writeFileSync(OUTPUT_FILE, html, 'utf-8');
const size = statSync(OUTPUT_FILE).size;
console.log(`\nDone! ${OUTPUT_FILE}`);
console.log(`Size: ${(size/1024).toFixed(1)} KB (${(size/1024/1024).toFixed(2)} MB)`);
console.log(`Chunks: ${chunkData.length}`);
