import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Activity } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Operations from './pages/Operations';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <Package size={32} />
            <span>CloudOps</span>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/"><LayoutDashboard size={20} /> Dashboard</Link>
            </li>
            <li>
              <Link to="/inventory"><Package size={20} /> Inventory</Link>
            </li>
            <li>
              <Link to="/operations"><Activity size={20} /> Operations</Link>
            </li>
          </ul>
          <div className="nav-footer">
            <p>v1.0.0 • Local Dev</p>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/operations" element={<Operations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;