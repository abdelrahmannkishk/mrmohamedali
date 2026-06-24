
const fs = require('fs');
const filePath = 'src/components/StudentDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const before = (content.match(/"[^"]*\$\{isDark/g) || []).length;
console.log(`Before: ${before} broken patterns`);

// Split into lines and fix each line
const lines = content.split('\n');
const fixed = lines.map((line, i) => {
  // Check if this line has a className/other attr with "${...}" containing ${
  // Pattern: className="...${...}..." - needs to become className={`...${...}...`}
  
  // Also fix: let btnStyle = '...${...}...' (inside JS)
  // and: className="...${...}..." 
  
  // Fix className="..." that contains ${ - convert to className={`...`}
  line = line.replace(/(\w+)="([^"]*\$\{[^"]*)"/g, (match, attr, inner) => {
    // Only fix if it contains ${isDark or similar template expressions
    if (inner.includes('${')) {
      return `${attr}={\`${inner}\`}`;
    }
    return match;
  });
  
  // Fix let/const btnStyle = '...' that contains ${
  line = line.replace(/(btnStyle\s*=\s*)'([^']*\$\{[^']*)'/g, (match, prefix, inner) => {
    if (inner.includes('${')) {
      return `${prefix}\`${inner}\``;
    }
    return match;
  });

  return line;
});

content = fixed.join('\n');

const after = (content.match(/"[^"]*\$\{isDark/g) || []).length;
console.log(`After: ${after} broken patterns remaining`);

// Also check for single-quote broken patterns in JS assignments
const btnBroken = (content.match(/'[^']*\$\{isDark[^']*'/g) || []).length;
console.log(`Broken btnStyle patterns: ${btnBroken}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
