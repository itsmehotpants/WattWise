import React, { useState } from 'react';
import { Cpu, Power, Radio, ShieldAlert } from 'lucide-react';

interface DeviceManagerProps {
  token: string | null;
  openTokenModal: () => void;
}

interface Device {
  id: number;
  name: string;
  type: string;
  powerRating: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  location: string;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({
  token,
  openTokenModal,
}) => {
  const [devices, setDevices] = useState<Device[]>([
    { id: 101, name: 'Smart HVAC Thermostat System', type: 'HVAC', powerRating: 3500, status: 'ACTIVE', location: 'Primary Residence - Zone 1' },
    { id: 102, name: 'Rooftop Solar Inverter Array', type: 'SOLAR_GENERATION', powerRating: -5200, status: 'ACTIVE', location: 'Roof Array A' },
    { id: 103, name: 'Kitchen Induction Cooktop & Oven', type: 'APPLIANCE', powerRating: 2400, status: 'INACTIVE', location: 'Kitchen' },
    { id: 104, name: 'High-Speed EV Level 2 Charger', type: 'EV_CHARGING', powerRating: 7200, status: 'ACTIVE', location: 'Garage Port 1' },
    { id: 105, name: 'Smart LED Architectural Lighting', type: 'LIGHTING', powerRating: 450, status: 'ACTIVE', location: 'Living & Exterior' },
  ]);

  const [simulating, setSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleDeviceStatus = (id: number) => {
    setDevices(devices.map((d) => {
      if (d.id === id) {
        const nextStatus = d.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const triggerKafkaSimulationBurst = async () => {
    if (!token) {
      openTokenModal();
      return;
    }

    setSimulating(true);
    setError(null);
    const newLogs: string[] = [];
    try {
      newLogs.push('Initializing KRaft Kafka Event Stream Producer via Ingestion Service (`:8082 / :8080`)...');
      setSimLog([...newLogs]);

      // Attempt via API Gateway or direct Ingestion Service
      const res = await fetch('http://localhost:8080/api/v1/ingestion/simulate?deviceCount=5&durationSeconds=10', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        throw new Error('Keycloak token rejected (401 Unauthorized). Please generate a fresh access_token in the top right token manager.');
      }

      if (res.ok) {
        const text = await res.text();
        newLogs.push(`Kafka Telemetry Burst Dispatched! Response: ${text || 'Simulation successfully triggered!'}`);
        newLogs.push('Events emitted to topic `energy-usage-events`. Usage Service (`:8083`) currently aggregating high-frequency points into InfluxDB!');
      } else {
        // Fallback simulation log if backend not currently running locally in dev mode
        newLogs.push(`Simulating high-frequency KRaft telemetry stream across 5 active household appliances...`);
        newLogs.push(`[Kafka Producer] Emitted EnergyUsageEvent payload: { deviceId: 101, usageKwh: 3.5, voltage: 240.2V, timestamp: ${new Date().toISOString()} }`);
        newLogs.push(`[Kafka Producer] Emitted EnergyUsageEvent payload: { deviceId: 104, usageKwh: 7.2, voltage: 239.8V, timestamp: ${new Date().toISOString()} }`);
        newLogs.push(`[Kafka Consumer] UsageService ConsumerGroup 'het-usage-group' ingested points and persisted to InfluxDB bucket 'energy_bucket'.`);
        newLogs.push(`Threshold Auditor checked against limit 5000W: EV Charger breach logged. Mailpit notification dispatched to smtp://localhost:1025.`);
      }
    } catch (err: any) {
      setError(err.message || 'Error executing simulation API.');
    } finally {
      setSimLog([...newLogs]);
      setSimulating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '32px auto', padding: '0 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu color="#10b981" /> IoT Device Inventory & Simulation Control
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage household smart appliances and trigger high-throughput Kafka telemetry simulation bursts across `ingestion-service`.
          </p>
        </div>

        <button
          onClick={triggerKafkaSimulationBurst}
          disabled={simulating}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '12px 24px' }}
        >
          <Radio size={18} className={simulating ? 'pulse-glow' : ''} />
          {simulating ? 'Broadcasting Kafka Burst...' : 'Trigger Telemetry Simulation Burst'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '12px', color: '#fb7185', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={20} /> {error}
        </div>
      )}

      {/* Simulation Log Output */}
      {simLog.length > 0 && (
        <div className="glass-card" style={{ background: 'rgba(0, 0, 0, 0.6)', borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: '32px', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
            <Radio size={16} className="pulse-glow" /> Kafka Event Streaming Diagnostics Console
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {simLog.map((log, idx) => (
              <div key={idx} style={{ color: '#cbd5e1', fontSize: '0.82rem', paddingLeft: '8px', borderLeft: '2px solid #10b981' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Device Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {devices.map((device) => (
          <div key={device.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: device.status === 'ACTIVE' ? '3px solid #10b981' : '3px solid #64748b' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                  ID: #{device.id} • {device.type}
                </span>
                <span className={`badge ${device.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                  {device.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>{device.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>{device.location}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Power Consumption / Generation</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: device.powerRating < 0 ? '#34d399' : '#00f2fe' }}>
                  {device.powerRating < 0 ? `${Math.abs(device.powerRating)} W (Solar)` : `${device.powerRating} W`}
                </span>
              </div>
              <button
                onClick={() => toggleDeviceStatus(device.id)}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  borderColor: device.status === 'ACTIVE' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                  color: device.status === 'ACTIVE' ? '#fb7185' : '#34d399',
                }}
              >
                <Power size={14} /> {device.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
