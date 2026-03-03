// Test file to debug statsController loading
const path = require('path');
console.log('__dirname:', __dirname);
console.log('CWD:', process.cwd());

// __dirname is already pointing to Backend folder
// So we just need to use relative path from there

// Now try to require the statsController
try {
  const stats = require('./controllers/statsController');
  console.log('Loaded successfully:', Object.keys(stats));
} catch (e) {
  console.log('Error loading statsController:', e.message);
}

