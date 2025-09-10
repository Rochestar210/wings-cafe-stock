// src/components/Sales.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct, getSales, addSale } from '../services/api';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, salesData] = await Promise.all([
          getProducts(),
          getSales()
        ]);
        setProducts(productData);
        setSalesHistory(salesData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  const totalCost = selectedProduct ? (selectedProduct.price * quantity).toFixed(2) : '0.00';

  useEffect(() => {
    if (amountPaid && !isNaN(amountPaid)) {
      const changeValue = parseFloat(amountPaid) - parseFloat(totalCost);
      setChange(changeValue >= 0 ? changeValue.toFixed(2) : 0.00);
    } else {
      setChange(0.00);
    }
  }, [amountPaid, totalCost]);

  const handleSell = async () => {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (qty > selectedProduct.quantity) {
      alert(`Insufficient stock! Only ${selectedProduct.quantity} available.`);
      return;
    }

    const cashReceived = parseFloat(amountPaid);
    if (isNaN(cashReceived) || cashReceived < parseFloat(totalCost)) {
      alert(`Please enter at least M${totalCost} to complete this sale.`);
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      quantity: selectedProduct.quantity - qty
    };

    try {
      await updateProduct(selectedProduct.id, updatedProduct);

      const saleRecord = {
        productName: selectedProduct.name,
        productId: selectedProduct.id,
        quantity: qty,
        price: selectedProduct.price,
        total: totalCost,
        amountPaid: cashReceived,
        change: parseFloat(change),
        date: new Date().toISOString()
      };

      const savedSale = await addSale(saleRecord);
      setSalesHistory(prev => [savedSale, ...prev]);

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      setSelectedProduct(null);
      setQuantity(1);
      setAmountPaid('');
      setChange(0);

      alert(`✅ Sale completed!\n${qty} x ${selectedProduct.name}\nTotal: M${totalCost}\nPaid: M${cashReceived}\nChange: M${change}`);
    } catch (error) {
      alert("Error recording sale: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>💰 Sales Module</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
      }}>
        <h3>🛒 Record a Sale</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Select Product:</label><br />
          <select
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const productId = e.target.value;
              const product = products.find(p => p.id === productId);
              setSelectedProduct(product || null);
              setAmountPaid('');
              setChange(0);
            }}
            style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '1rem' }}
          >
            <option value="">-- Select a product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - M{p.price} (Stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Quantity:</label><br />
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '1rem' }}
          />
        </div>

        {selectedProduct && (
          <div style={{ 
            marginBottom: '15px', 
            padding: '12px', 
            background: '#e3f2fd', 
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            💰 Total Cost: M{totalCost}
          </div>
        )}

        {selectedProduct && (
          <div style={{ marginBottom: '15px' }}>
            <label>💵 Amount Paid (M):</label><br />
            <input
              type="number"
              step="0.01"
              min="0"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="Enter cash received"
              style={{ 
                width: '100%', 
                padding: '10px', 
                marginTop: '5px', 
                fontSize: '1rem',
                border: '2px solid #007bff'
              }}
            />
          </div>
        )}

        {amountPaid && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '12px', 
            background: change >= 0 ? '#e8f5e8' : '#ffebee',
            color: change >= 0 ? '#2e7d32' : '#c62828',
            borderRadius: '6px',
            fontWeight: 'bold',
            border: `2px solid ${change >= 0 ? '#4caf50' : '#f44336'}`
          }}>
            🧮 Change: M{change}
            {change < 0 && " (Insufficient funds)"}
          </div>
        )}

        <button
          onClick={handleSell}
          disabled={!selectedProduct || change < 0}
          style={{
            background: selectedProduct && change >= 0 ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '1.1rem',
            cursor: selectedProduct && change >= 0 ? 'pointer' : 'not-allowed',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          💰 Complete Sale
        </button>
      </div>

      <div>
        <h3>📜 Sales History</h3>
        {salesHistory.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#007bff', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total (M)</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Paid (M)</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Change (M)</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{sale.productName}</td>
                  <td style={{ padding: '12px' }}>{sale.quantity}</td>
                  <td style={{ padding: '12px' }}>M{parseFloat(sale.total).toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>M{parseFloat(sale.amountPaid).toFixed(2)}</td>
                  <td style={{ padding: '12px', color: sale.change >= 0 ? '#28a745' : '#dc3545' }}>
                    M{parseFloat(sale.change).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(sale.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Sales;