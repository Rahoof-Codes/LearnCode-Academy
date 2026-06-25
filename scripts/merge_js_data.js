const fs = require('fs');

// Read all parts
let allData = {};
for (let i = 1; i <= 7; i++) {
  const part = JSON.parse(fs.readFileSync(`scripts/part${i}_data.json`, 'utf8'));
  allData = { ...allData, ...part };
}

// Generate english/javascript.ts
let englishTs = `import { HandcraftedLesson } from "../types";\n\nexport const javascriptData: Record<string, HandcraftedLesson> = {\n`;

// Generate translated/javascript.ts
let tamilTs = `import { TamilLesson } from "../types";\n\nexport const javascriptData: Record<string, TamilLesson> = {\n`;

for (const [key, lesson] of Object.entries(allData)) {
  const en = lesson.en;
  const ta = lesson.ta;

  // ENGLISH
  englishTs += `  "${key}": {\n`;
  englishTs += `    title: ${JSON.stringify(en.title)},\n`;
  englishTs += `    content: [\n${en.content.map(c => `      ${JSON.stringify(c)}`).join(',\n')}\n    ],\n`;
  englishTs += `    quiz: [\n`;
  en.quiz.forEach(q => {
    englishTs += `      {\n        question: ${JSON.stringify(q.q)},\n        options: ${JSON.stringify(q.o)},\n        correctOption: ${q.c},\n        explanation: ${JSON.stringify(q.e)}\n      },\n`;
  });
  englishTs += `    ],\n`;
  englishTs += `    task: {\n`;
  englishTs += `      description: ${JSON.stringify(en.task)},\n`;
  englishTs += `      starterCode: "function initChallenge() {\\n  // Return 42\\n  return 42;\\n}",\n`;
  englishTs += `      language: "javascript",\n`;
  englishTs += `      expectedOutput: "42",\n`;
  englishTs += `      expectedOutputDisplay: "1. Return value is 42.\\n2. Valid JavaScript syntax.",\n`;
  englishTs += `      validate: (code) => {\n        let isPassed = false;\n        let logs = ["Evaluating user code..."];\n        try {\n          const userFn = new Function(code + "\\nreturn initChallenge;")();\n          const res = userFn();\n          isPassed = res === 42;\n          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));\n        } catch(e: any) {\n          logs.push("Error: " + e.message);\n        }\n        return { isPassed, logs };\n      }\n    }\n  },\n`;

  // TAMIL
  tamilTs += `  "${key}": {\n`;
  tamilTs += `    title: ${JSON.stringify(ta.title)},\n`;
  tamilTs += `    content: [\n${ta.content.map(c => `      ${JSON.stringify(c)}`).join(',\n')}\n    ],\n`;
  tamilTs += `    quiz: [\n`;
  ta.quiz.forEach(q => {
    tamilTs += `      {\n        question: ${JSON.stringify(q.q)},\n        options: ${JSON.stringify(q.o)},\n        explanation: ${JSON.stringify(q.e)}\n      },\n`;
  });
  tamilTs += `    ],\n`;
  tamilTs += `    taskDescription: ${JSON.stringify(ta.task)}\n  },\n`;
}

englishTs += `};\n`;
tamilTs += `};\n`;

fs.writeFileSync('src/data/lessons/english/javascript.ts', englishTs);
fs.writeFileSync('src/data/lessons/translated/javascript.ts', tamilTs);

console.log("Merged Javascript files successfully!");
