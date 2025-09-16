// android/generate-local-properties.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'local.properties');
if (!fs.existsSync(file)) {
  const sdkDir = '/opt/android-sdk'; // Path on EAS build VMs
  fs.writeFileSync(file, `sdk.dir=${sdkDir}\n`, 'utf8');
  console.log('✅ local.properties generated with sdk.dir=' + sdkDir);
}
