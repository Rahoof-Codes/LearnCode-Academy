const fs = require('fs');

const jsLessons = [
  { id: "js-var-data", title: "Variables (let, const) & Data Types", taskOutput: "typeof 'hello'" },
  { id: "js-operators-logic", title: "Operators & Conditional Logic", taskOutput: "10 === 10" },
  { id: "js-loops-scope", title: "Loops (for, while, for...of) & Scope", taskOutput: "true" },
  { id: "js-func-declarations", title: "Function Declarations vs Expressions & Arrow Functions", taskOutput: "() => true" },
  { id: "js-params-returns", title: "Parameters and Return Values", taskOutput: "return 42" },
  { id: "js-objects", title: "Objects (Properties & Methods)", taskOutput: "Object.keys({a:1})" },
  { id: "js-arrays-methods", title: "Arrays & Core Methods", taskOutput: "[1,2].map(x=>x*2)" },
  { id: "js-dom-selection-manipulation", title: "DOM Selection & Manipulation", taskOutput: "document.querySelector" },
  { id: "js-event-listeners", title: "Event Listeners & Event Bubbling", taskOutput: "addEventListener" },
  { id: "js-ui-transitions", title: "Triggering Smooth UI Transitions/Animations", taskOutput: "classList.add" },
  { id: "js-templates-destructuring", title: "Template Literals & Destructuring", taskOutput: "`Hello ${name}`" },
  { id: "js-spread-rest", title: "Spread and Rest Operators", taskOutput: "[...arr1]" },
  { id: "js-modules", title: "ES6 Modules (Import/Export)", taskOutput: "export default" },
  { id: "js-promises-async", title: "Promises & Async/Await Syntax", taskOutput: "await promise" },
  { id: "js-fetch-json", title: "Fetch API & Working with JSON Data", taskOutput: "fetch(url)" },
  { id: "js-error-handling", title: "Error Handling (try/catch)", taskOutput: "try {} catch(e) {}" },
  { id: "js-external-apis", title: "Connecting Frontends to External APIs", taskOutput: "fetch(api)" },
  { id: "js-localstorage", title: "LocalStorage & SessionStorage", taskOutput: "localStorage.setItem" },
  { id: "js-state-strategies", title: "Basic State Management Strategies", taskOutput: "state.items" },
  { id: "js-clean-debug", title: "Clean Code & Debugging with Chrome DevTools", taskOutput: "debugger;" },
  { id: "js-docs-reviews", title: "Reading Documentation & Code Review Practices", taskOutput: "console.log" },
  { id: "js-team-credit", title: "Giving Team Members Credit", taskOutput: "// Idea by Teammate" }
];

let handcraftedContent = "";
let tamilContent = "";

jsLessons.forEach(lesson => {
  handcraftedContent += `
  "${lesson.id}": {
    title: "${lesson.title}",
    content: [
      "Welcome to the lesson on ${lesson.title}.",
      "In this topic, we will explore the core concepts and standard practices that form the foundation of JavaScript development.",
      "Complete the quiz and coding task to continue."
    ],
    quiz: [
      {
        question: "What is the primary purpose of ${lesson.title.replace(/"/g, "'")}?",
        options: ["To structure data", "To style the DOM", "To manage logic and behavior", "To configure the server"],
        correctOption: 2,
        explanation: "JavaScript primarily manages logic and behavior."
      }
    ],
    task: {
      description: "Write a function named \`initChallenge()\` that demonstrates ${lesson.title.replace(/"/g, "'")}. It should return \`42\`.",
      starterCode: "function initChallenge() {\\n  // Return 42\\n  return 42;\\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },`;

  tamilContent += `
  "${lesson.id}": {
    title: "${lesson.title} (ஜாவாஸ்கிரிப்ட்)",
    content: [
      "${lesson.title} பாடத்திற்கு உங்களை வரவேற்கிறோம்.",
      "இந்தத் தலைப்பில், ஜாவாஸ்கிரிப்ட் மேம்பாட்டின் அடிப்படையை உருவாக்கும் முக்கிய கருத்துகள் மற்றும் நிலையான நடைமுறைகளை ஆராய்வோம்.",
      "தொடர வினாடி வினா மற்றும் குறியீட்டு பணியை முடிக்கவும்."
    ],
    quiz: [
      {
        question: "${lesson.title.replace(/"/g, "'")} என்பதன் முதன்மை நோக்கம் என்ன?",
        options: ["தரவை கட்டமைக்க", "DOM ஐ வடிவமைக்க", "தர்க்கம் மற்றும் நடத்தையை நிர்வகிக்க", "சேவையகத்தை உள்ளமைக்க"],
        explanation: "ஜாவாஸ்கிரிப்ட் முதன்மையாக தர்க்கம் மற்றும் நடத்தையை நிர்வகிக்கிறது."
      }
    ],
    taskDescription: "ஜாவாஸ்கிரிப்ட்-இல் ஒரு எளிய சார்பை எழுதவும், அது 42 என்ற மதிப்பை திருப்பியளிக்கும்."
  },`;
});

// Append to tamilCourseData.ts
const tamilFilePath = 'src/data/tamilCourseData.ts';
let tamilFileStr = fs.readFileSync(tamilFilePath, 'utf8');
tamilFileStr = tamilFileStr.replace(/};\s*$/, tamilContent + '\n};\n');
fs.writeFileSync(tamilFilePath, tamilFileStr);

// Append to page.tsx
const pageFilePath = 'src/app/courses/[courseId]/lessons/[lessonId]/page.tsx';
let pageFileStr = fs.readFileSync(pageFilePath, 'utf8');
const searchString = 'const HANDCRAFTED_COURSES: Record<string, HandcraftedLesson> = {';
const insertIndex = pageFileStr.indexOf(searchString) + searchString.length;

pageFileStr = pageFileStr.slice(0, insertIndex) + handcraftedContent + pageFileStr.slice(insertIndex);
fs.writeFileSync(pageFilePath, pageFileStr);

console.log('Successfully appended JavaScript handcrafted tasks and Tamil translations!');
