// src/components/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers:", error);
      }
    };
    loadCustomers();
  }, []);

  // Handle saving customer (add or update)
  const handleSave = async (customerData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, customerData);
      } else {
        await addCustomer(customerData);
      }
      const updated = await getCustomers();
      setCustomers(updated);
      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      alert("Error saving customer: " + error.message);
    }
  };

  // Handle Edit
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  // Handle Add
  const handleAdd = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        const updated = await getCustomers();
        setCustomers(updated);
      } catch (error) {
        alert("Error deleting customer: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Management</h2>
      <button
        onClick={handleAdd}
        style={{
          background: '#28a745',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
          marginBottom: '20px',
          borderRadius: '5px'
        }}
      >
        ➕ Add New Customer
      </button>

      {/* Show Form if needed */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Customers Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <thead>
          <tr style={{ background: '#007bff', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', background: '#f8f9fa' }}>
                👥 No customers yet. Add one!
              </td>
            </tr>
          ) : (
            customers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{c.name}</td>
                <td style={{ padding: '12px' }}>{c.email}</td>
                <td style={{ padding: '12px' }}>{c.phone}</td>
                <td style={{ padding: '12px' }}>{c.address}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleEdit(c)}
                    style={{
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      borderRadius: '4px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Customer Form Component (inside same file for simplicity)
const CustomerForm = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      background: '#f9f9f9',
      padding: '20px',
      margin: '20px 0',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h3>{customer ? '✏️ Edit Customer' : '➕ Add New Customer'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Full Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Phone:</label><br />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Address:</label><br />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <button
            type="submit"
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            💾 Save Customer
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerList;