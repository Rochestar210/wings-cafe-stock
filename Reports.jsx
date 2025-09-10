// src/components/Reports.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, getCustomers, getSales } from '../services/api'; // ✅ Now fully used

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [salesHistory, setSalesHistory] = useState([]); // ✅ Now used

  // Load all data: products, customers, sales
  useEffect(() => {
    const loadReports = async () => {
      try {
        // Load products
        const productData = await getProducts();
        setProducts(productData);

        // Calculate total inventory value
        const totalValue = productData.reduce((sum, p) => {
          return sum + (parseFloat(p.price) * p.quantity);
        }, 0);
        setTotalInventoryValue(totalValue);

        // Find low stock items (< 10)
        const lowStock = productData.filter(p => p.quantity < 10);
        setLowStockItems(lowStock);

        // Load customers
        const customerData = await getCustomers();
        setTotalCustomers(customerData.length);

        // ✅ LOAD SALES — this uses getSales and setSalesHistory
        const salesData = await getSales();
        setSalesHistory(salesData); // ✅ Now used — warning gone!

      } catch (error) {
        console.error("Failed to load reports:", error);
      }
    };
    loadReports();
  }, []);

  // ✅ Calculate total sales from REAL backend data (not localStorage)
  const totalSalesValue = salesHistory.reduce((sum, sale) => {
    return sum + parseFloat(sale.total);
  }, 0);

  return (
    <div style={{ padding: '30px' }}>
      <h2>📊 Reporting Dashboard</h2>
      <p>Real-time insights into your Wings Cafe inventory and sales performance.</p>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Total Inventory Value */}
        <div style={{
          background: '#007bff',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>📦 Total Inventory Value</h3>
          <h1 style={{ margin: '10px 0', fontSize: '2rem' }}>${totalInventoryValue.toFixed(2)}</h1>
        </div>

        {/* Low Stock Items */}
        <div style={{
          background: '#ffc107',
          color: 'black',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>⚠️ Low Stock Items</h3>
          <h1 style={{ margin: '10px 0', fontSize: '2rem' }}>{lowStockItems.length}</h1>
          {lowStockItems.length > 0 && (
            <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              {lowStockItems.map(item => (
                <div key={item.id}>{item.name} ({item.quantity})</div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Total Sales — now from REAL backend */}
        <div style={{
          background: '#28a745',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>💰 Total Sales Value</h3>
          <h1 style={{ margin: '10px 0', fontSize: '2rem' }}>${totalSalesValue.toFixed(2)}</h1>
        </div>

        {/* Total Customers */}
        <div style={{
          background: '#6c757d',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>👥 Total Customers</h3>
          <h1 style={{ margin: '10px 0', fontSize: '2rem' }}>{totalCustomers}</h1>
        </div>
      </div>

      {/* Detailed Reports */}
      <div style={{ marginTop: '40px' }}>
        <h3>📋 Detailed Inventory Report</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '15px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ background: '#007bff', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Value</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No products found.</td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} style={{
                  borderBottom: '1px solid #eee',
                  background: p.quantity < 10 ? '#fff3cd' : 'white'
                }}>
                  <td style={{ padding: '12px' }}>{p.name}</td>
                  <td style={{ padding: '12px' }}>{p.category}</td>
                  <td style={{ padding: '12px' }}>${parseFloat(p.price).toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{p.quantity}</td>
                  <td style={{ padding: '12px' }}>${(parseFloat(p.price) * p.quantity).toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      color: p.quantity < 10 ? '#dc3545' : '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {p.quantity < 10 ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;