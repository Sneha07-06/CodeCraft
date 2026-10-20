const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, '../codes');

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

/**
 * Generates an ephemeral Python script file in the backend/codes directory.
 * @param {string} format - Script format / file extension (e.g., 'py', 'python')
 * @param {string} content - Python source code string
 * @returns {Promise<string>} - Absolute path to the generated Python file
 */
const generateFile = async (format = 'py', content = '') => {
  const jobId = uuid();
  let ext = format ? (format.startsWith('.') ? format.slice(1) : format) : 'py';
  if (ext === 'python') ext = 'py';
  const filename = `${jobId}.${ext}`;
  const filePath = path.join(dirCodes, filename);

  await fs.promises.writeFile(filePath, content || '');
  return filePath;
};

generateFile.generateFile = generateFile;
generateFile.generatePyFile = (code) => generateFile('py', code);
generateFile.dirCodes = dirCodes;

module.exports = generateFile;
module.exports.generateFile = generateFile;
module.exports.generatePyFile = generateFile.generatePyFile;
module.exports.dirCodes = dirCodes;
