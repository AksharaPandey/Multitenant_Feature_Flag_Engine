import React, { useEffect, useState } from 'react';

export default function App() {
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState('');
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(null);

  const BACKEND_URL = 'http://localhost:8080';

  // 1. Fetch feature flags from backend on load
  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/flags`);
      const data = await res.json();
      setFlags(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching flags:', err);
      setLoading(false);
    }
  };

  // 2. Toggle a feature flag live
  const handleToggle = async (key, currentStatus) => {
    setPending(key);
    try {
      const res = await fetch(
          `${BACKEND_URL}/api/admin/flags/toggle?featureKey=${key}&isEnabled=${!currentStatus}`,
          { method: 'POST' }
      );
      const updatedFlags = await res.json();
      setFlags(updatedFlags);
    } catch (err) {
      console.error('Error toggling flag:', err);
    } finally {
      setPending(null);
    }
  };

  // 3. Test client endpoints against your AOP Aspect
  const testEndpoint = async (endpoint) => {
    setApiResponse('Evaluating via Spring AOP...');
    setStatus(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/${endpoint}`);
      const text = await res.text();
      setStatus(res.status);
      setApiResponse(text);
    } catch (err) {
      setStatus(500);
      setApiResponse('Failed to reach backend server.');
    }
  };

  const statusChannel = status === 200 ? 'ok' : status === 403 ? 'blocked' : status ? 'error' : 'idle';

  return (
      <div style={styles.page}>
        <style>{css}</style>

        <div style={styles.container}>
          <header style={styles.header}>
            <div style={styles.headerLeft}>
              <div className="led led--on" style={{ width: 10, height: 10 }} />
              <div>
                <h1 style={styles.title}>FEATURE&nbsp;FLAG&nbsp;CONTROL&nbsp;PANEL</h1>
                <p style={styles.subtitle}>SPRING BOOT · AOP EVALUATION · LIVE CACHE EVICTION</p>
              </div>
            </div>
            <div style={styles.sysStatus}>
              <span style={styles.sysStatusLabel}>SYS.STATUS</span>
              <span style={styles.sysStatusValue}>ONLINE</span>
            </div>
          </header>

          {/* Admin Panel Section */}
          <section className="panel">
            <PanelHeader index="01" title="ADMIN TOGGLES" note={`${Object.keys(flags).length} REGISTERED`} />

            <div style={styles.panelBody}>
              {loading ? (
                  <p style={styles.loadingText}>READING FLAG TABLE FROM SPRING BOOT&hellip;</p>
              ) : Object.keys(flags).length === 0 ? (
                  <p style={styles.loadingText}>NO FLAGS REGISTERED YET.</p>
              ) : (
                  <div style={styles.flagGrid}>
                    {Object.entries(flags).map(([key, enabled]) => (
                        <div key={key} className="flagRow" style={styles.flagRow}>
                          <div style={styles.flagInfo}>
                            <div
                                className={`led ${enabled ? 'led--on' : 'led--off'}`}
                                style={{ width: 9, height: 9 }}
                            />
                            <div>
                              <div style={styles.flagName}>{key}</div>
                              <div style={{ ...styles.flagState, color: enabled ? 'var(--ok)' : 'var(--danger)' }}>
                                {enabled ? 'ENABLED' : 'DISABLED'}
                              </div>
                            </div>
                          </div>

                          <button
                              className="switch"
                              role="switch"
                              aria-checked={enabled}
                              aria-label={`Toggle ${key}`}
                              onClick={() => handleToggle(key, enabled)}
                              data-on={enabled}
                              disabled={pending === key}
                          >
                      <span className="switch-track">
                        <span className="switch-knob" />
                      </span>
                            <span style={styles.switchCaption}>
                        {pending === key ? 'SWITCHING' : enabled ? 'ON' : 'OFF'}
                      </span>
                          </button>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </section>

          {/* Live Sandbox Test Section */}
          <section className="panel">
            <PanelHeader index="02" title="LIVE CLIENT SANDBOX" note="AOP ASPECT TEST" />

            <div style={styles.panelBody}>
              <p style={styles.helperText}>
                Call an endpoint below to see how the aspect evaluates its flag right now.
              </p>

              <div style={styles.btnRow}>
                <button className="pushBtn" onClick={() => testEndpoint('pay')}>
                  <span style={styles.pushBtnLabel}>/api/pay</span>
                </button>
                <button className="pushBtn" onClick={() => testEndpoint('recommendations')}>
                  <span style={styles.pushBtnLabel}>/api/recommendations</span>
                </button>
              </div>

              <div className={`screen screen--${statusChannel}`}>
                <div style={styles.screenHead}>
                  <span>READOUT</span>
                  <span style={styles.screenStatusCode}>
                  {status ? `HTTP ${status}` : 'STANDBY'}
                </span>
                </div>
                <div style={styles.screenBody}>
                  {apiResponse || 'Awaiting request...'}
                </div>
              </div>
            </div>
          </section>

          <footer style={styles.footer}>PANEL REV. 1 · SPRING AOP FEATURE GATE</footer>
        </div>
      </div>
  );
}

function PanelHeader({ index, title, note }) {
  return (
      <div style={styles.panelHeader}>
        <span className="rivet" style={{ position: 'absolute', top: 10, left: 10 }} />
        <span className="rivet" style={{ position: 'absolute', top: 10, right: 10 }} />
        <div style={styles.panelHeaderText}>
          <span style={styles.panelIndex}>{index}</span>
          <h2 style={styles.panelTitle}>{title}</h2>
        </div>
        <span style={styles.panelNote}>{note}</span>
      </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '48px 20px',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    color: 'var(--text)',
  },
  container: {
    maxWidth: '760px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--hairline)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  title: {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 600,
    fontSize: '1.5rem',
    letterSpacing: '0.02em',
    margin: 0,
    color: 'var(--text-bright)',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    color: 'var(--text-dim)',
  },
  sysStatus: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  sysStatusLabel: {
    fontSize: '0.62rem',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
  },
  sysStatusValue: {
    fontSize: '0.85rem',
    color: 'var(--ok)',
    fontWeight: 700,
    letterSpacing: '0.06em',
  },
  panelHeader: {
    position: 'relative',
    padding: '16px 24px',
    borderBottom: '1px solid var(--hairline)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  panelHeaderText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  panelIndex: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: '0.8rem',
    color: 'var(--accent)',
    fontWeight: 600,
  },
  panelTitle: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: '1.05rem',
    letterSpacing: '0.04em',
    margin: 0,
    color: 'var(--text-bright)',
  },
  panelNote: {
    fontSize: '0.65rem',
    letterSpacing: '0.06em',
    color: 'var(--text-dim)',
  },
  panelBody: {
    padding: '20px 24px 24px',
  },
  loadingText: {
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    letterSpacing: '0.03em',
  },
  helperText: {
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    margin: '0 0 16px',
    lineHeight: 1.5,
  },
  flagGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flagRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  flagInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  flagName: {
    fontSize: '0.9rem',
    color: 'var(--text-bright)',
    fontWeight: 600,
  },
  flagState: {
    fontSize: '0.68rem',
    letterSpacing: '0.08em',
    marginTop: '2px',
    fontWeight: 700,
  },
  switchCaption: {
    fontSize: '0.62rem',
    letterSpacing: '0.08em',
    color: 'var(--text-dim)',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  pushBtnLabel: {
    fontSize: '0.78rem',
    letterSpacing: '0.02em',
  },
  screenHead: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.62rem',
    letterSpacing: '0.1em',
    color: 'var(--text-dim)',
    marginBottom: '10px',
  },
  screenStatusCode: {
    fontWeight: 700,
  },
  screenBody: {
    fontSize: '0.85rem',
    lineHeight: 1.6,
    wordBreak: 'break-word',
    color: 'var(--text-bright)',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.62rem',
    letterSpacing: '0.1em',
    color: 'var(--text-dim)',
    marginTop: '32px',
  },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --bg: #20242b;
  --panel: #3a4048;
  --panel-light: #454c56;
  --panel-shadow: #14161a;
  --hairline: rgba(255,255,255,0.08);
  --text: #c7cbd1;
  --text-bright: #f0eee6;
  --text-dim: #8b919c;
  --accent: #f4b942;
  --ok: #4ade80;
  --danger: #f87171;
  --rivet: #16181b;
}

.panel {
  position: relative;
  background:
    linear-gradient(155deg, var(--panel-light), var(--panel) 40%, var(--panel-shadow));
  border-radius: 10px;
  margin-bottom: 22px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.06) inset,
    0 20px 40px -20px rgba(0,0,0,0.6),
    0 0 0 1px rgba(0,0,0,0.4);
}

.rivet {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #5a6068, var(--rivet) 70%);
  box-shadow: 0 1px 1px rgba(255,255,255,0.15) inset, 0 1px 2px rgba(0,0,0,0.6);
}

.led {
  border-radius: 50%;
  flex-shrink: 0;
}
.led--on {
  background: var(--ok);
  box-shadow: 0 0 6px 1px rgba(74,222,128,0.8), 0 0 1px rgba(0,0,0,0.4) inset;
}
.led--off {
  background: #5a3033;
  box-shadow: 0 0 1px rgba(0,0,0,0.5) inset;
}

.switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-family: inherit;
}
.switch:disabled { cursor: wait; opacity: 0.7; }
.switch-track {
  position: relative;
  width: 52px;
  height: 26px;
  border-radius: 999px;
  background: var(--panel-shadow);
  box-shadow: 0 2px 4px rgba(0,0,0,0.5) inset, 0 1px 0 rgba(255,255,255,0.05);
  display: block;
  transition: background 0.2s ease;
}
.switch[data-on="true"] .switch-track {
  background: #1f4430;
}
.switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(155deg, #f5f3ee, #c9c6bd);
  box-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.15);
  transition: transform 0.2s ease;
}
.switch[data-on="true"] .switch-knob {
  transform: translateX(26px);
  background: linear-gradient(155deg, #d9fbe6, #4ade80);
}
.switch:focus-visible .switch-track {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.pushBtn {
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-bright);
  background: linear-gradient(180deg, var(--panel-light), var(--panel-shadow));
  border: none;
  border-radius: 6px;
  padding: 12px 18px;
  cursor: pointer;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.1) inset,
    0 3px 0 var(--panel-shadow),
    0 5px 8px rgba(0,0,0,0.4);
  transform: translateY(0);
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.pushBtn:hover { background: linear-gradient(180deg, #4d545e, var(--panel-shadow)); }
.pushBtn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 rgba(255,255,255,0.1) inset, 0 0 0 var(--panel-shadow), 0 2px 4px rgba(0,0,0,0.4);
}
.pushBtn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.screen {
  background: #12151a;
  border-radius: 6px;
  padding: 16px 18px;
  border-left: 3px solid var(--text-dim);
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(255,255,255,0.015) 0px,
    rgba(255,255,255,0.015) 1px,
    transparent 1px,
    transparent 3px
  );
}
.screen--ok { border-left-color: var(--ok); }
.screen--blocked { border-left-color: var(--danger); }
.screen--error { border-left-color: var(--accent); }
.screen--ok .screenStatusCode,
.screen--ok span:last-child { color: var(--ok); }

.flagRow {
  background: rgba(0,0,0,0.15);
  border-radius: 8px;
  border: 1px solid var(--hairline);
}

@media (prefers-reduced-motion: reduce) {
  .switch-knob, .pushBtn { transition: none; }
}

@media (max-width: 480px) {
  .panel { border-radius: 8px; }
}
`;