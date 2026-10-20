import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import {
  UploadCloud,
  FileCode,
  Terminal,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  X,
  FileImage,
  ArrowRight,
  Code2,
} from 'lucide-react';

export default function ImageToText() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [extractedCode, setExtractedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [targetLang, setTargetLang] = useState('python');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.name.match(/\.(png|jpe?g|webp)$/i))) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageMeta({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type || 'image/png',
    });
    setExtractedCode('');
    setProgress(0);
    setStatusText('');
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImagePreview(null);
    setImageMeta(null);
    setExtractedCode('');
    setProgress(0);
    setStatusText('');
  };

  const handleExtractCode = async () => {
    if (!image) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText('Initializing Tesseract OCR core...');

    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            setProgress(pct);
            setStatusText(`Recognizing code characters (${pct}%)...`);
          } else if (m.status === 'loading tesseract core') {
            setStatusText('Loading OCR neural weights...');
          } else if (m.status === 'initializing tesseract') {
            setStatusText('Initializing character parser...');
          } else {
            setStatusText(m.status);
          }
        },
      });

      const extracted = result.data.text || '';
      setExtractedCode(extracted);
      setStatusText('Code extraction completed successfully!');
    } catch (err) {
      console.error('OCR Error:', err);
      setStatusText('Failed to extract text from image. Please try another screenshot.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedCode) return;
    navigator.clipboard.writeText(extractedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInEditor = () => {
    if (!extractedCode) return;
    // Direct transfer of extracted code to the code editor buffer
    navigate('/editor', {
      state: {
        extractedCode,
        language: targetLang,
      },
    });
  };

  return (
    <div className="container ocr-workspace" id="image-to-text-view">
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="badge badge-brand" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> Client-Side Multimodal OCR Pipeline
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>
          Image to Text Code Converter
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
          Drop code screenshots, snippets, or textbook photos to parse raw text and run it immediately in the CodeCraft IDE.
        </p>
      </div>

      {/* 1. File Upload & Live Preview Panel */}
      <div
        className="glass-panel dropzone"
        id="ocr-dropzone-panel"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('ocr-file-input').click()}
      >
        <input
          type="file"
          id="ocr-file-input"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {imagePreview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={imagePreview}
                alt="Uploaded code snippet preview"
                id="ocr-image-preview"
                style={{
                  maxHeight: '280px',
                  maxWidth: '100%',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                }}
              />
              <button
                onClick={handleRemoveImage}
                title="Remove image"
                id="btn-remove-preview-image"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: 'var(--accent-rose)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {imageMeta && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <FileImage size={14} color="var(--accent-cyan)" />
                <span>{imageMeta.name}</span>
                <span>&bull;</span>
                <span>{imageMeta.size}</span>
              </div>
            )}

            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Click or drag another image to replace
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '12px 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
              }}
            >
              <UploadCloud size={34} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                Drag & drop code screenshot here
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                or click to browse your files (PNG, JPEG, JPG, WebP)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Extraction Pipeline Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', margin: '26px 0' }}>
        <button
          onClick={handleExtractCode}
          disabled={!image || isProcessing}
          className="btn btn-primary"
          id="btn-extract-code"
          style={{ padding: '12px 28px', fontSize: '1rem' }}
        >
          {isProcessing ? (
            <>
              <RefreshCw size={18} className="spin-animation" />
              Processing Image...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Extract Code
            </>
          )}
        </button>
      </div>

      {/* Progress Bar & Status Text */}
      {isProcessing && (
        <div style={{ marginTop: '16px', background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={14} className="spin-animation" color="var(--accent-cyan)" />
              {statusText}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* 3. Raw Text Editor Area */}
      {extractedCode && (
        <div className="glass-panel" style={{ marginTop: '32px', padding: '26px' }} id="extracted-code-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCode size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Raw Extracted Code</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(0, 0, 0, 0.3)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                {extractedCode.length} characters &bull; {extractedCode.split('\n').length} lines
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Target Language Selector */}
              <div className="language-dropdown-wrapper">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="language-dropdown"
                  style={{ padding: '6px 30px 6px 12px', fontSize: '0.85rem' }}
                  title="Target Language for Editor"
                  id="ocr-target-language"
                >
                  <option value="python">Python 3</option>
                  <option value="dart">Dart SDK</option>
                  <option value="html">HTML5</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              {/* Copy to Clipboard Button */}
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                id="btn-copy-clipboard"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                title="Copy to Clipboard"
              >
                {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                {copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}
              </button>

              {/* Open in CodeCraft Editor Button */}
              <button
                onClick={handleOpenInEditor}
                className="btn btn-primary"
                id="btn-open-codecraft-editor"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                title="Open in CodeCraft Editor"
              >
                <Terminal size={15} />
                Open in CodeCraft Editor
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <textarea
            value={extractedCode}
            onChange={(e) => setExtractedCode(e.target.value)}
            id="extracted-code-textarea"
            placeholder="Extracted code text will appear here..."
            spellCheck="false"
            style={{
              width: '100%',
              minHeight: '240px',
              background: '#05070a',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              color: '#34d399',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
