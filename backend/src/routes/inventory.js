const express = require('express');
const router = express.Router();
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getStats
} = require('../controllers/inventoryController');

router.get('/', getAllItems);
router.get('/stats', getStats);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;