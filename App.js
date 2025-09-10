// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import Sales from './components/Sales';
import CustomerList from './components/CustomerList';
import Reports from './components/Reports';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/products" element={<ProductList />} />
  <Route path="/sales" element={<Sales />} />
  <Route path="/customers" element={<CustomerList />} />
  <Route path="/reports" element={<Reports />} /> {/* ✅ Add this */}
</Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;