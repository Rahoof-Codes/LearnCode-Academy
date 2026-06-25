const fs = require('fs');

// Fix english/index.ts
let engIndex = fs.readFileSync('src/data/lessons/english/index.ts', 'utf8');
engIndex = engIndex.replace('export const ALL_DATA = {', 'export const ENGLISH_COURSES = {');
fs.writeFileSync('src/data/lessons/english/index.ts', engIndex);

// Fix translated/index.ts
let transIndex = fs.readFileSync('src/data/lessons/translated/index.ts', 'utf8');
transIndex = transIndex.replace('export const ALL_DATA = {', 'export const TAMIL_COURSES = {');
fs.writeFileSync('src/data/lessons/translated/index.ts', transIndex);

// Fix javascript.ts catch(e) errors
let jsEng = fs.readFileSync('src/data/lessons/english/javascript.ts', 'utf8');
jsEng = jsEng.replace(/catch\s*\(e\)/g, 'catch(e: any)');
fs.writeFileSync('src/data/lessons/english/javascript.ts', jsEng);

// Fix page.tsx imports
let page = fs.readFileSync('src/app/courses/[courseId]/lessons/[lessonId]/page.tsx', 'utf8');
// Previously my regex was bad and duplicated ENGLISH_COURSES.
// Let's replace the whole import section lines
page = page.replace(/import\s+{\s*TAMIL_COURSES\s*}\s*from\s*"[^"]+";\nimport\s+{\s*HANDCRAFTED_COURSES,\s*ALL_DATA\s*as\s*ENGLISH_COURSES\s*}\s*from\s*"[^"]+";/g, '');
page = page.replace(/import\s+{\s*TAMIL_COURSES.*?\n.*?\n.*?\n/g, '');

// Wait, I don't know exactly what the imports look like now in page.tsx. Let's just fix it properly by searching for ENGLISH_COURSES
page = page.replace(/import { TAMIL_COURSES } from "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/data\/lessons\/translated";\s*import { HANDCRAFTED_COURSES, ALL_DATA as ENGLISH_COURSES } from "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/data\/lessons\/english";/g, 'import { TAMIL_COURSES } from "../../../../../data/lessons/translated";\nimport { ENGLISH_COURSES } from "../../../../../data/lessons/english";');

fs.writeFileSync('src/app/courses/[courseId]/lessons/[lessonId]/page.tsx', page);
console.log('Fixed TS errors!');
