const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirOutputs = path.join(__dirname, '../outputs');

if (!fs.existsSync(dirOutputs)) {
  fs.mkdirSync(dirOutputs, { recursive: true });
}

const getPythonCommand = () => {
  if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
  if (process.platform === 'win32') {
    const knownWindowsPaths = [
      'C:\\Program Files\\PostgreSQL\\17\\pgAdmin 4\\python\\python.exe',
      'C:\\Python312\\python.exe',
      'C:\\Python311\\python.exe',
      'C:\\Python310\\python.exe',
    ];
    for (const p of knownWindowsPaths) {
      if (fs.existsSync(p)) return p;
    }
    return 'python';
  }
  return 'python3';
};

/**
 * Executes a Python script file and captures its output.
 * @param {string} filePath - Absolute path to the Python script
 * @returns {Promise<string>} - Resolves with stdout or rejects with stderr
 */
const executepy = (filePath) => {
  const jobId = path.basename(filePath).split('.')[0];
  const outputPath = path.join(dirOutputs, `${jobId}.txt`);
  const pythonCmd = getPythonCommand();
  const timeoutMs = parseInt(process.env.EXECUTION_TIMEOUT_MS, 10) || 15000;

  return new Promise((resolve, reject) => {
    exec(
      `"${pythonCmd}" "${filePath}"`,
      { timeout: timeoutMs, maxBuffer: 1024 * 1024 },
      async (error, stdout, stderr) => {
        const captured = (stdout || '') + (stderr ? `\n[STDERR]:\n${stderr}` : '');
        try {
          await fs.promises.writeFile(outputPath, captured);
        } catch (_) {}

        if (error) {
          return reject(stderr || error.message || error);
        }
        if (stderr) {
          return reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

executepy.executepy = executepy;
executepy.executePy = executepy;
executepy.dirOutputs = dirOutputs;

module.exports = executepy;
module.exports.executepy = executepy;
module.exports.executePy = executepy;
module.exports.dirOutputs = dirOutputs;
