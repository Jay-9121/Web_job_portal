const fs = require('fs');
const path = require('path');

// Let's try to find what the actual issue is with statsController
// by loading other controllers first, then statsController

console.log('Step 1: Load .env first');
require('dotenv').config();

console.log('Step 2: Load userController');
const userCtrl = require('./controllers/userController');
console.log('userController loaded OK');

console.log('Step 3: Load statsController');
try {
  const statsCtrl = require('./controllers/statsController');
  console.log('statsController loaded OK');
  console.log('Exports:', Object.keys(statsCtrl));
} catch(e) {
  console.log('statsController FAILED:', e.message);
  
  // Let's manually parse it to find the issue
  const filePath = path.join(__dirname, 'controllers', 'statsController.js');
  const code = fs.readFileSync(filePath, 'utf8');
  
  // Find where it might be broken
  console.log('\nAnalyzing code structure...');
  let braceCount = 0;
  let parenCount = 0;
  let bracketCount = 0;
  
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') braceCount++;
    if (code[i] === '}') braceCount--;
    if (code[i] === '(') parenCount++;
    if (code[i] === ')') parenCount--;
    if (code[i] === '[') bracketCount++;
    if (code[i] === ']') bracketCount--;
  }
  
  console.log('Brace balance:', braceCount);
  console.log('Paren balance:', parenCount);
  console.log('Bracket balance:', bracketCount);
}

