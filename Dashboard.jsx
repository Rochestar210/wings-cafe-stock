import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1> Dashboard</h1>
      <p>Welcome to Wings Cafe Stock Inventory System</p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        {['Sales', 'Inventory', 'Customer', 'Reporting'].map(module => (
          <div key={module} style={{
            padding: '20px',
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <h3>📦 {module}</h3>
            <p>Manage {module.toLowerCase()} data and operations</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;