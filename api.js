// src/services/api.js

const API_URL = 'http://localhost:3001';

// Get all products
export const getProducts = () => {
  return fetch(`${API_URL}/products`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    });
};

// Add a new product
export const addProduct = (product) => {
  return fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  });
};

// Update a product
export const updateProduct = (id, product) => {
  return fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  });

  
};

// Delete a product
export const deleteProduct = (id) => {
  return fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  }).then(res => {
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  });
};

// ============ CUSTOMER API ============

// Get all customers
export const getCustomers = () => {
  return fetch(`${API_URL}/customers`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    });
};

// Add a new customer
export const addCustomer = (customer) => {
  return fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to add customer');
    return res.json();
  });
};

// Update a customer
export const updateCustomer = (id, customer) => {
  return fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
  });
};

// Delete a customer
export const deleteCustomer = (id) => {
  return fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
  }).then(res => {
    if (!res.ok) throw new Error('Failed to delete customer');
    return res.json();
  });
};

// ============ SALES API ============

// Get all sales
export const getSales = () => {
  return fetch(`${API_URL}/sales`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch sales');
      return res.json();
    });
};

// Add a new sale
export const addSale = (sale) => {
  return fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sale),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to record sale');
    return res.json();
  });
};