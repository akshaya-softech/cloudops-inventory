const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const inventoryRoutes = require('./routes/inventory');
const healthRoutes = require('./routes/health');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'CloudOps Inventory Platform API',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.DEPLOYMENT_ENV || 'development',
        description: 'Cloud Resources Inventory Management System',
        endpoints: {
            inventory: '/api/inventory',
            inventoryStats: '/api/inventory/stats',
            health: '/api/health',
            metrics: '/api/health/metrics',
            auditLogs: '/api/health/audit'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const startServer = async () => {
    const dbConnected = await testConnection();
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════╗
║       CloudOps Inventory Platform API                  ║
╠════════════════════════════════════════════════════════╣
║  🚀 Server:      http://localhost:${PORT}                 ║
║  📊 Environment: ${(process.env.DEPLOYMENT_ENV || 'development').padEnd(35)}║
║  🗄️  Database:    ${dbConnected ? 'Connected ✅'.padEnd(35) : 'Disconnected ❌'.padEnd(35)}║
║  📦 Version:     ${(process.env.APP_VERSION || '1.0.0').padEnd(35)}║
╚════════════════════════════════════════════════════════╝
        `);
    });
};

startServer();