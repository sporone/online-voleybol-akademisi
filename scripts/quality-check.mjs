import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function filesBelow(directory) {
  return fs.readdirSync(path.join(root, directory), { withFileTypes:true }).flatMap((entry) => {
    const relative = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(relative) : [relative];
  });
}

const requiredFiles = [
  "public/sw.js",
  "src/pwa.js",
  "src/quality-fixes.css",
  "apps-script/Code.gs",
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Eksik zorunlu dosya: ${file}`);
}
if (!failures.length) pass("PWA, güvenlik ve mobil düzeltme dosyaları mevcut");

const main = read("src/main.jsx");
const appsScript = read("apps-script/Code.gs");
if (/const\s+ADMIN_CODE_HASH\s*=/.test(appsScript)) fail("Yönetici kod özeti kaynak kodda sabit tutuluyor");
else pass("Yönetici kodu yalnızca Script Properties üzerinden okunuyor");
if (/return\s+\{\s*ok\s*:\s*true\s*,\s*demo\s*:\s*true/.test(main)) fail("Kayıt başarısızken sahte başarı yanıtı hâlâ mevcut");
else pass("Kayıt servisi hataları sahte başarıya dönüştürülmüyor");
if (!/validateProfileSession/.test(main) || !/profileLogin/.test(appsScript)) fail("Güvenli profil oturumu doğrulaması eksik");
else pass("Profil oturumları sunucu belirteciyle doğrulanıyor");

const sourceFiles = filesBelow("src").filter((file) => /\.(?:js|jsx|css)$/.test(file));
const assetPattern = /["'(]\/([^"')?#]+\.(?:png|jpe?g|webp|svg|gif|ico|woff2?|pdf|docx?))/gi;
for (const file of sourceFiles) {
  const content = read(file);
  for (const match of content.matchAll(assetPattern)) {
    const assetPath = path.join(root, "public", match[1].replaceAll("/", path.sep));
    if (!fs.existsSync(assetPath)) fail(`${file}: /${match[1]} bulunamadı`);
  }
}
if (!failures.some((item) => item.includes("bulunamadı"))) pass("Kaynak kodda kullanılan yerel görsellerin tamamı mevcut");

const optimizedImages = [
  ...filesBelow("public/course-covers").filter((file) => file.endsWith(".webp")),
  ...filesBelow("public/lesson-images").filter((file) => /sheet-parmak-pas-.*\.webp$/.test(file)),
];
const oversized = optimizedImages.filter((file) => fs.statSync(path.join(root, file)).size > 600_000);
if (oversized.length) fail(`Optimize edilmemiş büyük görseller: ${oversized.join(", ")}`);
else pass(`${optimizedImages.length} ders görseli mobil için optimize edildi`);

const dist = path.join(root, "dist");
if (!fs.existsSync(path.join(dist, "index.html"))) fail("Üretim derlemesi bulunamadı");
else {
  const entryChunks = fs.readdirSync(path.join(dist, "assets")).filter((name) => /^index-.*\.js$/.test(name));
  const largest = Math.max(0, ...entryChunks.map((name) => fs.statSync(path.join(dist, "assets", name)).size));
  if (largest > 750_000) fail(`Ana JavaScript paketi hâlâ çok büyük: ${(largest / 1024).toFixed(0)} KB`);
  else pass(`Ana JavaScript paketi ${(largest / 1024).toFixed(0)} KB sınırında`);
}

if (failures.length) {
  console.error("\nKalite kontrolü başarısız:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("\nTüm kalite kontrolleri geçti.");
