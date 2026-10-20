import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Terminal,
  Loader2,
  ChevronDown,
  Clock,
  Layers,
  Trash2,
  Globe,
  RefreshCw,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import VoiceInput, { formatSpeechToCode } from '../components/VoiceInput';

const STARTER_CODES = {
  python: `# CodeCraft Python Environment
# Authored by Sneha Prajapati

def greet(name):
    return f"Welcome to CodeCraft, {name}!"

print(greet("Developer"))

# Calculate Fibonacci sequence
def fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

print("Fibonacci Series (10):", fibonacci(10))
`,
  dart: `// CodeCraft Dart Environment
// Authored by Sneha Prajapati

void main() {
  String author = 'Sneha Prajapati';
  print('Hello from CodeCraft Dart Engine!');
  print('Platform developed by $author');

  List<int> numbers = [1, 2, 3, 4, 5];
  int sum = numbers.reduce((a, b) => a + b);
  print('Sum of $numbers = $sum');
}
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodeCraft HTML5 Live Preview</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #07090e 0%, #161b2e 100%);
      color: #f8fafc;
      min-height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .preview-card {
      background: rgba(22, 30, 49, 0.75);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 18px;
      padding: 32px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid #6366f1;
      color: #a5b4fc;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 1.6rem;
      background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .counter-display {
      font-size: 2.2rem;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 20px;
    }
    .btn-group {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: #4f46e5;
      transform: translateY(-2px);
    }
    button.btn-reset {
      background: rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
    }
    button.btn-reset:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  </style>
</head>
<body>
  <div class="preview-card">
    <div class="badge">LIVE HTML5 SANDBOX</div>
    <h1>CodeCraft Sandbox</h1>
    <p>Authored by Sneha Prajapati. Edit HTML, CSS, or JS in real time to watch updates render live.</p>
    <div class="counter-display" id="counter">0</div>
    <div class="btn-group">
      <button id="incBtn">Increment +</button>
      <button class="btn-reset" id="resetBtn">Reset</button>
    </div>
  </div>

  <script>
    let count = 0;
    const counterEl = document.getElementById('counter');
    const incBtn = document.getElementById('incBtn');
    const resetBtn = document.getElementById('resetBtn');

    incBtn.addEventListener('click', () => {
      count++;
      counterEl.textContent = count;
      console.log('Counter increased to:', count);
    });

    resetBtn.addEventListener('click', () => {
      count = 0;
      counterEl.textContent = count;
      console.log('Counter reset to 0');
    });

    console.log('CodeCraft HTML5 Live Sandbox initialized successfully!');
  </script>
</body>
</html>
`,
  javascript: `// CodeCraft JavaScript Playground
// Authored by Sneha Prajapati

console.log("Welcome to CodeCraft JavaScript Playground!");

// Data processing demonstration
const users = [
  { id: 1, name: "Sneha Prajapati", role: "Lead Architect", active: true },
  { id: 2, name: "Alex Rivera", role: "Frontend Engineer", active: true },
  { id: 3, name: "David Kim", role: "Systems Engineer", active: false }
];

console.log("Total user records:", users.length);

const activeUsers = users.filter(u => u.active);
console.log("Active users count:", activeUsers.length);
console.log("Active team roster:", activeUsers.map(u => u.name));

// DOM Manipulation inside the sandbox frame
const app = document.getElementById('app');
if (app) {
  app.innerHTML = \`
    <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 12px; padding: 22px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px; color: #818cf8; font-family: sans-serif;">JavaScript Live Sandbox Output</h3>
      <p style="margin: 0 0 14px; color: #cbd5e1; font-size: 13px; font-family: sans-serif; line-height: 1.5;">
        Authored by <strong>Sneha Prajapati</strong>. Real-time console logs and interactive DOM elements execute instantly inside the sandboxed frame.
      </p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        \${activeUsers.map(u => \`<span style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-family: sans-serif;">✓ \${u.name} (\${u.role})</span>\`).join('')}
      </div>
    </div>
  \`;
}

console.info("Interactive DOM nodes rendered to preview frame successfully.");
`,
};

