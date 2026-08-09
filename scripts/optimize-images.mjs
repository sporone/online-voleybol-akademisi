import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public");
const candidates = [
  { directory:"course-covers", match:/\.png$/i, options:{ quality:82, effort:6 } },
  { directory:"lesson-images", match:/^sheet-parmak-pas-.*\.png$/i, options:{ quality:82, effort:6 } },
  { directory:"instructors", match:/\.png$/i, options:{ quality:86, effort:6 } },
];
const singleFiles = ["profile-volleyball-women.png", "profile-volleyball-men.png", "junior-referees.png"];

async function convert(source, options={quality:84,effort:6}) {
  const target = source.replace(/\.png$/i, ".webp");
  const before = (await fs.stat(source)).size;
  await sharp(source).rotate().webp(options).toFile(target);
  const after = (await fs.stat(target)).size;
  if (after >= before) {
    await fs.rm(target);
    return { source, skipped:true, before, after };
  }
  await fs.rm(source);
  return { source, target, before, after };
}

async function recompressWebp(source) {
  const temporary = `${source}.optimized.webp`;
  const before = (await fs.stat(source)).size;
  await sharp(source)
    .rotate()
    .resize({ width:1600, height:1200, fit:"inside", withoutEnlargement:true })
    .webp({ quality:82, effort:6 })
    .toFile(temporary);
  const after = (await fs.stat(temporary)).size;
  if (after >= before) {
    await fs.rm(temporary);
    return { before, after:before, skipped:true };
  }
  await fs.rm(source);
  await fs.rename(temporary, source);
  return { before, after };
}

const files = [];
for (const group of candidates) {
  const directory = path.join(root, group.directory);
  for (const name of await fs.readdir(directory)) if (group.match.test(name)) files.push([path.join(directory,name),group.options]);
}
for (const name of singleFiles) files.push([path.join(root,name),{quality:86,effort:6}]);

let before=0,after=0,converted=0;
for (const [file,options] of files) {
  try {
    const result=await convert(file,options);
    before+=result.before;
    after+=result.skipped?result.before:result.after;
    if(!result.skipped)converted+=1;
  } catch (error) {
    if(error.code!=="ENOENT")throw error;
  }
}
const lessonDirectory = path.join(root, "lesson-images");
for (const name of await fs.readdir(lessonDirectory)) {
  if (!/^sheet-parmak-pas-.*\.webp$/i.test(name)) continue;
  const result = await recompressWebp(path.join(lessonDirectory, name));
  before += result.before;
  after += result.after;
  if (!result.skipped) converted += 1;
}
console.log(`${converted} görsel WebP biçimine dönüştürüldü.`);
console.log(`Toplam boyut: ${(before/1048576).toFixed(1)} MB → ${(after/1048576).toFixed(1)} MB`);
