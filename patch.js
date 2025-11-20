const fs = require('fs');
const path = require('path');

const dir = 'node_modules/native-base/lib/commonjs/theme/components';

const fixOutlineWidth = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  let data = fs.readFileSync(filePath, 'utf8');
  const newData = data
    .replace(/outlineWidth:\s*'0'/g, 'outlineWidth: 0')
    .replace(/outlineWidth:\s*'(\d+)px'/g, 'outlineWidth: $1');
  fs.writeFileSync(filePath, newData, 'utf8');
  console.log(`✅ Fixed outlineWidth in ${filePath}`);
};

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.js')) fixOutlineWidth(path.join(dir, file));
});
