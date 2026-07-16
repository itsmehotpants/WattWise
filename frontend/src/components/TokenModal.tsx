import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertTriangle, X, Shield, RefreshCw } from 'lucide-react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  token,
  setToken,
}) => {
  const [manualToken, setManualToken] = useState(token || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoGenerate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('http://localhost:8091/realms/het-security-realm/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'het-gateway-client',
          client_secret: 'het-gateway-secret',
          username: 'admin',
          password: 'admin',
          grant_type: 'password',
          scope: 'openid profile email',
        }),
      });

      if (!response.ok) {
        throw new Error(`Keycloak responded with status ${response.status}. Ensure Keycloak is running via 'docker-compose up -d'.`);
      }

      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);
        setManualToken(data.access_token);
        setSuccess('Successfully generated Keycloak JWT token for admin user! Protected API calls (:8080) are now unlocked.');
      } else {
        throw new Error('No access_token field found in Keycloak response.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to auto-fetch Keycloak token. Check CORS or Keycloak container status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveManual = () => {
    if (manualToken.trim()) {
      setToken(manualToken.trim());
      setSuccess('Bearer Token manually saved and attached to future API calls!');
    } else {
      setToken(null);
      setSuccess('Bearer Token cleared.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="glass-card" style={{ width: '600px', maxWidth: '90vw', position: 'relative', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(0, 242, 254, 0.15)', borderRadius: '12px', color: '#00f2fe' }}>
            <Shield size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Keycloak OAuth2 / OIDC Token Manager</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Realm: <strong style={{ color: '#00f2fe' }}>het-security-realm</strong> | Client: <strong style={{ color: '#00f2fe' }}>het-gateway-client</strong></p>
          </div>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
          API Gateway (`http://localhost:8080`) mandates valid Keycloak `Bearer &lt;access_token&gt;` headers on downstream microservice requests. Generate a live token directly from your running Keycloak container or paste one manually below:
        </p>

        {/* Auto Generate Button */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Quick Auto-Acquisition (`admin / admin`)</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fetches JWT token directly via `POST /protocol/openid-connect/token`</p>
            </div>
            <button
              onClick={handleAutoGenerate}
              disabled={loading}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              {loading ? <RefreshCw size={16} className="pulse-glow" /> : <KeyRound size={16} />}
              {loading ? 'Requesting Keycloak...' : 'Auto-Generate Token'}
            </button>
          </div>
        </div>

        {/* Manual Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
            Or Paste Custom JWT Bearer Token (`ey...`):
          </label>
          <textarea
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Paste your Keycloak access_token string here..."
            rows={4}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: '#00f2fe',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              padding: '12px',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        {/* Status Alerts */}
        {error && (
          <div style={{ padding: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '10px', color: '#fb7185', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn-secondary">Close Window</button>
          <button onClick={handleSaveManual} className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            Save & Attach Token
          </button>
        </div>
      </div>
    </div>
  );
};
