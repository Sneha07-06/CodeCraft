const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from config.env
dotenv.config({ path: path.join(__dirname, 'config.env') });
dotenv.config({ path: './config.env' });

// Initialize MongoDB connection
require('./db/conn.js');

// Import code generation & execution modules
const { generateFile: generatePy } = require('./router/generatePy');
const { executepy } = require('./router/executepy');
const { generateFile: generateDart } = require('./router/generateDart');
const { executeDart } = require('./router/executeDart');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'CodeCraft',
    status: 'Active',
    author: 'Sneha Prajapati',
  });
});

// Authentication and user profile routes
app.use(require('./router/auth'));

/**
 * Python Execution Route
 * POST /run/python
 * Body: { language: "python", code: string }
 * Response: { output: string }
 */
app.post('/run/python', async (req, res) => {
  const { language = 'python', code } = req.body;

  if (!code || code.trim() === '') {
    return res.status(400).json({ error: 'Code cannot be empty' });
  }

  try {
    const filePath = await generatePy(language, code);
    const output = await executepy(filePath);
    return res.status(200).json({ output });
  } catch (err) {
    return res.status(500).json({
      error: typeof err === 'string' ? err : err.message || 'Python execution failed',
    });
  }
});

/**
 * Dart Execution Route
 * POST /run/dart
 * Body: { language: "dart", code: string }
 * Response: { output: string }
 */
app.post('/run/dart', async (req, res) => {
  const { language = 'dart', code } = req.body;

  if (!code || code.trim() === '') {
    return res.status(400).json({ error: 'Code cannot be empty' });
  }

  let filePath = null;
  try {
    filePath = await generateDart(language, code);
    const output = await executeDart(filePath);
    return res.status(200).json({ output });
  } catch (err) {
    const errorMsg =
      typeof err === 'string'
        ? err
        : err.error || err.message || 'Dart execution failed';
    return res.status(500).json({
      error: errorMsg,
    });
  } finally {
    if (filePath) {
      try {
        if (require('fs').existsSync(filePath)) {
          await require('fs').promises.unlink(filePath);
        }
      } catch (_) {}
    }
  }
});

/**
 * Universal Execution Route
 * POST /run
 * Body: { language: 'python' | 'dart' | 'html' | 'javascript', code: string }
 * Response: { output: string }
 */
app.post('/run', async (req, res) => {
  const { language = 'python', code } = req.body;

  if (!code || code.trim() === '') {
    return res.status(400).json({ error: 'Code cannot be empty' });
  }

  const normalizedLang = language.toLowerCase().trim();

  try {
    let output;
    if (normalizedLang === 'python' || normalizedLang === 'py') {
      const filePath = await generatePy('py', code);
      output = await executepy(filePath);
    } else if (normalizedLang === 'dart') {
      let filePath = null;
      try {
        filePath = await generateDart('dart', code);
        output = await executeDart(filePath);
      } finally {
        if (filePath) {
          try {
            if (require('fs').existsSync(filePath)) {
              await require('fs').promises.unlink(filePath);
            }
          } catch (_) {}
        }
      }
    } else if (normalizedLang === 'html' || normalizedLang === 'javascript' || normalizedLang === 'js') {
      return res.status(200).json({
        output: 'Client-side runtime: Code executes inside the sandboxed live preview iframe.',
      });
    } else {
      return res.status(400).json({
        error: `Language "${language}" is not supported. Supported languages: python, dart, html, javascript.`,
      });
    }

    return res.status(200).json({ output });
  } catch (err) {
    const errorMsg =
      typeof err === 'string'
        ? err
        : err.error || err.message || 'Execution failed';
    return res.status(500).json({
      error: errorMsg,
    });
  }
});

// Centralized 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[CodeCraft Backend] Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
