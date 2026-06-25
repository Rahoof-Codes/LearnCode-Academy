const fs = require('fs');

const pageFilePath = 'src/app/courses/[courseId]/lessons/[lessonId]/page.tsx';
let pageContent = fs.readFileSync(pageFilePath, 'utf-8');

// Replace imports
pageContent = pageContent.replace(
  /import\s+{\s*TAMIL_COURSES,\s*TamilLesson\s*}\s*from\s*"[^"]+";/g,
  `import { TAMIL_COURSES } from "../../../../../data/lessons/translated";\nimport { HANDCRAFTED_COURSES, ALL_DATA as ENGLISH_COURSES } from "../../../../../data/lessons/english";\nimport { HandcraftedLesson, TamilLesson } from "../../../../../data/lessons/types";`
);

// Remove interfaces
pageContent = pageContent.replace(/interface\s+QuizQuestion\s*{[\s\S]*?}\n\n/g, '');
pageContent = pageContent.replace(/interface\s+CodingTask\s*{[\s\S]*?}\n\n/g, '');
pageContent = pageContent.replace(/interface\s+HandcraftedLesson\s*{[\s\S]*?}\n\n/g, '');

// Remove HANDCRAFTED_COURSES object
const startIndex = pageContent.indexOf('const HANDCRAFTED_COURSES: Record<string, HandcraftedLesson> = {');
if (startIndex !== -1) {
    const fallbackIndex = pageContent.indexOf('const getFallbackLessonData =', startIndex);
    if (fallbackIndex !== -1) {
        // Find the `// ================= DYNAMIC FALLBACK LESSON DATA GENERATOR =================` which precedes it
        const headerIndex = pageContent.lastIndexOf('// ================= DYNAMIC FALLBACK LESSON DATA GENERATOR =================', fallbackIndex);
        if (headerIndex !== -1) {
            pageContent = pageContent.substring(0, startIndex) + pageContent.substring(headerIndex);
        }
    }
}

// Since ALL_DATA is exported from english/index.ts, we need to map HANDCRAFTED_COURSES to ENGLISH_COURSES
pageContent = pageContent.replace(/HANDCRAFTED_COURSES/g, 'ENGLISH_COURSES');

// Wait, the replacement earlier did: `import { HANDCRAFTED_COURSES, ALL_DATA as ENGLISH_COURSES } from ...`
// Actually, `english/index.ts` exports `ALL_DATA`. Let me just replace the import to:
// `import { ALL_DATA as ENGLISH_COURSES } from "../../../../../data/lessons/english";`
// and replace `HANDCRAFTED_COURSES[` with `ENGLISH_COURSES[`

fs.writeFileSync(pageFilePath, pageContent);
console.log('Successfully cleaned page.tsx');
