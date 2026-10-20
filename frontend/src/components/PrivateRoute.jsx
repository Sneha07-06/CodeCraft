import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';

/**
 * PrivateRoute – guards protected pages.
 *
 * Behaviour:
 *  - While checking auth state → shows a full-screen loading spinner (prevents
 *    protected content from flashing before the check completes).
 *  - Unauthenticated → redirects to /login and preserves the originally
 *    requested path in `state.from` so Login can redirect back afterward.
 *  - Authenticated → renders children normally.
 *
 * The `user` prop is the auth state maintained in App.jsx (from localStorage).
 */
export default function PrivateRoute({ user, children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Simulate a minimal async tick so React has time to hydrate `user`
    // from localStorage before deciding to redirect. This prevents the
    // brief white-flash / redirect on hard refresh.
    const timer = setTimeout(() => setChecking(false), 80);
    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div
        id="auth-loading-screen"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
          color: 'var(--text-muted)',
        }}
      >
        {/* Spinning brand icon */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            animation: 'authSpinnerPulse 1.4s ease-in-out infinite',
          }}
        >
          <Code2 size={26} />
        </div>
        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Verifying session...</p>
        <style>{`
          @keyframes authSpinnerPulse {
            0%   { transform: scale(1);    opacity: 1; }
            50%  { transform: scale(1.12); opacity: 0.75; }
            100% { transform: scale(1);    opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, preserve intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
