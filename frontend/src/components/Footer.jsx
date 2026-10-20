import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" id="app-footer">
      <div className="container footer-content">
        <p className="footer-author" id="footer-author-text">
          Developed by <strong>Sneha Prajapati</strong>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-dim)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="footer-status">
            <span className="status-dot"></span>
            System Operational
          </span>
          <span>•</span>
          <span>Python, Dart, HTML & JS Live Preview</span>
          <span>•</span>
          <span>Speech-to-Code Voice Input</span>
          <span>•</span>
          <span>Client-side OCR Tesseract.js</span>
        </div>
      </div>
    </footer>
  );
}
