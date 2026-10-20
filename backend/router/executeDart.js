const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirOutputs = path.join(__dirname, '../outputs');

if (!fs.existsSync(dirOutputs)) {
  fs.mkdirSync(dirOutputs, { recursive: true });
}

const DART_NOT_INSTALLED_ERROR =
  'Dart SDK is not installed or not added to system PATH. Please install Dart or run Python/JS/HTML.';

/**
 * Checks whether the Dart executable binary is accessible in system PATH.
 * @returns {Promise<boolean>}
 */
const isDartAvailable = () => {
  return new Promise((resolve) => {
    const checkCmd = process.platform === 'win32' ? 'where dart' : 'which dart';
    exec(checkCmd, (error, stdout) => {
      if (error || !stdout || stdout.trim() === '') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Executes a Dart script file and captures its output.
 * Cleans up the generated .dart file in a finally block to prevent orphaned files.
 * @param {string} filePath - Absolute path to the Dart script
 * @returns {Promise<string>} - Resolves with stdout or rejects with descriptive error
 */
const executeDart = async (filePath) => {
  const jobId = path.basename(filePath).split('.')[0];
  const outputPath = path.join(dirOutputs, `${jobId}.txt`);
  const timeoutMs = parseInt(process.env.EXECUTION_TIMEOUT_MS, 10) || 15000;

  try {
    // 1. Environment check: verify dart executable availability
    const hasDart = await isDartAvailable();
    if (!hasDart) {
      const err = new Error(DART_NOT_INSTALLED_ERROR);
      err.error = DART_NOT_INSTALLED_ERROR;
      throw err;
    }

    return await new Promise((resolve, reject) => {
      exec(
        `dart run "${filePath}"`,
        { timeout: timeoutMs, maxBuffer: 1024 * 1024 },
        async (error, stdout, stderr) => {
          const captured = (stdout || '') + (stderr ? `\n[STDERR]:\n${stderr}` : '');
          try {
            await fs.promises.writeFile(outputPath, captured);
          } catch (_) {}

          if (error) {
            const combinedMsg = `${error.message || ''} ${stderr || ''}`;
            if (
              error.code === 'ENOENT' ||
              combinedMsg.includes('not recognized') ||
              combinedMsg.includes('ENOENT') ||
              combinedMsg.includes('not found')
            ) {
              const dartErr = new Error(DART_NOT_INSTALLED_ERROR);
              dartErr.error = DART_NOT_INSTALLED_ERROR;
              return reject(dartErr);
            }
            return reject(stderr || error.message || error);
          }
          if (stderr) {
            return reject(stderr);
          }
          resolve(stdout);
        }
      );
    });
  } catch (err) {
    if (
      err.code === 'ENOENT' ||
      (typeof err.message === 'string' &&
        (err.message.includes('not recognized') ||
          err.message.includes('ENOENT') ||
          err.message.includes('not found')))
    ) {
      const dartErr = new Error(DART_NOT_INSTALLED_ERROR);
      dartErr.error = DART_NOT_INSTALLED_ERROR;
      throw dartErr;
    }
    throw err;
  } finally {
    // 2. Clean up the generated .dart file to prevent orphaned files
    try {
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (cleanupErr) {
      console.warn(`[executeDart] Cleanup warning for ${filePath}:`, cleanupErr.message);
    }
  }
};

executeDart.executeDart = executeDart;
executeDart.isDartAvailable = isDartAvailable;
executeDart.dirOutputs = dirOutputs;

module.exports = executeDart;
module.exports.executeDart = executeDart;
module.exports.isDartAvailable = isDartAvailable;
module.exports.dirOutputs = dirOutputs;
