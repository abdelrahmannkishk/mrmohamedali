
const fs = require('fs');
const filePath = 'src/components/StudentDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// The problem: className="...${isDark ? 'X' : 'Y'}..." 
// Single quotes INSIDE double quotes break the regex because we can't 
// use a simple [^"] character class.
// 
// Solution: do a character-by-character scan to find and fix these patterns.

function fixLine(line) {
  // Find all className="..." or similar where the value contains ${
  // We'll reconstruct the line character by character
  let result = '';
  let i = 0;
  
  while (i < line.length) {
    // Look for an attribute assignment starting with ="
    if (line[i] === '=' && line[i+1] === '"') {
      // Find the content between the quotes
      let j = i + 2; // start after ="
      let depth = 0;
      let hasTemplate = false;
      
      // Scan forward to find the closing " that matches, accounting for ${...}
      while (j < line.length) {
        if (line[j] === '$' && line[j+1] === '{') {
          hasTemplate = true;
          depth++;
          j += 2;
        } else if (depth > 0 && line[j] === '}') {
          depth--;
          j++;
        } else if (depth === 0 && line[j] === '"') {
          // Found closing quote
          break;
        } else {
          j++;
        }
      }
      
      if (hasTemplate && j < line.length && line[j] === '"') {
        // Extract the inner content
        const inner = line.substring(i + 2, j);
        result += '={`' + inner + '`}';
        i = j + 1; // skip the closing "
        continue;
      }
    }
    result += line[i];
    i++;
  }
  return result;
}

function fixBtnStyleLine(line) {
  // Fix: btnStyle = '...${}...' -> btnStyle = `...${}...`
  // or: btnStyle = '...' where ' contains ${
  let result = '';
  let i = 0;
  
  while (i < line.length) {
    // Look for = ' pattern (assignment with single-quoted string)
    if ((line[i] === '=' || (line[i] === ' ' && line[i+1] === '=')) && 
        line.substring(i).match(/^[=\s]+'/) ) {
      // find the single-quoted string start
      let q = line.indexOf("'", i);
      if (q >= 0) {
        let j = q + 1;
        let depth = 0;
        let hasTemplate = false;
        
        while (j < line.length) {
          if (line[j] === '$' && line[j+1] === '{') {
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
        
        if (hasTemplate && j < line.length) {
          result += line.substring(i, q); // up to the opening '
          result += '`' + line.substring(q + 1, j) + '`';
          i = j + 1;
          continue;
        }
      }
    }
    result += line[i];
    i++;
  }
  return result;
}

const lines = content.split('\n');
const fixed = lines.map((line) => {
  let l = fixLine(line);
  // Also fix btnStyle JS assignments with single-quoted strings containing ${}
  if (l.includes("btnStyle = '") || l.includes("btnStyle = `")) {
    // Check if there's a broken single-quoted string with ${}
    if (l.match(/btnStyle\s*=\s*'[^']*\$\{/)) {
      // Simple targeted fix for btnStyle
      l = l.replace(/btnStyle\s*=\s*'([^']*\$\{[^]*?)'/g, (m, inner) => {
        if (inner.includes("'")) {
          // has nested single quotes - use a different approach
        }
        return `btnStyle = \`${inner}\``;
      });
    }
  }
  return l;
});

content = fixed.join('\n');

// Count remaining broken patterns
const broken = [];
content.split('\n').forEach((line, i) => {
  if (line.match(/"[^"]*\$\{/)) broken.push(i + 1);
});
console.log(`Remaining lines with broken "...${...}": ${broken.length}`);
if (broken.length > 0) console.log('Lines:', broken.slice(0, 10));

const btnBroken = [];
content.split('\n').forEach((line, i) => {
  if (line.match(/btnStyle\s*=\s*'[^']*\$\{/)) btnBroken.push(i + 1);
});
console.log(`Remaining broken btnStyle: ${btnBroken.length}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
