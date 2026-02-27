import { useState, useEffect } from "react";
import MinimalHero from "./components/minimal-hero";
import FadeContent from "./components/ui/fadecontent";

const API = import.meta.env.VITE_API_ENDPOINT;

function formatDate(dateValue: string | number): string {
  try {
    const date = typeof dateValue === "number" ? new Date(dateValue * 1000) : new Date(dateValue);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shortUrl) {
      setShowResult(true);
    }
  }, [shortUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    setShowResult(false);

    try {
      const res = await fetch(`${API}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      console.log("API response:", data);
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setShortUrl(`${API}/${data.code}`);
      if (data.expiresAt) {
        setExpiresAt(data.expiresAt);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };




  return (
    <>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/hubot-sans');
        
        .liquid-glass {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(20, 20, 20, 0.85) 0%,
            rgba(30, 30, 30, 0.75) 50%,
            rgba(15, 15, 15, 0.9) 100%
          );
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        
        .border-glow {
          position: relative;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            #3f3f46 0%,
            #27272a 25%,
            #3f3f46 50%,
            #27272a 75%,
            #3f3f46 100%
          );
          background-size: 300% 300%;
          animation: borderShift 4s ease infinite;
        }
        
        @keyframes borderShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(82, 82, 91, 0.5) 0%,
            rgba(39, 39, 42, 0.3) 50%,
            rgba(82, 82, 91, 0.5) 100%
          );
          background-size: 200% 200%;
          animation: borderShift 3s ease infinite reverse;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          pointer-events: none;
          opacity: 0.6;
        }
        
        .liquid-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
        }
        
        .liquid-glass::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            ellipse at 30% 20%,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 50%
          );
          pointer-events: none;
        }
        
        .url-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(60, 60, 60, 0.5);
          border-radius: 12px;
          color: #fafafa;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .url-input::placeholder {
          color: rgba(161, 161, 170, 0.7);
        }
        
        .url-input:focus {
          border-color: rgba(100, 100, 100, 0.8);
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(80, 80, 80, 0.15);
        }
        
        .shorten-btn {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #fafafa 0%, #e5e5e5 100%);
          border: none;
          border-radius: 12px;
          color: #0a0a0a;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .shorten-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .shorten-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
        }
        
        .shorten-btn:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .shorten-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .shorten-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .shorten-btn.loading {
          background: linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 100%);
        }
        
        .result-container {
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .result-container.hidden {
          max-height: 0;
          opacity: 0;
          margin-top: 0;
        }
        
        .result-container.visible {
          max-height: 200px;
          opacity: 1;
          margin-top: 20px;
        }
        
        .result-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(60, 60, 60, 0.4);
          border-radius: 12px;
          padding: 16px;
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .url-link {
          color: #fafafa;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          word-break: break-all;
          transition: color 0.2s ease;
        }
        
        .url-link:hover {
          color: #d4d4d4;
        }
        
        .copy-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(80, 80, 80, 0.5);
          border-radius: 8px;
          color: #fafafa;
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(100, 100, 100, 0.6);
        }
        
        .copy-btn.copied {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.4);
          color: #22c55e;
        }
        
        .error-text {
          color: #f87171;
          font-size: 13px;
          margin-top: 12px;
          animation: shake 0.5s ease;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .expires-text {
          color: rgba(161, 161, 170, 0.8);
          font-size: 12px;
          margin-top: 12px;
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(10, 10, 10, 0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .card-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 24px;
          padding-top: calc(40vh + 40px);
          padding-bottom: 160px;
          z-index: 50;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 640px) {
          .card-wrapper {
            padding-top: 360px;
            padding-bottom: 160px;
          }
        }
        
        .card-inner {
          pointer-events: auto;
          width: 100%;
          max-width: 440px;
        }
        
        @media (max-width: 640px) {
          .card-inner {
            max-width: 100%;
          }
        }
      `}</style>

      <MinimalHero />
      
      <FadeContent blur={true} duration={1200} initialOpacity={0} delay={0.5}>
      <div className="card-wrapper">
        <div className="card-inner">
          <div className="border-glow">
          <div className="liquid-glass" style={{ borderRadius: '19px', padding: '32px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* <h2 style={{ 
                color: '#fafafa', 
                fontSize: '20px', 
                fontWeight: 600, 
                marginBottom: '6px',
                fontFamily: "'Hubot Sans', ui-sans-serif, system-ui, sans-serif"
              }}>
                Shorten URL
              </h2> */}
              {/* <p style={{ 
                color: 'rgba(161, 161, 170, 0.9)', 
                fontSize: '14px', 
                marginBottom: '24px',
                fontFamily: "'Hubot Sans', ui-sans-serif, system-ui, sans-serif"
              }}>
                Paste your long URL below
              </p> */}

              <form onSubmit={handleSubmit}>
                <input
                  type="url"
                  placeholder="https://example.com/long/url"
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  required
                  className="url-input"
                  style={{ marginBottom: '16px', fontFamily: "'Hubot Sans', ui-sans-serif, system-ui, sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`shorten-btn ${loading ? 'loading' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Shortening...
                    </>
                  ) : (
                    'Shorten'
                  )}
                </button>
              </form>

              {error && (
                <p className="error-text">{error}</p>
              )}

              <div className={`result-container ${showResult ? 'visible' : 'hidden'}`}>
                {shortUrl && (
                  <div className="result-box">
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="url-link"
                        style={{ flex: 1, minWidth: 0 }}
                      >
                        {shortUrl}
                      </a>
                      <button 
                        onClick={handleCopy}
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    {expiresAt && (
                      <p className="expires-text">
                        Expires: {formatDate(expiresAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </FadeContent>
    </>
  );
}

