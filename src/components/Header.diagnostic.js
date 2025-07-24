import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';

// Create a temporary div to render into
const div = document.createElement('div');
div.id = 'diagnostic-root';
document.body.appendChild(div);

// Create root
const root = ReactDOM.createRoot(div);

// Render the Header component with mock context
const mockUser = { name: 'Test User' };
root.render(
  <AuthContext.Provider value={{ user: mockUser, logout: () => {} }}>
    <Header />
  </AuthContext.Provider>
);

console.log('Header component rendered successfully!');
