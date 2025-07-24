import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';

describe('Header Component', () => {
  const mockUser = { name: 'Test User' };

  const renderHeader = (user, onSearchChange = () => {}) => {
    return render(
      <AuthContext.Provider value={{ user, logout: () => {} }}>
        <MemoryRouter>
          <Header onSearchChange={onSearchChange} />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('renders the header with the default title', () => {
    renderHeader(mockUser);
    expect(screen.getByText(/Road Safety Management/i)).toBeInTheDocument();
  });

  test('renders the title for the current page', () => {
    // Mock the current route to be the dashboard
    render(
      <AuthContext.Provider value={{ user: mockUser, logout: () => {} }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders the search bar', () => {
    renderHeader(mockUser);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('opens user menu when clicked', async () => {
    renderHeader(mockUser);
    const userButton = screen.getByLabelText('account of current user');
    await userEvent.click(userButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls logout when logout menu item is clicked', async () => {
    const mockLogout = jest.fn();
    render(
      <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    const userButton = screen.getByLabelText('account of current user');
    await userEvent.click(userButton);
    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

});
