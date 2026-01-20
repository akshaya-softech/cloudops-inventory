import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { inventoryService } from '../services/api';

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', quantity: 0, price: 0, category: '', sku: ''
  });

  const categories = ['Compute', 'Database', 'Storage', 'Networking', 'Containers', 'Serverless', 'Security', 'Monitoring'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await inventoryService.getAll();
      setItems(response.data.data);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await inventoryService.update(editingItem.id, formData);
      } else {
        await inventoryService.create(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', quantity: 0, price: 0, category: '', sku: '' });
      fetchItems();
    } catch (err) {
      alert('Error saving item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await inventoryService.delete(id);
        fetchItems();
      } catch (err) {
        alert('Error deleting item');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="loading">Loading inventory...</div>;

  return (
    <div className="inventory">
      <div className="page-header">
        <h1>Cloud Resources Inventory</h1>
        <p>Manage your cloud infrastructure resources</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', quantity: 0, price: 0, category: '', sku: '' }); setShowModal(true); }}>
            <Plus size={18} /> Add Resource
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Monthly Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    {item.description && <div style={{ fontSize: '12px', color: '#64748b' }}>{item.description}</div>}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{item.sku}</td>
                  <td>
                    <span className={`category-badge ${item.category?.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ color: item.quantity < 5 ? '#f87171' : '#e2e8f0' }}>
                    {item.quantity} {item.quantity < 5 && '⚠️'}
                  </td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(item)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '16px', color: '#64748b', fontSize: '14px' }}>
          Showing {filteredItems.length} of {items.length} resources
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit Resource' : 'Add New Resource'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Resource Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} required min="0" />
                </div>
                <div className="form-group">
                  <label>Monthly Cost ($) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required min="0" step="0.01" />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g., AWS-EC2-T3MICRO" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;