import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Database, Activity, DollarSign, GitBranch, Clock } from 'lucide-react';
import { healthService } from '../services/api';

function Operations() {
  const [metrics, setMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [metricsRes, auditRes] = await Promise.all([
        healthService.getMetrics(),
        healthService.getAuditLogs(10)
      ]);
      setMetrics(metricsRes.data.data);
      setAuditLogs(auditRes.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load operational data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading operational metrics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="operations">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Operational Dashboard</h1>
          <p>Self-aware system monitoring and metrics</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="metrics-grid">
        {/* Deployment Information */}
        <div className="metric-section">
          <h3><GitBranch size={18} /> Deployment Information</h3>
          <div className="metric-row">
            <span className="metric-label">Version</span>
            <span className="metric-value">{metrics?.deployment?.version}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Environment</span>
            <span className="metric-value">{metrics?.deployment?.environment}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Deployed At</span>
            <span className="metric-value">{metrics?.deployment?.deployedAt}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Git Commit</span>
            <span className="metric-value" style={{ fontFamily: 'monospace' }}>{metrics?.deployment?.gitCommit}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Deployed By</span>
            <span className="metric-value">{metrics?.deployment?.deployedBy}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Node Version</span>
            <span className="metric-value">{metrics?.deployment?.nodeVersion}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Platform</span>
            <span className="metric-value">{metrics?.deployment?.platform}</span>
          </div>
        </div>

        {/* Infrastructure State */}
        <div className="metric-section">
          <h3><Server size={18} /> Infrastructure State</h3>
          <div className="metric-row">
            <span className="metric-label">Region</span>
            <span className="metric-value">{metrics?.infrastructure?.region}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Hostname</span>
            <span className="metric-value">{metrics?.infrastructure?.hostname}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Platform</span>
            <span className="metric-value">{metrics?.infrastructure?.platform}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">CPU Model</span>
            <span className="metric-value" style={{ fontSize: '12px' }}>{metrics?.infrastructure?.cpuModel}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">CPU Cores</span>
            <span className="metric-value">{metrics?.infrastructure?.cpuCores}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Total Memory</span>
            <span className="metric-value">{metrics?.infrastructure?.totalMemory}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Memory Usage</span>
            <span className="metric-value">{metrics?.infrastructure?.memoryUsage}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Active Tasks</span>
            <span className="metric-value">{metrics?.infrastructure?.activeTasks} / {metrics?.infrastructure?.maxTasks}</span>
          </div>
        </div>

        {/* Health Indicators */}
        <div className="metric-section">
          <h3><Activity size={18} /> Health Indicators</h3>
          <div className="metric-row">
            <span className="metric-label">System Health</span>
            <span className="metric-value status-healthy">{metrics?.health?.statusIcon} {metrics?.health?.status}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Uptime</span>
            <span className="metric-value">{metrics?.health?.uptime}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Requests Served</span>
            <span className="metric-value">{metrics?.health?.requestsServed}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Avg Response Time</span>
            <span className="metric-value">{metrics?.health?.avgResponseTime}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Error Rate</span>
            <span className="metric-value status-healthy">{metrics?.health?.errorRate}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Last Checked</span>
            <span className="metric-value" style={{ fontSize: '11px' }}>{new Date(metrics?.health?.lastChecked).toLocaleString()}</span>
          </div>
        </div>

        {/* Database Metrics */}
        <div className="metric-section">
          <h3><Database size={18} /> Database Metrics</h3>
          <div className="metric-row">
            <span className="metric-label">Status</span>
            <span className="metric-value status-healthy">{metrics?.database?.statusIcon} {metrics?.database?.status}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Type</span>
            <span className="metric-value">{metrics?.database?.type}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Host</span>
            <span className="metric-value">{metrics?.database?.host}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Database</span>
            <span className="metric-value">{metrics?.database?.name}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Connections</span>
            <span className="metric-value">{metrics?.database?.activeConnections} / {metrics?.database?.maxConnections}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Tables</span>
            <span className="metric-value">{metrics?.database?.tablesCount}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Audit Logs</span>
            <span className="metric-value">{metrics?.database?.totalAuditLogs}</span>
          </div>
        </div>

        {/* Cost Awareness */}
        <div className="metric-section">
          <h3><DollarSign size={18} /> Cost Awareness (FinOps)</h3>
          <div className="metric-row">
            <span className="metric-label">Environment</span>
            <span className="metric-value" style={{ color: '#4ade80' }}>{metrics?.cost?.environment}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Hourly Cost</span>
            <span className="metric-value">{metrics?.cost?.estimatedHourlyCost}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Daily Cost</span>
            <span className="metric-value">{metrics?.cost?.estimatedDailyCost}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Monthly Cost</span>
            <span className="metric-value">{metrics?.cost?.estimatedMonthlyCost}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Month to Date</span>
            <span className="metric-value">{metrics?.cost?.monthToDate}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Budget</span>
            <span className="metric-value">{metrics?.cost?.budget}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Budget Used</span>
            <span className="metric-value status-healthy">{metrics?.cost?.budgetUsed}</span>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="metric-section">
          <h3><Clock size={18} /> Recent Audit Logs</h3>
          {auditLogs.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>No audit logs yet. Make some changes to inventory!</p>
          ) : (
            auditLogs.map((log, index) => (
              <div key={index} className="metric-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="metric-value" style={{ fontSize: '13px' }}>
                  {log.action === 'CREATE' && '➕'}
                  {log.action === 'UPDATE' && '✏️'}
                  {log.action === 'DELETE' && '🗑️'}
                  {' '}{log.action} on {log.table_name}
                </span>
                <span className="metric-label" style={{ fontSize: '11px' }}>
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Operations;