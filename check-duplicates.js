const fs = require('fs');
const path = require('path');

const translationsDir = './src/i18n/translations';

fs.readdirSync(translationsDir).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(translationsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract all keys from the file
    const keys = content.match(/(\w+):/g);
    if (keys) {
      const cleanKeys = keys.map(k => k.replace(':', ''));
      const duplicates = cleanKeys.filter((key, index) => cleanKeys.indexOf(key) !== index);
      
      console.log(`=== ${file} ===`);
      console.log(`Total keys: ${cleanKeys.length}`);
      console.log(`Duplicates: ${duplicates.length > 0 ? duplicates.join(', ') : 'None'}`);
      console.log('');
    }
  }
});
