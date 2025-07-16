// read-lines.js
const fs = require('fs');
const path = 'node_modules/expo-router/_ctx.web.tsx';
try {
  const lines = fs.readFileSync(path, 'utf8').split('\n');
  console.log(lines.slice(0, 20).map((l,i)=>`${String(i+1).padStart(2)}: ${l}`).join('\n'));
} catch (err) {
  console.error('Error:', err.message);
}