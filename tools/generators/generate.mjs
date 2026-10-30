import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const whitelistedGenerators = ['lib', 'react-lib', 'react-app'];

// Get library name from CLI argument (e.g., node tools/generate.js my-utils)
const generatorType = process.argv[2] || 'react-lib';
const libName = process.argv[3];

if (!libName) {
  console.error(
    'Error: Please provide a library name. Example: node tools/generate.js my-utils'
  );
  process.exit(1);
}

if (!whitelistedGenerators.includes(generatorType)) {
  console.error(
    'Error: Unknown generator specified. Please choose one of following:lib, react-lib, app'
  );
  process.exit(1);
}

const isGeneratingApp = generatorType === 'react-app';
const templateDir = path.join(__dirname, generatorType);
const parentDir = isGeneratingApp ? 'apps' : 'libs';

const targetDir = path.join(__dirname, `../../${parentDir}/${libName}`);

if (fs.existsSync(targetDir)) {
  if (isGeneratingApp) {
    console.error(`Error: Application "apps/${libName}" already exists!`);
  } else {
    console.error(`Error: Library "libs/${libName}" already exists!`);
  }
  process.exit(1);
}

// Recursive copy and template variable replacement function
function copyTemplateFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    // Remove .template extension from destination file name
    const destFileName = entry.name.replace(/\.template$/, '');
    const destPath = path.join(dest, destFileName);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyTemplateFiles(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      // Replace placeholders
      content = content.replace(/__libName__/g, libName);

      fs.writeFileSync(destPath, content);
    }
  }
}

// 1. Generate files
console.log(`Generating ${generatorType} @org/${libName}...`);
fs.mkdirSync(targetDir, { recursive: true });
copyTemplateFiles(templateDir, targetDir);

console.log(
  `Successfully generated @org/${libName}! Run 'npm install' to link workspaces.`
);
