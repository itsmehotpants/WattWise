import React, { useState } from 'react';
import { BarChart3, AlertTriangle, ShieldAlert, Mail, Activity, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface AnalyticsCenterProps {
  token: string | null;
}

export const AnalyticsCenter: React.FC<AnalyticsCenterProps> = ({ token }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const hourlyUsage = [
    { hour: '00:00', kwh: 1.2, cost: 0.18 },
    { hour: '04:00', kwh: 0.8, cost: 0.12 },
    { hour: '08:00', kwh: 3.4, cost: 0.68 },
    { hour: '12:00', kwh: 5.1, cost: 1.22 },
    { hour: '16:00', kwh: 6.8, cost: 1.70 },
    { hour: '20:00', kwh: 4.5, cost: 1.12 },
    { hour: '23:59', kwh: 2.1, cost: 0.42 },
  ];

  const maxKwh = Math.max(...hourlyUsage.map((h) => h.kwh));

  const alertHistory = [
    { id: 1, timestamp: '10 Mins Ago', device: 'High-Speed EV Level 2 Charger (#104)', usage: '7,200 W', threshold: '5,000 W', status: 'EMAIL_DISPATCHED_TO_MAILPIT', type: 'CRITICAL_SPIKE' },
    { id: 2, timestamp: '3 Hours Ago', device: 'Kitchen Induction Cooktop & Oven (#103)', usage: '5,400 W', threshold: '5,000 W', status: 'AUDIT_LOGGED_MYSQL', type: 'WARNING' },
    { id: 3, timestamp: 'Yesterday', device: 'Smart HVAC Thermostat System (#101)', usage: '5,150 W', threshold: '5,000 W', status: 'RESOLVED', type: 'WARNING' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '32px auto', padding: '0 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 color="#00f2fe" /> Real-Time Energy Analytics & InfluxDB Metrics
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Time-series telemetry visualization aggregated across `usage-service (:8083)` and alert audits from `alert-service (:8084)`.
            {token && <span style={{ color: '#34d399', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}><ShieldCheck size={14} /> OIDC Authorized</span>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                background: timeRange === range ? '#00f2fe' : 'transparent',
                color: timeRange === range ? '#0b0f19' : '#94a3b8',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ borderTop: '3px solid #00f2fe' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Consumption ({timeRange})</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>23.9 kWh</span>
            <span style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              <ArrowDownRight size={16} /> -4.2% vs avg
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>Aggregated via InfluxDB Bucket `energy_bucket`</span>
        </div>

        <div className="glass-card" style={{ borderTop: '3px solid #10b981' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Solar Generation Offset</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>14.2 kWh</span>
            <span style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={16} /> +12% efficiency
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>Rooftop Inverter Array (#102)</span>
        </div>

        <div className="glass-card" style={{ borderTop: '3px solid #f43f5e' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Active Alerts & Threshold Violations</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fb7185' }}>3 Breaches</span>
            <span style={{ color: '#fb7185', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={16} /> Limit: 5,000 W
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>Audited in MySQL + Dispatched to Mailpit (:8025)</span>
        </div>
      </div>

      {/* Chart & Alerts Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', '@media (max-width: 1000px)': { gridTemplateColumns: '1fr' } } as any}>
        {/* Usage Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="#00f2fe" size={20} /> Hourly Consumption Profile (`kWh`)
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', paddingTop: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
            {hourlyUsage.map((item) => {
              const heightPercent = (item.kwh / maxKwh) * 100;
              return (
                <div key={item.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: '#00f2fe', fontWeight: 600 }}>{item.kwh}</span>
                  <div
                    style={{
                      width: '60%',
                      height: `${heightPercent}%`,
                      background: item.kwh > 5 ? 'linear-gradient(to top, #f43f5e, #fb7185)' : 'linear-gradient(to top, #00f2fe, #4facfe)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease',
                      boxShadow: item.kwh > 5 ? '0 0 15px rgba(244, 63, 94, 0.4)' : '0 0 15px rgba(0, 242, 254, 0.3)',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.hour}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>Dynamic Peak Tariff: $0.24 / kWh (14:00 - 18:00)</span>
            <span>Off-Peak Rate: $0.12 / kWh</span>
          </div>
        </div>

        {/* Alert Feed */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert color="#f43f5e" size={20} /> Threshold Violation Audit Feed
            </h3>
            <a href="http://localhost:8025" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#00f2fe', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open Mailpit UI <Mail size={14} />
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {alertHistory.map((alert) => (
              <div key={alert.id} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderLeft: alert.type === 'CRITICAL_SPIKE' ? '4px solid #f43f5e' : '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{alert.device}</span>
                  <span style={{ fontSize: '0.75rem', color: alert.type === 'CRITICAL_SPIKE' ? '#fb7185' : '#fbbf24', background: alert.type === 'CRITICAL_SPIKE' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {alert.usage} (Limit {alert.threshold})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <span>Time: {alert.timestamp}</span>
                  <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