export default function EditorPage() {
  const location = useLocation();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODES.python);
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'success' | 'error'
  const [copied, setCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [previewDoc, setPreviewDoc] = useState('');
  const [sandboxLogs, setSandboxLogs] = useState([]);

  const editorRef = useRef(null);
  const iframeRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  const isLivePreview = language === 'html' || language === 'javascript';

  // Build the sandboxed iframe HTML document
  const generatePreviewDocument = useCallback((currentLang, currentCode) => {
    if (currentLang === 'html') {
      // Injects console interceptor to report logs to sandbox and parent
      const injectedScript = `
        <script>
          (function() {
            function sendToParent(type, args) {
              try {
                window.parent.postMessage({
                  type: 'CODECRAFT_CONSOLE',
                  level: type,
                  args: args.map(function(a) {
                    try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); } catch(e) { return String(a); }
                  })
                }, '*');
              } catch(e) {}
            }
            ['log', 'info', 'warn', 'error'].forEach(function(m) {
              var orig = console[m];
              console[m] = function() {
                var args = Array.prototype.slice.call(arguments);
                sendToParent(m, args);
                if (orig) orig.apply(console, args);
              };
            });
            window.onerror = function(msg, url, line) {
              sendToParent('error', [msg + (line ? ' (line ' + line + ')' : '')]);
            };
          })();
        </script>
      `;
      // Inject right after <head> or at top
      if (currentCode.includes('<head>')) {
        return currentCode.replace('<head>', '<head>' + injectedScript);
      }
      return injectedScript + currentCode;
    }

    if (currentLang === 'javascript') {
      // Constructs full HTML wrapper that renders in-frame console logs & #app container
      const escapedCode = currentCode;
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeCraft JS Sandbox</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 18px;
      background: #07090e;
      color: #f8fafc;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      line-height: 1.6;
    }
    #app {
      margin-bottom: 20px;
    }
    .console-pane {
      background: rgba(13, 17, 29, 0.85);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 8px;
      padding: 14px 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    }
    .console-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #94a3b8;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
    }
    .console-entries {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 340px;
      overflow-y: auto;
    }
    .console-entry {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 5px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.03);
      word-break: break-word;
      white-space: pre-wrap;
    }
    .badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      flex-shrink: 0;
      letter-spacing: 0.5px;
    }
    .badge-log { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-info { background: rgba(52, 211, 153, 0.2); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); }
    .badge-warn { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
    .badge-error { background: rgba(248, 113, 113, 0.2); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
    .text-log { color: #f1f5f9; }
    .text-info { color: #34d399; }
    .text-warn { color: #fbbf24; }
    .text-error { color: #f87171; }
  </style>
</head>
<body>
  <div id="app"></div>
  <div class="console-pane">
    <div class="console-header">
      <span>Console Output (In-Frame Sandbox)</span>
      <span style="font-size: 10px; color: #34d399;">Active</span>
    </div>
    <div id="console-entries" class="console-entries"></div>
  </div>

  <script>
    (function() {
      var entriesEl = document.getElementById('console-entries');
      function appendUI(type, args) {
        var row = document.createElement('div');
        row.className = 'console-entry';
        var badge = document.createElement('span');
        badge.className = 'badge badge-' + type;
        badge.textContent = type;
        var text = document.createElement('span');
        text.className = 'text-' + type;
        text.textContent = args.map(function(a) {
          try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); } catch(e) { return String(a); }
        }).join(' ');
        row.appendChild(badge);
        row.appendChild(text);
        entriesEl.appendChild(row);
      }

      function sendToParent(type, args) {
        try {
          window.parent.postMessage({
            type: 'CODECRAFT_CONSOLE',
            level: type,
            args: args.map(function(a) {
              try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); } catch(e) { return String(a); }
            })
          }, '*');
        } catch(e) {}
      }

      ['log', 'info', 'warn', 'error'].forEach(function(m) {
        var orig = console[m];
        console[m] = function() {
          var args = Array.prototype.slice.call(arguments);
          appendUI(m, args);
          sendToParent(m, args);
          if (orig) orig.apply(console, args);
        };
      });

      window.onerror = function(msg, url, line) {
        var errStr = msg + (line ? ' (line ' + line + ')' : '');
        appendUI('error', [errStr]);
        sendToParent('error', [errStr]);
      };

      try {
        ${escapedCode}
      } catch(err) {
        var errDesc = (err && err.message) ? err.message : String(err);
        appendUI('error', [errDesc]);
        sendToParent('error', [errDesc]);
      }
    })();
  </script>
</body>
</html>`;
    }

    return '';
  }, []);

  // Listen for console logs emitted from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CODECRAFT_CONSOLE') {
        const { level, args } = event.data;
        setSandboxLogs((prev) => [
          ...prev.slice(-49), // Keep latest 50 logs
          { level, text: args.join(' '), time: new Date().toLocaleTimeString() },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Automatic live preview re-rendering on typing for HTML and JavaScript
  useEffect(() => {
    if (!isLivePreview) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSandboxLogs([]);
      const doc = generatePreviewDocument(language, code);
      setPreviewDoc(doc);
      setStatus('success');
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [code, language, isLivePreview, generatePreviewDocument]);

  // Load code passed from OCR page via router navigation state
  useEffect(() => {
    if (location.state?.extractedCode) {
      setCode(location.state.extractedCode);
      if (location.state.language) {
        setLanguage(location.state.language);
      }
    }
  }, [location.state]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_CODES[newLang] || '');
    setStdout('');
    setStderr('');
    setSandboxLogs([]);
    setStatus('idle');
    setExecutionTime(null);

    if (newLang === 'html' || newLang === 'javascript') {
      const doc = generatePreviewDocument(newLang, STARTER_CODES[newLang] || '');
      setPreviewDoc(doc);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setStatus('running');
    setStdout('');
    setStderr('');
    setExecutionTime(null);
    const startTime = Date.now();

    // 1. Live Preview Modes: HTML & JavaScript (NO backend compilation)
    if (isLivePreview) {
      setSandboxLogs([]);
      const doc = generatePreviewDocument(language, code);
      setPreviewDoc(doc);

      if (iframeRef.current) {
        iframeRef.current.srcdoc = doc;
      }

      setTimeout(() => {
        const elapsed = Date.now() - startTime;
        setExecutionTime(elapsed < 10 ? 12 : elapsed);
        setStatus('success');
        setIsRunning(false);
      }, 120);
      return;
    }

    // 2. Backend Compiling Modes: Python & Dart
    try {
      const endpoint = language === 'python' ? '/run/python' : '/run/dart';
      const response = await axios.post(endpoint, {
        language,
        code,
      });

      const elapsed = Date.now() - startTime;
      setExecutionTime(elapsed);

      const outputResult = response.data?.output !== undefined ? response.data.output : '';
      setStdout(outputResult || '(Code executed successfully with no standard output)');
      setStatus('success');
    } catch (err) {
      const elapsed = Date.now() - startTime;
      setExecutionTime(elapsed);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.stderr ||
        err.message ||
        'Execution failed. Ensure the language runtime is accessible on the host.';
      setStderr(errorMessage);
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  // 1. Reset / Clear Editor: Completely clears the code editor canvas and output console state
  const handleClearEditor = () => {
    setCode('');
    setStdout('');
    setStderr('');
    setSandboxLogs([]);
    setStatus('idle');
    setExecutionTime(null);

    if (isLivePreview) {
      setPreviewDoc('');
      if (iframeRef.current) {
        iframeRef.current.srcdoc = '';
      }
    }
  };

  // 2. Open File: Import from local file explorer with automatic language detection
  const handleOpenFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCode(content);
        setStdout('');
        setStderr('');
        setSandboxLogs([]);
        setStatus('idle');
        setExecutionTime(null);

        // Auto-detect language by file extension
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let detectedLang = language;
        if (ext === 'py') {
          detectedLang = 'python';
        } else if (ext === 'dart') {
          detectedLang = 'dart';
        } else if (['js', 'jsx', 'ts', 'tsx', 'json'].includes(ext)) {
          detectedLang = 'javascript';
        } else if (['html', 'htm', 'css'].includes(ext)) {
          detectedLang = 'html';
        }

        if (detectedLang !== language) {
          setLanguage(detectedLang);
        }

        if (detectedLang === 'html' || detectedLang === 'javascript') {
          const doc = generatePreviewDocument(detectedLang, content);
          setPreviewDoc(doc);
          if (iframeRef.current) {
            iframeRef.current.srcdoc = doc;
          }
        }
      }
    };
    reader.readAsText(file);
    // Reset file input value to allow selecting same file again if desired
    e.target.value = '';
  };

  // 3. Voice transcript receiver: inserts formatted transcript directly at current cursor position
  const handleVoiceTranscript = (transcriptText) => {
    if (!transcriptText) return;

    // Run through formatSpeechToCode to guarantee comprehensive symbol parsing
    const formattedText = formatSpeechToCode(transcriptText);

    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits('speech-to-code', [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            text: formattedText,
            forceMoveMarkers: true,
          },
        ]);
        editor.focus();
        return;
      }
    }

    // Fallback if cursor position is not available
    setCode((prev) => prev + (prev.endsWith('\n') || prev.length === 0 ? '' : ' ') + formattedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToTemplate = () => {
    setCode(STARTER_CODES[language]);
    setStdout('');
    setStderr('');
    setSandboxLogs([]);
    setStatus('idle');
    setExecutionTime(null);
    if (isLivePreview) {
      setPreviewDoc(generatePreviewDocument(language, STARTER_CODES[language]));
    }
  };

  const handleClearTerminal = () => {
    setStdout('');
    setStderr('');
    setSandboxLogs([]);
    setStatus('idle');
    setExecutionTime(null);
  };

  const handleReloadLivePreview = () => {
    setSandboxLogs([]);
    const doc = generatePreviewDocument(language, code);
    setPreviewDoc(doc);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = doc;
    }
  };

  const handleDownload = () => {
    const extMap = {
      python: 'py',
      dart: 'dart',
      html: 'html',
      javascript: 'js',
    };
    const ext = extMap[language] || 'txt';
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `codecraft_${language}_script.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Label display mapping for header
  const getLanguageHeaderLabel = () => {
    switch (language) {
      case 'python':
        return 'Python 3';
      case 'dart':
        return 'Dart SDK';
      case 'html':
        return 'HTML5 / CSS / JS Sandbox';
      case 'javascript':
        return 'JavaScript Engine';
      default:
        return language;
    }
  };

  return (
    <div className="editor-workspace" id="editor-workspace-view">
      {/* Hidden File Input for Open File feature */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".py,.dart,.js,.jsx,.ts,.tsx,.html,.htm,.css,.json,.txt"
        style={{ display: 'none' }}
        onChange={handleOpenFile}
        id="editor-file-input"
      />

      {/* Top Controls Toolbar */}
      <div className="editor-toolbar">
        <div className="editor-controls">
          {/* 4-in-1 Language Selector Dropdown */}
          <div className="language-dropdown-wrapper">
            <select
              id="language-select-dropdown"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-dropdown"
              title="Select Programming Language"
            >
              <option value="python">Python</option>
              <option value="dart">Dart</option>
              <option value="html">HTML</option>
              <option value="javascript">JavaScript</option>
            </select>
            <ChevronDown size={16} className="language-dropdown-icon" />
          </div>

          {/* Run Code / Refresh Preview Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn btn-run"
            id="btn-run-code"
          >
            {isRunning ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                {isLivePreview ? 'Rendering...' : 'Executing...'}
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                {isLivePreview ? 'Run Preview' : 'Run Code'}
              </>
            )}
          </button>

          {/* Reset / Clear Editor Button (clears editor buffer and console state) */}
          <button
            onClick={handleClearEditor}
            className="btn btn-secondary"
            id="btn-clear-editor"
            title="Clear Editor Canvas and Output Console"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Trash2 size={15} />
            Clear
          </button>

          {/* Voice-to-Text (Speech-to-Code) Mic Button */}
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isRunning} />
        </div>

        {/* Toolbar Utility Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Open File / Import Code Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Open / Import Code from Local File Explorer"
            id="btn-open-file"
          >
            <FolderOpen size={15} />
            Open File
          </button>

          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Copy Code to Clipboard"
            id="btn-copy-code"
          >
            {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleResetToTemplate}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Reset to Starter Template"
            id="btn-reset-code"
          >
            <RotateCcw size={15} />
            Template
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Export Source File"
            id="btn-download-code"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Editor & Output Split-Pane Grid Area */}
      <div className="editor-main-area">
        {/* Left Pane: Monaco Code Editor */}
        <div className="editor-pane">
          <div className="pane-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={15} color="var(--accent-primary)" />
              <span>Editor &bull; {getLanguageHeaderLabel()}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              VS Dark &bull; UTF-8 {isLivePreview && '&bull; Live Sync'}
            </span>
          </div>

          <div className="editor-content">
            <MonacoEditor
              height="100%"
              language={language === 'javascript' ? 'javascript' : language}
              theme="vs-dark"
              value={code}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: 'smooth',
                padding: { top: 14, bottom: 14 },
              }}
            />
          </div>
        </div>

        {/* Right Pane: Live Browser Output (HTML / JavaScript) OR Execution Console (Python / Dart) */}
        {isLivePreview ? (
          <div className="preview-pane" id="live-browser-output-pane">
            <div className="pane-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={15} color="var(--accent-cyan)" />
                <span>Live Browser Output</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                  id="live-sandbox-badge"
                >
                  <span className="live-badge-pulse"></span>
                  Live Sandbox
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {executionTime !== null && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Clock size={13} />
                    <span>{executionTime}ms</span>
                  </div>
                )}
                <button
                  onClick={handleReloadLivePreview}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                  }}
                  title="Reload Live Browser Output"
                  id="btn-reload-preview"
                >
                  <RefreshCw size={13} />
                  Reload
                </button>
              </div>
            </div>

            <div className="preview-content">
              {/* Sandboxed iframe with sandbox="allow-scripts" */}
              <iframe
                ref={iframeRef}
                id="live-preview-iframe"
                title="Live Browser Output"
                sandbox="allow-scripts"
                srcDoc={previewDoc}
                className="preview-iframe"
              />
            </div>
          </div>
        ) : (
          <div className="terminal-pane" id="terminal-console-pane">
            <div className="pane-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={15} color="#38bdf8" />
                <span>Execution Console</span>

                {/* Execution Status Indicator */}
                <span className={`status-indicator-badge ${status}`} id="execution-status-indicator">
                  {status === 'idle' && 'Idle'}
                  {status === 'running' && 'Running...'}
                  {status === 'success' && 'Success'}
                  {status === 'error' && 'Error'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {executionTime !== null && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Clock size={13} />
                    <span>{executionTime}ms</span>
                  </div>
                )}
                {(stdout || stderr) && (
                  <button
                    onClick={handleClearTerminal}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                    }}
                    title="Clear Console Output"
                    id="btn-clear-terminal"
                  >
                    <Trash2 size={13} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="terminal-content">
              {/* Running Loader */}
              {isRunning && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--accent-cyan)',
                    padding: '10px 0',
                  }}
                >
                  <Loader2 size={16} className="spin-animation" />
                  <span>Executing {language} sandbox runtime...</span>
                </div>
              )}

              {/* Idle State */}
              {status === 'idle' && !stdout && !stderr && (
                <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '12px 0' }}>
                  Click "Run Code" above to compile and execute your {language} script. Output will be displayed here.
                </div>
              )}

              {/* Standard Output (stdout in green/white text) */}
              {stdout && (
                <div style={{ marginBottom: stderr ? '16px' : '0' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#34d399',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Standard Output (stdout):
                  </div>
                  <pre className="terminal-stdout" id="terminal-stdout-output">
                    {stdout}
                  </pre>
                </div>
              )}

              {/* Error Messages (stderr in red text) */}
              {stderr && (
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#f87171',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Standard Error (stderr):
                  </div>
                  <pre className="terminal-stderr" id="terminal-stderr-output">
                    {stderr}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
