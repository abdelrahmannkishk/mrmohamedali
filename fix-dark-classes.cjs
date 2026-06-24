
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/StudentDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// ─── Pattern replacements ───────────────────────────────────────────────────
// Each entry: [regex, replacement]
// We do targeted className string replacements for common patterns

const replacements = [
  // Card/panel backgrounds
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border`],

  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl transition-colors shadow-sm space-y-4`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-6 rounded-3xl transition-colors shadow-sm space-y-4`],

  // Tab banner
  [`text-egypt-darkGreen dark:text-egypt-royalGold inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 py-3.5 px-8 rounded-full shadow-sm`,
   `\${isDark ? 'text-egypt-royalGold bg-slate-900 border-slate-800' : 'text-egypt-darkGreen bg-white border-slate-100'} inline-flex items-center gap-2 border py-3.5 px-8 rounded-full shadow-sm`],

  // User name
  [`text-egypt-green dark:text-egypt-royalGold mb-4`,
   `\${isDark ? 'text-egypt-royalGold' : 'text-egypt-green'} mb-4`],

  // Info rows
  [`bg-gray-50 dark:bg-slate-800/50 px-4 py-3 rounded-2xl`,
   `\${isDark ? 'bg-slate-800' : 'bg-gray-50'} px-4 py-3 rounded-2xl`],

  // Text in info rows
  [`text-gray-700 dark:text-gray-300`,
   `\${isDark ? 'text-gray-300' : 'text-gray-700'}`],

  // HR borders
  [`border-slate-100 dark:border-slate-800 my-4`,
   `\${isDark ? 'border-slate-800' : 'border-slate-100'} my-4`],

  // Change pass button
  [`text-egypt-green dark:text-egypt-royalGold hover:underline`,
   `\${isDark ? 'text-egypt-royalGold' : 'text-egypt-green'} hover:underline`],

  // Password inputs
  [`bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-egypt-gold dark:focus:border-egypt-gold dark:text-white transition`,
   `\${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl px-3.5 py-2 text-xs outline-none focus:border-egypt-gold transition`],

  // Avatar border
  [`bg-slate-50 dark:bg-slate-800 border-4 border-egypt-darkGreen/15 dark:border-slate-700`,
   `\${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-egypt-darkGreen/15'} border-4`],

  // Status badge
  [`text-blue-600 dark:text-blue-400`,
   `\${isDark ? 'text-blue-400' : 'text-blue-600'}`],

  // Points box
  [`bg-egypt-darkGreen/5 dark:bg-slate-800/50 border border-egypt-darkGreen/10 dark:border-slate-800 p-4 rounded-2xl`,
   `\${isDark ? 'bg-slate-800 border-slate-700' : 'bg-egypt-darkGreen/5 border-egypt-darkGreen/10'} border p-4 rounded-2xl`],

  // Points text color
  [`text-egypt-green dark:text-egypt-royalGold\`}>{user.points`,
   `\${isDark ? 'text-egypt-royalGold' : 'text-egypt-green'}\`}>{user.points`],

  // Sidebar/panel
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl transition-colors shadow-sm space-y-4`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-6 rounded-3xl transition-colors shadow-sm space-y-4`],

  // Week accordion
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl overflow-hidden shadow-sm transition-colors`],

  // Accordion button
  [`text-gray-800 dark:text-gray-100 bg-gray-50/50 dark:bg-slate-850`,
   `\${isDark ? 'text-gray-100 bg-slate-800' : 'text-gray-800 bg-gray-50'}`],

  // Inner accordion divider
  [`divide-y divide-slate-50 dark:divide-slate-800/50`,
   `divide-y \${isDark ? 'divide-slate-800' : 'divide-slate-100'}`],

  // Lecture title in list
  [`font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200`,
   `font-bold text-xs sm:text-sm \${isDark ? 'text-gray-200' : 'text-gray-800'}`],

  // Badge styles in lecture type
  [`bg-green-500/10 text-green-600 dark:text-green-400`,
   `bg-green-500/10 \${isDark ? 'text-green-400' : 'text-green-600'}`],

  [`bg-red-500/10 text-red-600 dark:text-red-400`,
   `bg-red-500/10 \${isDark ? 'text-red-400' : 'text-red-600'}`],

  [`bg-orange-500/10 text-orange-600 dark:text-orange-400`,
   `bg-orange-500/10 \${isDark ? 'text-orange-400' : 'text-orange-600'}`],

  [`bg-blue-500/10 text-blue-600 dark:text-blue-400`,
   `bg-blue-500/10 \${isDark ? 'text-blue-400' : 'text-blue-600'}`],

  [`bg-purple-500/10 text-purple-600 dark:text-purple-400`,
   `bg-purple-500/10 \${isDark ? 'text-purple-400' : 'text-purple-600'}`],

  // Fav button not-fav
  [`bg-gray-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-gray-400 hover:text-yellow-500`,
   `\${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-slate-100'} text-gray-400 hover:text-yellow-500`],

  // Weeks 2,3,4 placeholders
  [`rounded-3xl overflow-hidden shadow-sm transition-colors opacity-75`,
   `rounded-3xl overflow-hidden shadow-sm transition-colors opacity-75`],

  [`text-gray-500 dark:text-gray-400 bg-gray-50/20 dark:bg-slate-850/50`,
   `\${isDark ? 'text-gray-400 bg-slate-800/50' : 'text-gray-500 bg-gray-50/20'}`],

  // Empty state cards
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-3xl transition-colors text-center space-y-4 shadow-sm`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-12 rounded-3xl transition-colors text-center space-y-4 shadow-sm`],

  [`bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner`,
   `\${isDark ? 'bg-slate-800' : 'bg-gray-100'} rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner`],

  [`text-gray-800 dark:text-gray-100`,
   `\${isDark ? 'text-gray-100' : 'text-gray-800'}`],

  // Course cards
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group`],

  [`relative h-44 overflow-hidden bg-gray-100 dark:bg-slate-800`,
   `relative h-44 overflow-hidden \${isDark ? 'bg-slate-800' : 'bg-gray-100'}`],

  [`font-cairo font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 leading-snug group-hover:text-egypt-green dark:group-hover:text-egypt-royalGold transition-colors`,
   `font-cairo font-bold text-sm sm:text-base \${isDark ? 'text-gray-100 group-hover:text-egypt-royalGold' : 'text-gray-800 group-hover:text-egypt-green'} leading-snug transition-colors`],

  [`text-gray-500 dark:text-gray-400 font-tajawal text-xs leading-relaxed line-clamp-3`,
   `\${isDark ? 'text-gray-400' : 'text-gray-500'} font-tajawal text-xs leading-relaxed line-clamp-3`],

  [`border-t border-slate-50 dark:border-slate-800/50 flex items-center gap-3`,
   `border-t \${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center gap-3`],

  // All courses - already purchased button
  [`bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-300`,
   `\${isDark ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`],

  // Views details tab - caution banner
  [`text-amber-600 dark:text-amber-400`,
   `\${isDark ? 'text-amber-400' : 'text-amber-600'}`],

  // Views table header
  [`bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b border-slate-100 dark:border-slate-800`,
   `\${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-slate-200'} px-6 py-4 border-b`],

  [`text-gray-600 dark:text-gray-300`,
   `\${isDark ? 'text-gray-300' : 'text-gray-600'}`],

  [`bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner`,
   `\${isDark ? 'bg-slate-800' : 'bg-gray-100'} rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner`],

  [`bg-slate-50/50 dark:bg-slate-850/50 text-gray-400 font-bold border-b border-slate-100 dark:border-slate-800`,
   `\${isDark ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-gray-50 border-slate-200 text-gray-500'} font-bold border-b`],

  [`hover:bg-gray-50/50 dark:hover:bg-slate-850/30 transition-colors`,
   `\${isDark ? 'hover:bg-slate-800/60' : 'hover:bg-gray-50'} transition-colors`],

  [`font-semibold text-gray-800 dark:text-gray-200`,
   `font-semibold \${isDark ? 'text-gray-200' : 'text-gray-800'}`],

  [`font-black text-slate-800 dark:text-slate-200`,
   `font-black \${isDark ? 'text-slate-200' : 'text-slate-800'}`],

  // Invoices tab
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors space-y-6`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl p-6 sm:p-8 shadow-sm transition-colors space-y-6`],

  [`grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-6 border-b border-slate-100 dark:border-slate-800`,
   `grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-6 border-b \${isDark ? 'border-slate-800' : 'border-slate-100'}`],

  [`font-cairo font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5`,
   `font-cairo font-bold text-sm \${isDark ? 'text-slate-200' : 'text-slate-800'} flex items-center gap-1.5`],

  [`text-egypt-darkGreen dark:text-egypt-royalGold`,
   `\${isDark ? 'text-egypt-royalGold' : 'text-egypt-darkGreen'}`],

  [`bg-gray-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-center uppercase focus:bg-white focus:border-egypt-gold outline-none`,
   `\${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-slate-200 text-gray-800'} border rounded-xl px-4 py-2.5 text-xs font-bold text-center uppercase focus:border-egypt-gold outline-none`],

  [`bg-gray-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-egypt-gold outline-none`,
   `\${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-slate-200 text-gray-800'} border rounded-xl px-4 py-2.5 text-xs font-bold focus:border-egypt-gold outline-none`],

  [`overflow-x-auto border border-slate-50 dark:border-slate-800 rounded-2xl`,
   `overflow-x-auto border \${isDark ? 'border-slate-800' : 'border-slate-100'} rounded-2xl`],

  [`bg-slate-50 dark:bg-slate-850 text-gray-400 font-bold border-b border-slate-100 dark:border-slate-800`,
   `\${isDark ? 'bg-slate-800 text-gray-400 border-slate-700' : 'bg-gray-50 text-gray-500 border-slate-200'} font-bold border-b`],

  [`divide-y divide-slate-55 dark:divide-slate-800/50`,
   `divide-y \${isDark ? 'divide-slate-800' : 'divide-slate-100'}`],

  [`font-bold text-gray-800 dark:text-gray-200`,
   `font-bold \${isDark ? 'text-gray-200' : 'text-gray-800'}`],

  // Level indicator
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors text-center space-y-8`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl p-8 shadow-sm transition-colors text-center space-y-8`],

  [`text-slate-800 dark:text-slate-200`,
   `\${isDark ? 'text-slate-200' : 'text-slate-800'}`],

  [`stroke-gray-150 dark:stroke-slate-800 fill-transparent`,
   `\${isDark ? 'stroke-slate-700' : 'stroke-gray-200'} fill-transparent`],

  [`font-cairo font-black text-4xl text-egypt-darkGreen dark:text-egypt-royalGold`,
   `font-cairo font-black text-4xl \${isDark ? 'text-egypt-royalGold' : 'text-egypt-darkGreen'}`],

  [`border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-center`,
   `border \${isDark ? 'border-slate-800' : 'border-slate-100'} p-4 rounded-2xl text-center`],

  [`text-xs text-gray-400 dark:text-gray-500 font-bold`,
   `text-xs \${isDark ? 'text-gray-500' : 'text-gray-400'} font-bold`],

  [`font-cairo font-black text-xl text-green-600 dark:text-green-400`,
   `font-cairo font-black text-xl \${isDark ? 'text-green-400' : 'text-green-600'}`],

  [`font-cairo font-black text-xl text-red-600 dark:text-red-400`,
   `font-cairo font-black text-xl \${isDark ? 'text-red-400' : 'text-red-600'}`],

  // My points tab
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors text-center space-y-6`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl p-8 shadow-sm transition-colors text-center space-y-6`],

  [`text-egypt-green dark:text-egypt-royalGold text-lg font-black`,
   `\${isDark ? 'text-egypt-royalGold' : 'text-egypt-green'} text-lg font-black`],

  [`border border-slate-100 dark:border-slate-800 p-6 rounded-2xl max-w-md mx-auto text-right space-y-4`,
   `border \${isDark ? 'border-slate-800' : 'border-slate-100'} p-6 rounded-2xl max-w-md mx-auto text-right space-y-4`],

  [`text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800 pb-2`,
   `\${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-100'} border-b pb-2`],

  // Favorites tab
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-4`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-4`],

  [`p-4 bg-gray-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center`,
   `p-4 \${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-slate-100'} border rounded-2xl flex justify-between items-center`],

  // Top 10 tab
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-3xl overflow-hidden shadow-sm transition-colors`],

  [`divide-y divide-slate-100 dark:divide-slate-800/50`,
   `divide-y \${isDark ? 'divide-slate-800' : 'divide-slate-100'}`],

  [`bg-gray-100 dark:bg-slate-800 text-gray-500`,
   `\${isDark ? 'bg-slate-800' : 'bg-gray-100'} text-gray-500`],

  [`bg-egypt-darkGreen/5 dark:bg-slate-850 border border-egypt-darkGreen/10 dark:border-slate-800 px-4 py-1.5 rounded-full shrink-0`,
   `\${isDark ? 'bg-slate-800 border-slate-700' : 'bg-egypt-darkGreen/5 border-egypt-darkGreen/10'} border px-4 py-1.5 rounded-full shrink-0`],

  [`font-cairo font-black text-xs sm:text-sm text-egypt-darkGreen dark:text-egypt-royalGold`,
   `font-cairo font-black text-xs sm:text-sm \${isDark ? 'text-egypt-royalGold' : 'text-egypt-darkGreen'}`],

  // Quiz questions
  [`bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/35`,
   `bg-green-50/60 border-green-200`],

  [`bg-red-50/30 dark:bg-red-950/10 border-red-200 dark:border-red-900/35`,
   `bg-red-50/30 border-red-200`],

  [`bg-gray-50 dark:bg-slate-850 border-gray-100 dark:border-slate-800`,
   `\${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`],

  [`text-slate-800 dark:text-slate-200 mb-4 flex items-start gap-2`,
   `\${isDark ? 'text-slate-200' : 'text-slate-800'} mb-4 flex items-start gap-2`],

  [`bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200`,
   `\${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'}`],

  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-egypt-gold/30`,
   `\${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-white border-slate-100 text-gray-700'} hover:border-egypt-gold/30`],

  // Video player
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-colors relative overflow-hidden`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-4 rounded-3xl shadow-sm transition-colors relative overflow-hidden`],

  [`p-3 bg-gray-50 dark:bg-slate-850 rounded-xl mt-3 flex justify-between items-center text-xs`,
   `p-3 \${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-xl mt-3 flex justify-between items-center text-xs`],

  [`font-tajawal text-gray-500 dark:text-gray-300 flex items-center gap-1.5`,
   `font-tajawal \${isDark ? 'text-gray-300' : 'text-gray-500'} flex items-center gap-1.5`],

  // Quiz engine
  [`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6`,
   `\${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6`],

  [`flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4`,
   `flex justify-between items-center border-b \${isDark ? 'border-slate-800' : 'border-slate-100'} pb-4`],

  [`font-cairo font-black text-base sm:text-lg text-egypt-darkGreen dark:text-egypt-royalGold`,
   `font-cairo font-black text-base sm:text-lg \${isDark ? 'text-egypt-royalGold' : 'text-egypt-darkGreen'}`],

  // Print button
  [`bg-slate-800 dark:bg-slate-700 hover:bg-slate-900`,
   `\${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-900'}`],

  // Remaining border-b pattern
  [`border-b border-slate-100 dark:border-slate-800`,
   `border-b \${isDark ? 'border-slate-800' : 'border-slate-100'}`],

  // text-gray-400 dark:text-gray-500
  [`text-gray-400 dark:text-gray-500`,
   `\${isDark ? 'text-gray-500' : 'text-gray-400'}`],

  // top_10 score badge
  [`font-black text-xs sm:text-sm text-egypt-darkGreen dark:text-egypt-royalGold`,
   `font-black text-xs sm:text-sm \${isDark ? 'text-egypt-royalGold' : 'text-egypt-darkGreen'}`],

  [`gray-800 dark:text-gray-100`,
   `\${isDark ? 'text-gray-100' : 'text-gray-800'}`],

  // text-gray-500 dark:text-gray-400  
  [`text-gray-550 dark:text-gray-400`,
   `\${isDark ? 'text-gray-400' : 'text-gray-500'}`],
];

// Apply all replacements
let changeCount = 0;
for (const [search, replace] of replacements) {
  if (content.includes(search)) {
    content = content.replaceAll(search, replace);
    changeCount++;
  } else {
    console.log(`NOT FOUND: "${search.substring(0, 60)}..."`);
  }
}

console.log(`\nApplied ${changeCount}/${replacements.length} replacements`);

// Count remaining dark: occurrences
const remaining = (content.match(/dark:/g) || []).length;
console.log(`Remaining dark: occurrences: ${remaining}`);

// Write file
fs.writeFileSync(filePath, content, 'utf8');
console.log('File written successfully!');
