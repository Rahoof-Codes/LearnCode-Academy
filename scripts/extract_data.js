const fs = require('fs');
const ts = require('typescript');

function extractObjectLiteral(filePath, objectName) {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

    let extractedProperties = [];

    function visit(node) {
        if (ts.isVariableDeclaration(node) && node.name.text === objectName) {
            if (node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
                node.initializer.properties.forEach(prop => {
                    const key = prop.name.text || prop.name.escapedText || sourceCode.substring(prop.name.pos, prop.name.end).replace(/['"\s]/g, '');
                    const valueStr = sourceCode.substring(prop.pos, prop.end);
                    extractedProperties.push({ key, text: valueStr });
                });
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return extractedProperties;
}

function categorize(key) {
    if (key.startsWith('html-') || key === 'semantic-html' || key === 'html5-apis') return 'html';
    if (key.startsWith('css-') || key === 'flexbox-layout') return 'css';
    if (key.startsWith('js-')) return 'javascript';
    return 'other';
}

function generateFiles(folder, properties, typeName) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const grouped = { html: [], css: [], javascript: [] };
    properties.forEach(p => {
        const cat = categorize(p.key);
        if (grouped[cat]) grouped[cat].push(p.text);
    });

    for (const [lang, props] of Object.entries(grouped)) {
        const content = `import { ${typeName} } from "../types";\n\nexport const ${lang}Data: Record<string, ${typeName}> = {\n${props.join(',\n')}\n};\n`;
        fs.writeFileSync(`${folder}/${lang}.ts`, content);
    }

    const indexContent = `import { htmlData } from "./html";\nimport { cssData } from "./css";\nimport { javascriptData } from "./javascript";\n\nexport const ALL_DATA = {\n  ...htmlData,\n  ...cssData,\n  ...javascriptData\n};\n`;
    fs.writeFileSync(`${folder}/index.ts`, indexContent);
}

const handcraftedProps = extractObjectLiteral('src/app/courses/[courseId]/lessons/[lessonId]/page.tsx', 'HANDCRAFTED_COURSES');
const tamilProps = extractObjectLiteral('src/data/tamilCourseData.ts', 'TAMIL_COURSES');

generateFiles('src/data/lessons/english', handcraftedProps, 'HandcraftedLesson');
generateFiles('src/data/lessons/translated', tamilProps, 'TamilLesson');

console.log('Successfully generated split files!');
