import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import App from './App';

describe('App Routing', () => {
  test('renders LoginPage when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // Check for a unique element from the LoginPage, like the "Sign In" heading
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  test('renders DashboardPage when user is authenticated', () => {
    const mockUser = { name: 'Test User', role: 'Team Member' };

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthContext.Provider value={{ user: mockUser, login: () => {}, logout: () => {} }}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check for an element that only appears when logged in, like the Header title or a sidebar item.
    // Let's look for the main header, which should be present for any logged-in user.
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
