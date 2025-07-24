import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../context/AuthContext';
import ntsaTheme from '../theme/ntsaTheme';
import ResourceCentrePage from './ResourceCentrePage';

// Mock the data used by the component
jest.mock('../data/mockData', () => ({
  ...jest.requireActual('../data/mockData'),
  resourcesData: [
    { id: 1, title: 'Road Safety Manual', description: 'A comprehensive guide to road safety.', category: 'Official Documents', type: 'PDF' },
    { id: 2, title: 'Driver Training Video', description: 'A video for new drivers.', category: 'Training Materials', type: 'Video' },
    { id: 3, title: 'Accident Report Form', description: 'Form for reporting accidents.', category: 'Forms & Templates', type: 'DOC' },
  ],
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={ntsaTheme}>
        <AuthProvider value={{ user: { role: 'Program Manager' } }}>{ui}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ResourceCentrePage', () => {
  it('renders the main heading and controls', () => {
    renderWithProviders(<ResourceCentrePage />);
    expect(screen.getByText('Resource Centre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Resources...')).toBeInTheDocument();
    expect(screen.getByText('Upload New Resource')).toBeInTheDocument();
  });

  it('renders initial resources', () => {
    renderWithProviders(<ResourceCentrePage />);
    expect(screen.getByText('Road Safety Manual')).toBeInTheDocument();
    expect(screen.getByText('Driver Training Video')).toBeInTheDocument();
    expect(screen.getByText('Accident Report Form')).toBeInTheDocument();
  });

  it('filters resources by category', () => {
    renderWithProviders(<ResourceCentrePage />);
    fireEvent.click(screen.getByText('Training Materials'));
    expect(screen.queryByText('Road Safety Manual')).not.toBeInTheDocument();
    expect(screen.getByText('Driver Training Video')).toBeInTheDocument();
  });

  it('filters resources by search query', () => {
    renderWithProviders(<ResourceCentrePage />);
    const searchInput = screen.getByPlaceholderText('Search Resources...');
    fireEvent.change(searchInput, { target: { value: 'accident' } });
    expect(screen.queryByText('Road Safety Manual')).not.toBeInTheDocument();
    expect(screen.getByText('Accident Report Form')).toBeInTheDocument();
  });

  it('shows a message when no resources are found', () => {
    renderWithProviders(<ResourceCentrePage />);
    const searchInput = screen.getByPlaceholderText('Search Resources...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.getByText('No resources found')).toBeInTheDocument();
  });
});
