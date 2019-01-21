/**
 * Please do not remove this file as it is needed by
 * Travis to publish the library to our Antwerp CDN.
 */

const fs = require('fs');
const path = require('path');

run();

async function run() {
  try {
    await copyFolderRecursiveSync('lib', 'dist');
  } catch (e) {
    console.log(e);
  }
}

function copyFolderRecursiveSync(source, target) {
  const nodePackageFile = JSON.parse(fs.readFileSync(`${__dirname}/package.json`));
  const version = nodePackageFile.version;
  let files = [];

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    files = fs.readdirSync(target);
    if (!fs.existsSync(`${target}/${version}`)) {
      fs.mkdirSync(`${target}/${version}`);
    }
  }
  files = fs.readdirSync(source);
  files.forEach(function (file) {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, version, file);
    const data = fs.readFileSync(sourceFile, 'utf-8');
    fs.writeFileSync(targetFile, data);
  });
}
