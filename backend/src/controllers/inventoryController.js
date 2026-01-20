const { pool } = require('../config/database');

const getAllItems = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventory_items ORDER BY category, name');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch inventory items' });
    }
};

const getItemById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventory_items WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch item' });
    }
};

const createItem = async (req, res) => {
    try {
        const { name, description, quantity, price, category, sku } = req.body;
        
        if (!name || quantity === undefined || price === undefined) {
            return res.status(400).json({ success: false, error: 'Name, quantity, and price are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO inventory_items (name, description, quantity, price, category, sku) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description || null, quantity, price, category || null, sku || null]
        );

        await pool.query(
            'INSERT INTO audit_log (action, table_name, record_id, details) VALUES (?, ?, ?, ?)',
            ['CREATE', 'inventory_items', result.insertId, JSON.stringify({ name, quantity, price })]
        );

        const [newItem] = await pool.query('SELECT * FROM inventory_items WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: newItem[0] });
    } catch (error) {
        console.error('Error creating item:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, error: 'SKU already exists' });
        }
        res.status(500).json({ success: false, error: 'Failed to create item' });
    }
};

const updateItem = async (req, res) => {
    try {
        const { name, description, quantity, price, category, sku } = req.body;
        const itemId = req.params.id;

        const [existing] = await pool.query('SELECT * FROM inventory_items WHERE id = ?', [itemId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        await pool.query(
            'UPDATE inventory_items SET name = ?, description = ?, quantity = ?, price = ?, category = ?, sku = ? WHERE id = ?',
            [name, description, quantity, price, category, sku, itemId]
        );

        await pool.query(
            'INSERT INTO audit_log (action, table_name, record_id, details) VALUES (?, ?, ?, ?)',
            ['UPDATE', 'inventory_items', itemId, JSON.stringify({ name, quantity, price })]
        );

        const [updatedItem] = await pool.query('SELECT * FROM inventory_items WHERE id = ?', [itemId]);
        res.json({ success: true, data: updatedItem[0] });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
};

const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        const [existing] = await pool.query('SELECT * FROM inventory_items WHERE id = ?', [itemId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        await pool.query('DELETE FROM inventory_items WHERE id = ?', [itemId]);

        await pool.query(
            'INSERT INTO audit_log (action, table_name, record_id, details) VALUES (?, ?, ?, ?)',
            ['DELETE', 'inventory_items', itemId, JSON.stringify({ deleted: existing[0].name })]
        );

        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
};

const getStats = async (req, res) => {
    try {
        const [totalItems] = await pool.query('SELECT COUNT(*) as count FROM inventory_items');
        const [totalValue] = await pool.query('SELECT SUM(quantity * price) as value FROM inventory_items');
        const [categories] = await pool.query('SELECT COUNT(DISTINCT category) as count FROM inventory_items');
        const [lowStock] = await pool.query('SELECT COUNT(*) as count FROM inventory_items WHERE quantity < 5');
        const [byCategory] = await pool.query(
            'SELECT category, COUNT(*) as count, SUM(quantity * price) as value FROM inventory_items GROUP BY category ORDER BY value DESC'
        );

        res.json({
            success: true,
            data: {
                totalItems: totalItems[0].count,
                totalValue: parseFloat(totalValue[0].value) || 0,
                categories: categories[0].count,
                lowStockItems: lowStock[0].count,
                byCategory: byCategory
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem, getStats };