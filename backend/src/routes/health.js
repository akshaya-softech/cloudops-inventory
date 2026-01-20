const express = require('express');
const router = express.Router();
const {
    getHealth,
    getOperationalMetrics,
    getAuditLogs
} = require('../controllers/healthController');

router.get('/', getHealth);
router.get('/metrics', getOperationalMetrics);
router.get('/audit', getAuditLogs);

module.exports = router;