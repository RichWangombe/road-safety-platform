jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { token: 'mock-token' } }),
}));

import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import ntsaTheme from '../theme/ntsaTheme';
import StakeholdersPage from './StakeholdersPage';
import { fetchStakeholders } from '../api/apiService';

jest.mock('../api/apiService', () => ({
  fetchStakeholders: jest.fn(),
}));

beforeEach(() => {
  fetchStakeholders.mockResolvedValue([
    { id: 1, name: 'API John Doe', type: 'government', contact_person: 'John Doe', engagement_level: 'High' },
    { id: 2, name: 'API Jane Smith', type: 'ngo', contact_person: 'Jane Smith', engagement_level: 'Medium' }
  ]);
});

afterEach(() => {
  jest.resetAllMocks();
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={ntsaTheme}>
        <StakeholdersPage />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('StakeholdersPage', () => {
  it('renders without crashing', async () => {
    renderComponent();
    await screen.findByText('Stakeholders');
    expect(screen.getByText('Add New Stakeholder')).toBeInTheDocument();
  });

  it('displays stakeholder data', async () => {
    renderComponent();
    await screen.findByText('API John Doe');
    expect(screen.getByText('API Jane Smith')).toBeInTheDocument();
  });

  it('filters stakeholders by search', async () => {
    renderComponent();
    await screen.findByText('API John Doe');
  
    const searchInput = screen.getByPlaceholderText('Search Stakeholders...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
  
    await waitFor(() => {
      expect(screen.getByText('API John Doe')).toBeInTheDocument();
      expect(screen.queryByText('API Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the action menu for a stakeholder from the API', async () => {
    renderComponent();

    // Find the action menu button for the first stakeholder
    const user = userEvent.setup();

    // Find the action menu button for the first stakeholder
        const menuButton = await screen.findByTestId('action-menu-button-1'); // API John Doe has id 1
    await user.click(menuButton);

    // Check that the menu items are visible
    const viewDetailsMenuItem = await screen.findByText('View Details');
    expect(viewDetailsMenuItem).toBeInTheDocument();
    expect(screen.getByText('Log Interaction')).toBeInTheDocument();
    expect(screen.getByText('Remove Stakeholder')).toBeInTheDocument();

    // Click the "View Details" menu item
    await user.click(viewDetailsMenuItem);

    // Check that the menu is closed
    await waitFor(() => {
      expect(screen.queryByText('View Details')).not.toBeInTheDocument();
    });
  });

  it('displays the correct engagement level chip for a stakeholder from the API', async () => {
    renderComponent();
  
    await waitFor(() => {
      expect(screen.getByText('API John Doe')).toBeInTheDocument();
    });
  
    const stakeholderRow = screen.getByText('API John Doe').closest('tr');
    const chipLabel = within(stakeholderRow).getByText('High');
    const chipRoot = chipLabel.closest('.MuiChip-root');
  
    expect(chipRoot).toHaveClass('MuiChip-colorSuccess');
  });

  it.skip('sorts stakeholders from the API by name when header is clicked', () => {
    // This test is skipped
  });

  it('handles pagination correctly with API data', async () => {
    renderComponent();

    // This test would need more mock data to be effective.
    // For now, we'll just confirm the initial state.
    await waitFor(() => {
      expect(screen.getByText('API John Doe')).toBeInTheDocument();
      expect(screen.getByText('API Jane Smith')).toBeInTheDocument();
    });
  });

  it('displays correct counts in summary cards from API data', async () => {
    renderComponent();

    // Check the Total Stakeholders count
    await waitFor(async () => {
      const totalStakeholdersCard = (await screen.findByText(/Total Stakeholders/i)).closest('.MuiCard-root');
      expect(totalStakeholdersCard).toHaveTextContent('2'); // Based on our 2 mock stakeholders
    });

    // Check the High-Engagement count
    await waitFor(async () => {
      const highEngagementCard = (await screen.findByText(/High-Engagement/i)).closest('.MuiCard-root');
      expect(highEngagementCard).toHaveTextContent('1'); // John Doe is High-Engagement
    });
  });
});
