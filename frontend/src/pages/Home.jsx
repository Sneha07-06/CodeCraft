import React from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Image,
  Sparkles,
  Cpu,
  Lock,
  ArrowRight,
  Code2,
  Mic,
  Globe,
  Layers,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="home-page" id="home-dashboard-view">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="badge badge-brand" style={{ marginBottom: '16px' }}>
          <Sparkles size={14} /> Multimodal IDE & Intelligent Code Development Platform
        </div>
        <h1 className="hero-title">
          Craft, Run & Extract Code <br />
          <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Without Boundaries
          </span>
        </h1>
        <p className="hero-subtitle">
          CodeCraft is a next-generation developer studio featuring a 4-in-1 IDE (Python, Dart, HTML & JavaScript Live Preview), speech-to-code voice input, client-side OCR extraction, and secure session management.
        </p>

        {/* Quick Navigation Action Buttons */}
        <div className="hero-actions">
          <Link to="/editor" className="btn btn-primary" id="hero-btn-editor">
            <Terminal size={18} />
            Launch 4-in-1 Code Editor
            <ArrowRight size={16} />
          </Link>
          <Link to="/image-to-text" className="btn btn-secondary" id="hero-btn-ocr">
            <Image size={18} />
            Try Image to Text
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="features-grid">
          {/* Card 1: 4-in-1 IDE Workspace */}
          <div className="glass-panel feature-card" id="feature-card-ide">
            <div className="feature-icon-wrapper">
              <Layers size={26} />
            </div>
            <h3 className="feature-title">4-in-1 Multimodal IDE</h3>
            <p className="feature-desc">
              Execute Python & Dart scripts via backend sandbox compilation, plus instant client-side HTML5 & JavaScript live preview editing.
            </p>
          </div>

          {/* Card 2: HTML & JS Live Preview */}
          <div className="glass-panel feature-card" id="feature-card-live-preview">
            <div className="feature-icon-wrapper">
              <Globe size={26} />
            </div>
            <h3 className="feature-title">Live Browser Sandbox</h3>
            <p className="feature-desc">
              Split-pane sandboxed iframe runtime renders HTML/CSS/JS and captures console logs directly as you type or on clicking Run.
            </p>
          </div>

          {/* Card 3: Voice-to-Code Input */}
          <div className="glass-panel feature-card" id="feature-card-voice-input">
            <div className="feature-icon-wrapper" style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
              <Mic size={26} />
            </div>
            <h3 className="feature-title">Voice-to-Text Dictation</h3>
            <p className="feature-desc">
              Native Web Speech API recognition translates spoken programming commands (new line, brackets, indent, colon) straight into the editor cursor buffer.
            </p>
          </div>

          {/* Card 4: OCR Image to Text */}
          <div className="glass-panel feature-card" id="feature-card-ocr">
            <div className="feature-icon-wrapper">
              <Image size={26} />
            </div>
            <h3 className="feature-title">Image-to-Text Pipeline</h3>
            <p className="feature-desc">
              High-accuracy client-side optical character recognition using Tesseract.js. Convert snippets and screenshots into runnable code in one click.
            </p>
          </div>

          {/* Card 5: Monaco Code Editor */}
          <div className="glass-panel feature-card" id="feature-card-monaco">
            <div className="feature-icon-wrapper">
              <Code2 size={26} />
            </div>
            <h3 className="feature-title">VS Code-Grade Monaco</h3>
            <p className="feature-desc">
              Full-featured Monaco Editor with syntax highlighting for Python, Dart, HTML, and JS, smooth caret animations, and dark glass theme.
            </p>
          </div>

          {/* Card 6: Authentication & Security */}
          <div className="glass-panel feature-card" id="feature-card-auth">
            <div className="feature-icon-wrapper">
              <Lock size={26} />
            </div>
            <h3 className="feature-title">Mongoose & JWT Auth</h3>
            <p className="feature-desc">
              Secure authentication engine with bcrypt password hashing, JWT session cookies, and persistent user profile dashboards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
