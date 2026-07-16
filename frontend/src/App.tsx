import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SystemOverview } from './components/SystemOverview';
import { DeviceManager } from './components/DeviceManager';
import { AnalyticsCenter } from './components/AnalyticsCenter';
import { AiAdvisor } from './components/AiAdvisor';
import { TokenModal } from './components/TokenModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('het_keycloak_token');
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('het_keycloak_token', token);
    } else {
      localStorage.removeItem('het_keycloak_token');
    }
  }, [token]);

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        token={token}
        openTokenModal={() => setIsModalOpen(true)}
      />

      <main>
        {activeTab === 'overview' && (
          <SystemOverview
            token={token}
            openTokenModal={() => setIsModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'devices' && (
          <DeviceManager
            token={token}
            openTokenModal={() => setIsModalOpen(true)}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsCenter token={token} />
        )}
        {activeTab === 'ai-insights' && (
          <AiAdvisor
            token={token}
            openTokenModal={() => setIsModalOpen(true)}
          />
        )}
      </main>

      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        setToken={setToken}
      />

      <footer style={{
        textAlign: 'center',
        padding: '40px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#64748b',
        fontSize: '0.85rem',
        marginTop: '60px',
      }}>
        <p>Home Energy Tracker Enterprise Ecosystem • Spring Boot 4 • Java 21 • Apache Kafka KRaft • Ollama AI • Keycloak OAuth2</p>
        <p style={{ marginTop: '6px', fontSize: '0.78rem' }}>Connected to API Gateway on port `:8080` & Keycloak OIDC Realm `het-security-realm` on port `:8091`</p>
      </footer>
    </div>
  );
}

export default App;
