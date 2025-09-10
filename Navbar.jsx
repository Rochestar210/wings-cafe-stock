import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ 
      padding: '1rem', 
      background: '#007bff', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <h2>Wings Cafe</h2>
      <div>
        <Link to="/" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/products" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Inventory</Link>
        <Link to="/sales" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Sales</Link>
        <Link to="/customers" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Customers</Link>
        <Link to="/reports" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Reporting</Link>
      </div>
    </nav>
  );
};

export default Navbar;