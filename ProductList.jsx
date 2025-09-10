import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  // Handle saving product (add or update)
  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing
        await updateProduct(editingProduct.id, productData);
      } else {
        // Add new
        await addProduct(productData);
      }
      // Refresh list
      const updated = await getProducts();
      setProducts(updated);
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      alert("Error saving product: " + error.message);
    }
  };

  // Handle Edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle Add
  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        const updated = await getProducts();
        setProducts(updated);
      } catch (error) {
        alert("Error deleting product: " + error.message);
      }
    }
  };

  // Handle Add Stock
  const handleAddStock = async (product) => {
    const amount = prompt(`How many units to add for "${product.name}"?`);
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity + parseInt(amount)
      };
      try {
        await updateProduct(product.id, updatedProduct);
        const updated = await getProducts();
        setProducts(updated);
      } catch (error) {
        alert("Error adding stock: " + error.message);
      }
    } else {
      alert("Please enter a valid positive number.");
    }
  };

  // Handle Sell Item (deduct stock)
  const handleSell = async (product) => {
    const amount = prompt(`How many units sold for "${product.name}"?`);
    if (amount && !isNaN(amount) && parseInt(amount) > 0 && parseInt(amount) <= product.quantity) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity - parseInt(amount)
      };
      try {
        await updateProduct(product.id, updatedProduct);
        const updated = await getProducts();
        setProducts(updated);

        // Alert if low stock
        if (updatedProduct.quantity < 10) {
          alert(`⚠️ LOW STOCK: "${product.name}" has only ${updatedProduct.quantity} left!`);
        }
      } catch (error) {
        alert("Error selling item: " + error.message);
      }
    } else {
      alert("Invalid quantity or insufficient stock!");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Management</h2>
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
        Add New Product
      </button>

      {/* Show Form if needed */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Products Table */}
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
            <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', background: '#f8f9fa' }}>
                📦 No products yet. Click "Add New Product" to get started!
              </td>
            </tr>
          ) : (
            products.map(p => (
              <tr
                key={p.id}
                style={{
                  borderBottom: '1px solid #eee',
                  background: p.quantity < 10 ? '#fff3cd' : 'white' // Highlight low stock
                }}
              >
                <td style={{ padding: '12px' }}>{p.name}</td>
                <td style={{ padding: '12px' }}>{p.description}</td>
                <td style={{ padding: '12px' }}>{p.category}</td>
                <td style={{ padding: '12px' }}>${parseFloat(p.price).toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  {p.quantity} {p.quantity < 10 && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>(Low!)</span>}
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleEdit(p)}
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      borderRadius: '4px'
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleAddStock(p)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      borderRadius: '4px'
                    }}
                  >
                    Add Stock
                  </button>
                  <button
                    onClick={() => handleSell(p)}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Sell Item
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

export default ProductList;