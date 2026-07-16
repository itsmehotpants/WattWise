import React, { useState, useEffect } from 'react';
import { Server, Database, Radio, Activity, CheckCircle, AlertCircle, RefreshCw, Cpu, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface SystemOverviewProps {
  token: string | null;
  openTokenModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({
  token,
  openTokenModal,
  setActiveTab,
}) => {
  const [gatewayStatus, setGatewayStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<string>(new Date().toLocaleTimeString());

  const checkGatewayHealth = async () => {
    setGatewayStatus('checking');
    try {
      const res = await fetch('http://localhost:8080/actuator/health');
      if (res.ok) {
        setGatewayStatus('online');
      } else {
        setGatewayStatus('offline');
      }
    } catch {
      setGatewayStatus('offline');
    }
    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkGatewayHealth();
  }, []);

  const microservices = [
    { name: 'API Gateway', port: '8080', role: 'Unified OAuth2 Proxy & Route Aggregator', status: gatewayStatus === 'online' ? 'Healthy' : 'Check Local', icon: Server, color: '#00f2fe' },
    { name: 'User Service', port: '8086', role: 'Profile & Household Management (MySQL)', status: 'Active', icon: Cpu, color: '#4facfe' },
    { name: 'Device Service', port: '8081', role: 'IoT Appliance Inventory & State Control', status: 'Active', icon: Cpu, color: '#10b981' },
    { name: 'Ingestion Service', port: '8082', role: 'KRaft Kafka Telemetry Simulation Engine', status: 'Active', icon: Radio, color: '#f59e0b' },
    { name: 'Usage Service', port: '8083', role: 'Time-Series Aggregation (InfluxDB + Kafka)', status: 'Active', icon: Activity, color: '#38bdf8' },
    { name: 'Alert Service', port: '8084', role: 'Threshold Auditor & Mailpit Email Dispatch', status: 'Active', icon: AlertCircle, color: '#f43f5e' },
    { name: 'Insight Service', port: '8085', role: 'Ollama (`llama3` / `mistral`) AI Optimizer', status: 'Active', icon: Zap, color: '#a855f7' },
  ];

  const infrastructure = [
    { name: 'Keycloak OIDC Realm', port: '8091', role: 'het-security-realm OAuth2 Server', url: 'http://localhost:8091' },
    { name: 'Kafka UI Inspector', port: '8070', role: 'Real-time KRaft Broker Topic Monitor', url: 'http://localhost:8070' },
    { name: 'Grafana Dashboards', port: '3000', role: 'Prometheus Observability Pipelines', url: 'http://localhost:3000' },
    { name: 'Mailpit SMTP UI', port: '8025', role: 'Simulated Email Notification Capture', url: 'http://localhost:8025' },
    { name: 'Unified Swagger API Docs', port: '8080', role: 'Interactive 6-Service OpenAPI Dashboard', url: 'http://localhost:8080/swagger-ui.html' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '32px auto', padding: '0 32px' }}>
      {/* Hero Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(79, 172, 254, 0.05))',
        border: '1px solid rgba(0, 242, 254, 0.25)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-success">Multi-Module Microservices Cluster</span>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Last Ping: {lastCheck}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#fff' }}>
              Distributed Home Energy Tracking Ecosystem
            </h1>
            <p style={{ color: '#cbd5e1', maxWidth: '800px', lineHeight: '1.6', fontSize: '1rem' }}>
              Real-time telemetry ingestion, time-series metrics aggregation, Kafka KRaft event streaming, and Ollama AI optimization insights securely protected by Keycloak OAuth2 OIDC.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={checkGatewayHealth} className="btn-secondary">
              <RefreshCw size={16} className={gatewayStatus === 'checking' ? 'pulse-glow' : ''} /> Ping Gateway (:8080)
            </button>
            <button onClick={() => setActiveTab('devices')} className="btn-primary">
              <Radio size={16} /> Launch Telemetry Burst
            </button>
          </div>
        </div>
      </div>

      {/* Security Banner if Token Missing */}
      {!token && (
        <div className="glass-card" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: '#fbbf24' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>Keycloak Authorization Token Required</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>To interact with protected API endpoints (`POST /api/v1/user`, device toggles, simulation bursts), acquire a JWT token from `het-security-realm`.</p>
            </div>
          </div>
          <button onClick={openTokenModal} className="btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <ShieldCheck size={16} /> Generate OIDC Token
          </button>
        </div>
      )}

      {/* 7 Microservices Grid */}
      <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Cpu color="#00f2fe" size={22} /> Java 21 / Spring Boot 4 Reactor Microservices
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {microservices.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.name} className="glass-card" style={{ borderLeft: `4px solid ${service.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: `${service.color}15`, borderRadius: '10px', color: service.color }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>{service.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>Port: {service.port}</span>
                  </div>
                </div>
                <span className="badge badge-success">
                  <CheckCircle size={12} /> {service.status}
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                {service.role}
              </p>
            </div>
          );
        })}
      </div>

      {/* Infrastructure & Observability Grid */}
      <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Database color="#4facfe" size={22} /> Docker Infrastructure & Live UI Dashboards
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {infrastructure.map((infra) => (
          <div key={infra.name} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>{infra.name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#00f2fe', fontFamily: 'monospace', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                  :{infra.port}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.4' }}>
                {infra.role}
              </p>
            </div>
            <a
              href={infra.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#00f2fe',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Open External Dashboard <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
