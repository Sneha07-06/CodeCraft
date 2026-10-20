const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, '../codes');

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

/**
 * Generates an ephemeral Dart script file in the backend/codes directory.
 * @param {string} format - Script format / file extension (e.g., 'dart')
 * @param {string} content - Dart source code string
 * @returns {Promise<string>} - Absolute path to the generated Dart file
 */
const generateFile = async (format = 'dart', content = '') => {
  const jobId = uuid();
  const ext = format ? (format.startsWith('.') ? format.slice(1) : format) : 'dart';
  const filename = `${jobId}.${ext}`;
  const filePath = path.join(dirCodes, filename);

  await fs.promises.writeFile(filePath, content || '');
  return filePath;
};

generateFile.generateFile = generateFile;
generateFile.generateDartFile = (code) => generateFile('dart', code);
generateFile.dirCodes = dirCodes;

module.exports = generateFile;
module.exports.generateFile = generateFile;
module.exports.generateDartFile = generateFile.generateDartFile;
module.exports.dirCodes = dirCodes;
