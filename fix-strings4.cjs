
const fs = require('fs');
const filePath = 'src/components/StudentDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix: className="...${isDark...}..." -> className={`...${isDark...}...`}
// Character-by-character approach per line

function fixAttributeQuotes(line) {
  let result = '';
  let i = 0;
  
  while (i < line.length) {
    // Check for ="  (double-quoted attribute)
    if (i + 1 < line.length && line[i] === '=' && line[i+1] === '"') {
      // Scan the full content of this attribute value
      let start = i + 2;
      let j = start;
      let depth = 0;
      let hasTemplate = false;
      
      while (j < line.length) {
        if (line[j] === '$' && j + 1 < line.length && line[j+1] === '{') {
          hasTemplate = true;
          depth++;
          j += 2;
        } else if (depth > 0 && line[j] === '}') {
          depth--;
          j++;
        } else if (depth === 0 && line[j] === '"') {
          break; // found closing quote
        } else {
          j++;
        }
      }
      
      if (hasTemplate && j < line.length && line[j] === '"') {
        const inner = line.substring(start, j);
        result += '={`' + inner + '`}';
        i = j + 1;
        continue;
      }
    }
    result += line[i];
    i++;
  }
  return result;
}

const lines = content.split('\n');
const fixedLines = lines.map(line => fixAttributeQuotes(line));
content = fixedLines.join('\n');

// Count remaining
let remaining = 0;
const lines2 = content.split('\n');
lines2.forEach((line, i) => {
  if (line.match(/"[^"]*\$\{/)) {
    remaining++;
  }
});
console.log('Remaining broken double-quoted attributes: ' + remaining);

// Now fix btnStyle = '...' with ${ inside single quotes
const fixedLines2 = content.split('\n').map(line => {
  // Match: btnStyle = '...' where the string contains ${
  if (line.indexOf("btnStyle = '") !== -1 && line.indexOf('${') !== -1) {
    let i = line.indexOf("btnStyle = '");
    let start = i + "btnStyle = '".length;
    let j = start;
    let depth = 0;
    let hasTemplate = false;
    
    while (j < line.length) {
      if (line[j] === '$' && j + 1 < line.length && line[j+1] === '{') {
        hasTemplate = true;
        depth++;
        j += 2;
      } else if (depth > 0 && line[j] === '}') {
        depth--;
        j++;
      } else if (depth === 0 && line[j] === "'") {
        break;
      } else {
        j++;
      }
    }
    
    if (hasTemplate && j < line.length && line[j] === "'") {
      const inner = line.substring(start, j);
      return line.substring(0, i) + 'btnStyle = `' + inner + '`' + line.substring(j + 1);
    }
  }
  return line;
});

content = fixedLines2.join('\n');

// Check btnStyle remaining
let btnRemaining = 0;
content.split('\n').forEach(line => {
  if (line.indexOf("btnStyle = '") !== -1 && line.indexOf('${') !== -1) btnRemaining++;
});
console.log('Remaining broken btnStyle: ' + btnRemaining);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File saved!');
