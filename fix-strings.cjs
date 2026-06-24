
const fs = require('fs');
const filePath = 'src/components/StudentDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: className="...${isDark...}..." → className={`...${isDark...}...`}
// Pattern: className="...[text]...${ → className={`...[text]...${ and close with `}
content = content.replace(
  /className="([^"]*\$\{isDark[^"]*)"/g,
  (match, inner) => `className={\`${inner}\`}`
);

// Fix 2: strokeWidth-style attributes with "${isDark...}"
content = content.replace(
  /className="([^"]*\$\{[^"]*\$\{[^"]*)"/g,
  (match, inner) => `className={\`${inner}\`}`
);

// Fix 3: btnStyle = '${isDark ? ... : ...}...' → use template literal
// These are JS strings with ${} inside single quotes - need to fix too
content = content.replace(
  /btnStyle = '([^']*\$\{isDark[^']*)'/g,
  (match, inner) => `btnStyle = \`${inner}\``
);

// Fix 4: className="...${isDark... (nested single quotes inside double)
// Already handled above but let's also fix standalone string attrs like strong className
content = content.replace(
  /(className|strokeWidth)="\$\{([^}]+)\}([^"]*)"/g,
  (match, attr, expr, rest) => `${attr}={\`\${${expr}}${rest}\`}`
);

const remaining = (content.match(/"[^"]*\$\{isDark/g) || []).length;
console.log(`Remaining broken patterns: ${remaining}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
