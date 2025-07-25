import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../context/AuthContext';
import ntsaTheme from '../theme/ntsaTheme';
import DashboardPage from './DashboardPage';

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={ntsaTheme}>
        <AuthProvider {...providerProps}>{ui}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>,
    renderOptions
  );
};

describe('DashboardPage', () => {
  it('renders the main dashboard heading', () => {
    const providerProps = {
      value: { user: { role: 'Program Manager' } },
    };
    renderWithProviders(<DashboardPage />, { providerProps });
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('renders all the main sections', () => {
    const providerProps = {
        value: { user: { role: 'Program Manager' } },
      };
    renderWithProviders(<DashboardPage />, { providerProps });

    // Check for Stat Cards (summary cards)
    expect(screen.getByText(/Total Programs/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Completion/i)).toBeInTheDocument();

    // Check for other sections
    expect(screen.getByText(/Program Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Activities/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Tasks/i)).toBeInTheDocument();
  });
});
