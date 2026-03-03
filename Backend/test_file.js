const fs = require('fs');
const path = require('path');

// Test different controllers
const controllers = ['applicationController', 'companyController', 'jobController', 'userController', 'statsController'];

for (const ctrl of controllers) {
  const filePath = path.join(__dirname, 'controllers', `${ctrl}.js`);
  try {
    delete require.cache[require.resolve(filePath)];
    const result = require(filePath);
    console.log(`${ctrl}: OK - exports: ${Object.keys(result).length}`);
  } catch(e) {
    console.log(`${ctrl}: ERROR - ${e.message}`);
  }
}

