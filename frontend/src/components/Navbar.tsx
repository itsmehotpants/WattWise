import React from 'react';
import { Zap, ShieldCheck, ShieldAlert, Activity, Cpu, BarChart3, Sparkles, KeyRound } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  token: string | null;
  openTokenModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  token,
  openTokenModal,
}) => {
  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 32px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo & Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
          }} className="pulse-glow">
            <Zap size={24} color="#0b0f19" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Home Energy Tracker
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>API Gateway :8080 ONLINE</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'devices', label: 'IoT Devices & Ingest', icon: Cpu },
            { id: 'analytics', label: 'Analytics & Alerts', icon: BarChart3 },
            { id: 'ai-insights', label: 'AI Optimizer (Ollama)', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(79, 172, 254, 0.15))' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
                  color: isActive ? '#00f2fe' : '#94a3b8',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Keycloak Security Status & Token Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={openTokenModal}
            className={token ? 'btn-secondary' : 'btn-primary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <KeyRound size={16} />
            {token ? (
              <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Keycloak OIDC Token Active
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} /> Authenticate / Get Token
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
