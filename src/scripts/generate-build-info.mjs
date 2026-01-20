import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const buildInfoPath = path.join(rootDir, 'src/lib/build-info.json');

// Read existing build info or create new
let buildInfo = { version: 0, buildTime: null };
if (fs.existsSync(buildInfoPath)) {
  try {
    buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
  } catch (e) {
    console.log('Could not parse existing build-info.json, starting fresh');
  }
}

// Auto-increment version
buildInfo.version = (buildInfo.version || 0) + 1;

// Set build timestamp in ISO format
buildInfo.buildTime = new Date().toISOString();

// Write updated build info
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log(`Build info updated: v${buildInfo.version} @ ${buildInfo.buildTime}`);
