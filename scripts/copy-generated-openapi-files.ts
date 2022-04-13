const fs = require('fs-extra');

const pathMappings: Record<string, string> = {
  integration: 'src/models/.generated'
};

const appName = process.argv[3];
const filesSourceDir = process.argv[4];
const appPath = pathMappings[appName];

if (!fs.existsSync(appPath)) {
  try {
    fs.mkdirSync(appPath, { recursive: true });
  } catch {
    throw new Error(`Could not create directory ${appPath}`);
  }
}

try {
  // we only care about generated models here
  fs.copySync(`${filesSourceDir}/models`, `${__dirname}/../${appPath}`);
} catch (error) {
  throw new Error(`Could not copy ${filesSourceDir} to ${appPath}`);
}

console.info(`copied ${filesSourceDir} to ${appPath}`);
