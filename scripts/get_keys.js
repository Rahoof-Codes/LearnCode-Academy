const fs = require('fs');
const content = fs.readFileSync('src/data/lessons/english/javascript.ts', 'utf8');
const regex = /\s\s"([^"]+)": {/g;
let match;
const keys = [];
while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
}
console.log(keys);
