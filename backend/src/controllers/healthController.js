const { pool, testConnection } = require('../config/database');
const os = require('os');
require('dotenv').config();

let requestCount = 0;
let totalResponseTime = 0;
const startTime = Date.now();

const trackRequest = (responseTime) => {
    requestCount++;
    totalResponseTime += responseTime;
};

const getHealth = async (req, res) => {
    const requestStart = Date.now();
    
    try {
        const dbConnected = await testConnection();
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        const health = {
            status: dbConnected ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: uptimeSeconds,
            database: dbConnected ? 'connected' : 'disconnected'
        };

        const responseTime = Date.now() - requestStart;
        trackRequest(responseTime);

        res.json(health);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

const getOperationalMetrics = async (req, res) => {
    try {
        const [dbStats] = await pool.query(
            'SELECT COUNT(*) as tableCount FROM information_schema.tables WHERE table_schema = ?',
            [process.env.DB_NAME]
        );
        const [connectionCount] = await pool.query('SHOW STATUS LIKE "Threads_connected"');
        const [auditCount] = await pool.query('SELECT COUNT(*) as count FROM audit_log');
        const [inventoryStats] = await pool.query('SELECT COUNT(*) as items, SUM(quantity * price) as totalValue FROM inventory_items');
        
        const avgResponseTime = requestCount > 0 ? Math.round(totalResponseTime / requestCount) : 0;
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        const uptimeFormatted = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`;
        
        const metrics = {
            deployment: {
                version: process.env.APP_VERSION || '1.0.0',
                environment: process.env.DEPLOYMENT_ENV || 'local',
                deployedAt: process.env.DEPLOYMENT_DATE || new Date().toISOString().split('T')[0],
                gitCommit: process.env.GIT_COMMIT || 'local-dev',
                deployedBy: process.env.DEPLOYED_BY || 'developer',
                nodeVersion: process.version,
                platform: 'Local Development'
            },
            
            infrastructure: {
                region: 'Local Machine',
                platform: os.platform(),
                hostname: os.hostname(),
                cpuCores: os.cpus().length,
                cpuModel: os.cpus()[0]?.model || 'Unknown',
                totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
                freeMemory: `${Math.round(os.freemem() / 1024 / 1024 / 1024)} GB`,
                memoryUsage: `${Math.round((1 - os.freemem() / os.totalmem()) * 100)}%`,
                containerized: false,
                activeTasks: 1,
                maxTasks: 1
            },
            
            health: {
                status: 'GREEN',
                statusIcon: '✅',
                uptime: uptimeFormatted,
                uptimeSeconds: uptimeSeconds,
                requestsServed: requestCount,
                avgResponseTime: `${avgResponseTime}ms`,
                errorRate: '0.00%',
                lastChecked: new Date().toISOString()
            },
            
            database: {
                status: 'connected',
                statusIcon: '✅',
                type: 'MySQL 8.0',
                host: process.env.DB_HOST,
                name: process.env.DB_NAME,
                activeConnections: parseInt(connectionCount[0]?.Value) || 1,
                maxConnections: 10,
                tablesCount: dbStats[0]?.tableCount || 0,
                totalAuditLogs: auditCount[0]?.count || 0
            },
            
            inventory: {
                totalItems: inventoryStats[0]?.items || 0,
                totalValue: `$${parseFloat(inventoryStats[0]?.totalValue || 0).toFixed(2)}`,
                lastUpdated: new Date().toISOString()
            },
            
            cost: {
                estimatedHourlyCost: '$0.00',
                estimatedDailyCost: '$0.00',
                estimatedMonthlyCost: '$0.00',
                monthToDate: '$0.00',
                budget: '$100.00',
                budgetUsed: '0%',
                environment: 'Local (No AWS Charges)'
            }
        };

        res.json({ success: true, data: metrics });
    } catch (error) {
        console.error('Error fetching operational metrics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const [logs] = await pool.query(
            'SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?',
            [limit]
        );
        res.json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
    }
};

module.exports = { getHealth, getOperationalMetrics, getAuditLogs };