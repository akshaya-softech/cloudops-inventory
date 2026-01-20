import React, { useState, useEffect } from 'react';
import { Package, DollarSign, AlertTriangle, Layers, TrendingUp } from 'lucide-react';
import { inventoryService, healthService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, metricsRes] = await Promise.all([
          inventoryService.getStats(),
          healthService.getMetrics()
        ]);
        setStats(statsRes.data.data);
        setMetrics(metricsRes.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>CloudOps Dashboard</h1>
        <p>Cloud Resources Inventory Overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3><Package size={16} /> Total Resources</h3>
          <div className="value blue">{stats?.totalItems || 0}</div>
        </div>
        <div className="stat-card">
          <h3><DollarSign size={16} /> Total Monthly Cost</h3>
          <div className="value green">${(stats?.totalValue || 0).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3><Layers size={16} /> Categories</h3>
          <div className="value yellow">{stats?.categories || 0}</div>
        </div>
        <div className="stat-card">
          <h3><AlertTriangle size={16} /> Low Stock Items</h3>
          <div className="value red">{stats?.lowStockItems || 0}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h2><TrendingUp size={20} /> Cost by Category</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Resources</th>
                  <th>Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                {stats?.byCategory?.map((cat, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`category-badge ${cat.category?.toLowerCase()}`}>
                        {cat.category}
                      </span>
                    </td>
                    <td>{cat.count}</td>
                    <td>${parseFloat(cat.value).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>🖥️ System Status</h2>
          <div className="metric-row">
            <span className="metric-label">Health Status</span>
            <span className="metric-value status-healthy">
              {metrics?.health?.statusIcon} {metrics?.health?.status}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Database</span>
            <span className="metric-value status-healthy">
              {metrics?.database?.statusIcon} {metrics?.database?.status}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Uptime</span>
            <span className="metric-value">{metrics?.health?.uptime}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Environment</span>
            <span className="metric-value">{metrics?.deployment?.environment}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Version</span>
            <span className="metric-value">{metrics?.deployment?.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;