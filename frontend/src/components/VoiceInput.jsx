import React, { useState, useEffect, useRef } from 'react';
import { Mic, AlertCircle, Volume2, X } from 'lucide-react';

/**
 * Intelligent symbol & keyword parser that converts speech dictation
 * into syntactic code with proper indentation and punctuation spacing.
 * Authored for CodeCraft by Sneha Prajapati.
 *
 * @param {string} rawTranscript - Natural voice transcript from Web Speech API
 * @returns {string} - Formatted programming code snippet
 */
export const formatSpeechToCode = (rawTranscript) => {
  if (!rawTranscript) return '';

  let text = rawTranscript;

  // Replacements list ordered by descending length/specificity
  const symbolReplacements = [
    // --- Formatting & Indentation ---
    { regex: /\b(new line|enter line|newline|enter)\b/gi, value: '\n' },
    { regex: /\b(tab key|indent|tab)\b/gi, value: '    ' },
    { regex: /\b(space bar|space)\b/gi, value: ' ' },

    // --- Brackets & Parentheses (specific compound phrases first) ---
    { regex: /\b(open round bracket|open parenthesis|open paren)\b/gi, value: '(' },
    { regex: /\b(close round bracket|close parenthesis|close paren)\b/gi, value: ')' },
    { regex: /\b(open square bracket|open bracket)\b/gi, value: '[' },
    { regex: /\b(close square bracket|close bracket)\b/gi, value: ']' },
    { regex: /\b(open curly bracket|open curly|open brace)\b/gi, value: '{\n' },
    { regex: /\b(close curly bracket|close curly|close brace)\b/gi, value: '\n}' },
    { regex: /\b(double quotes|double quote|quotes)\b/gi, value: '"' },
    { regex: /\b(single quotes|single quote|quote)\b/gi, value: "'" },
    { regex: /\b(backtick|template literal)\b/gi, value: '`' },

    // --- Complex Operators (must precede simpler ones) ---
    { regex: /\b(greater than equal to|greater than or equal to|greater than equal)\b/gi, value: ' >= ' },
    { regex: /\b(less than equal to|less than or equal to|less than equal)\b/gi, value: ' <= ' },
    { regex: /\b(triple equals|triple equal|strictly equals)\b/gi, value: ' === ' },
    { regex: /\b(double equal|double equals|equals equals|equal equal)\b/gi, value: ' == ' },
    { regex: /\b(not equal to|not equals|not equal)\b/gi, value: ' != ' },
    { regex: /\b(fat arrow|arrow function|arrow)\b/gi, value: ' => ' },
    { regex: /\b(plus equals|add equals)\b/gi, value: ' += ' },
    { regex: /\b(minus equals|subtract equals)\b/gi, value: ' -= ' },
    { regex: /\b(ampersand ampersand|and and|logical and)\b/gi, value: ' && ' },
    { regex: /\b(pipe pipe|or or|logical or)\b/gi, value: ' || ' },
    { regex: /\b(is equal to|equals|equal)\b/gi, value: ' = ' },

    // --- Punctuation & Single Symbols ---
    { regex: /\b(semi colon|semicolon)\b/gi, value: ';' },
    { regex: /\b(colon)\b/gi, value: ':' },
    { regex: /\b(comma)\b/gi, value: ',' },
    { regex: /\b(full stop|period|dot)\b/gi, value: '.' },
    { regex: /\b(question mark)\b/gi, value: '?' },
    { regex: /\b(exclamation mark|exclamation)\b/gi, value: '!' },
    { regex: /\b(forward slash|slash)\b/gi, value: '/' },
    { regex: /\b(backslash)\b/gi, value: '\\' },
    { regex: /\b(underscore)\b/gi, value: '_' },
    { regex: /\b(hyphen|dash|negative|minus)\b/gi, value: ' - ' },
    { regex: /\b(plus|add)\b/gi, value: ' + ' },
    { regex: /\b(greater than)\b/gi, value: ' > ' },
    { regex: /\b(less than)\b/gi, value: ' < ' },
    { regex: /\b(ampersand)\b/gi, value: ' && ' },
    { regex: /\b(pipe)\b/gi, value: ' || ' },
    { regex: /\b(hashtag|hash)\b/gi, value: '#' },
    { regex: /\b(at the rate|at sign)\b/gi, value: '@' },
    { regex: /\b(modulo|percent)\b/gi, value: ' % ' },
    { regex: /\b(asterisk|multiply|times|star)\b/gi, value: ' * ' },

    // --- Common programming keywords & shorthands ---
    { regex: /\b(console dot log|console log)\b/gi, value: 'console.log(' },
    { regex: /\b(print line|print)\b/gi, value: 'print(' },
    { regex: /\b(const)\b/gi, value: 'const ' },
    { regex: /\b(let)\b/gi, value: 'let ' },
    { regex: /\b(var)\b/gi, value: 'var ' },
    { regex: /\b(function)\b/gi, value: 'function ' },
    { regex: /\b(return)\b/gi, value: 'return ' },
  ];

  for (const { regex, value } of symbolReplacements) {
    text = text.replace(regex, value);
  }

  // --- Clean up punctuation and spacing ---
  // 1. Remove space before standard punctuation (, ; : ? !)
  text = text.replace(/\s+([,;:?])/g, '$1');
  text = text.replace(/([^\s!=])\s+!/g, '$1!');
  text = text.replace(/^\s+!|\s+!$/g, '!');

  // 2. Ensure single space after comma or semicolon if followed by word
  text = text.replace(/([,;])(?!\s|$|\n)/g, '$1 ');

  // 3. Remove spaces around member access dots: "object . prop" -> "object.prop"
  text = text.replace(/\s*\.\s*/g, '.');

  // 4. Ensure operators have normalized spacing:
  text = text.replace(/\s*(===|==|!==|!=|>=|<=|=>|\+=|-=|\&\&|\|\|)\s*/g, ' $1 ');

  // 5. Clean spaces inside parentheses: "( foo )" -> "(foo)"
  text = text.replace(/\(\s+/g, '(');
  text = text.replace(/\s+\)/g, ')');

  // 6. Clean spaces inside square brackets: "[ foo ]" -> "[foo]"
  text = text.replace(/\[\s+/g, '[');
  text = text.replace(/\s+\]/g, ']');

  // 7. Clean spaces around quotes: "' hello '" -> "'hello'"
  text = text.replace(/(['"`])\s+([^\n'"`]+?)\s+\1/g, '$1$2$1');

  // 8. Clean redundant spaces
  text = text.replace(/[ ]{2,}/g, ' ');

  return text;
};

export default function VoiceInput({ onTranscript, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const recognitionRef = useRef(null);
  const isManuallyStoppedRef = useRef(false);

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const hasSupport = !!SpeechRecognition;

  useEffect(() => {
    return () => {
      // Clean up recognition instance when unmounting
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const startListening = () => {
    if (!hasSupport) {
      setErrorMessage(
        'Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.'
      );
      return;
    }

    setErrorMessage(null);
    setInterimText('');
    isManuallyStoppedRef.current = false;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += transcript;
          } else {
            interimTrans += transcript;
          }
        }

        if (interimTrans) {
          // Preview parsed interim transcript as well
          setInterimText(formatSpeechToCode(interimTrans));
        }

        if (finalTrans) {
          setInterimText('');
          const formattedCode = formatSpeechToCode(finalTrans);
          if (onTranscript && formattedCode) {
            onTranscript(formattedCode);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('[VoiceInput] Speech Recognition Event Error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access denied. Please allow microphone permissions in your browser.');
          setIsListening(false);
        } else if (event.error === 'network') {
          setErrorMessage('Network connection error occurred during voice recognition.');
          setIsListening(false);
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // If not manually stopped, attempt restart for continuous listening
        if (!isManuallyStoppedRef.current && isListening) {
          try {
            recognition.start();
            return;
          } catch (_) {}
        }
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('[VoiceInput] Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize microphone. Please check permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimText('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="voice-input-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        id="btn-voice-input"
        className={`btn btn-voice ${isListening ? 'listening' : ''}`}
        title={
          hasSupport
            ? isListening
              ? 'Click to Stop Speech-to-Code'
              : 'Click to Speak Code (Voice-to-Text)'
            : 'Speech-to-Code not supported in this browser'
        }
        style={{
          padding: '8px 14px',
          fontSize: '0.85rem',
        }}
      >
        {isListening ? (
          <>
            <span className="voice-recording-pulse"></span>
            <Mic size={15} className="pulse-mic-icon" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic size={15} />
            <span>Speak Code</span>
          </>
        )}
      </button>

      {/* Interim Speech Preview Tooltip */}
      {isListening && interimText && (
        <div
          className="voice-interim-bubble"
          id="voice-interim-preview"
          style={{
            position: 'absolute',
            bottom: '-34px',
            left: '0',
            whiteSpace: 'nowrap',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--border-glow)',
            color: '#38bdf8',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            zIndex: 50,
            boxShadow: 'var(--shadow-md)',
            pointerEvents: 'none',
          }}
        >
          <Volume2 size={12} style={{ display: 'inline', marginRight: '6px' }} />
          <span>"{interimText}"</span>
        </div>
      )}

      {/* Error Notification Alert */}
      {errorMessage && (
        <div
          className="voice-error-toast"
          id="voice-error-notification"
          style={{
            position: 'absolute',
            top: '45px',
            left: '0',
            minWidth: '260px',
            maxWidth: '340px',
            background: '#1c1318',
            border: '1px solid #f87171',
            color: '#fca5a5',
            fontSize: '0.8rem',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            zIndex: 60,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              padding: '2px',
            }}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
