import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StakeholdersPage from './StakeholdersPage';

// Mock the data used by the component
jest.mock('../data/mockData', () => ({
  stakeholdersData: [
    { id: 1, name: 'John Doe', organization: 'Ministry of Transport', role: 'Director', engagementLevel: 'High' },
    { id: 2, name: 'Jane Smith', organization: 'National Police', role: 'Chief Inspector', engagementLevel: 'Medium' },
    { id: 3, name: 'Peter Jones', organization: 'City Hospital', role: 'Surgeon', engagementLevel: 'Low' },
    { id: 4, name: 'Emily White', organization: 'EduCorp', role: 'Consultant', engagementLevel: 'High' },
    { id: 5, name: 'Michael Brown', organization: 'HealthFirst', role: 'Manager', engagementLevel: 'Medium' },
    { id: 6, name: 'Sarah Green', organization: 'Community Org', role: 'Volunteer', engagementLevel: 'High' },
    { id: 7, name: 'David Black', organization: 'City Council', role: 'Clerk', engagementLevel: 'Low' },
    { id: 8, name: 'Laura Blue', organization: 'State University', role: 'Professor', engagementLevel: 'Medium' },
    { id: 9, name: 'Chris Yellow', organization: 'Tech Innovations', role: 'Developer', engagementLevel: 'High' },
    { id: 10, name: 'Amanda Purple', organization: 'Global Solutions', role: 'CEO', engagementLevel: 'High' },
  ],
}));

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <StakeholdersPage />
    </MemoryRouter>
  );
};

describe('StakeholdersPage', () => {
  test('renders the main title and key elements', () => {
    renderComponent();
    
    // Check for the main title
    expect(screen.getByText('Stakeholders')).toBeInTheDocument();

    // Check for the "Add New Stakeholder" button
    expect(screen.getByRole('button', { name: /Add New Stakeholder/i })).toBeInTheDocument();

    // Check for summary cards
    expect(screen.getByText(/Total Stakeholders/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Engagement/i)).toBeInTheDocument();
  });

  test('displays stakeholder data in the table', () => {
    renderComponent();

    // Check if the mock data is rendered
    expect(screen.getByText('Amanda Purple')).toBeInTheDocument(); // This user is on the first page
    expect(screen.getByText('Chief Inspector')).toBeInTheDocument(); // Check for role instead of email
    expect(screen.getByText('Global Solutions')).toBeInTheDocument();
  });

  test('opens and closes the action menu', async () => {
    renderComponent();

    // Find the action menu button for the first stakeholder
    const user = userEvent.setup();

    // Find the action menu button for the first stakeholder
    const menuButton = await screen.findByTestId('action-menu-button-10'); // Amanda Purple has id 10
    await user.click(menuButton);

    // Check that the menu items are visible
    const viewDetailsMenuItem = await screen.findByText('View Details');
    expect(viewDetailsMenuItem).toBeInTheDocument();
    expect(screen.getByText('Log Interaction')).toBeInTheDocument();
    expect(screen.getByText('Remove Stakeholder')).toBeInTheDocument();

    // Click the "View Details" menu item
    await user.click(viewDetailsMenuItem);

    // Check that the menu is closed
    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  test('displays the correct engagement level chip for a stakeholder', () => {
    renderComponent();

    // Find the row for a specific stakeholder
    const stakeholderRow = screen.getByText('Amanda Purple').closest('tr');

    // Find the chip within that row and check its text
    const engagementChip = stakeholderRow.querySelector('.MuiChip-label');
    expect(engagementChip).toHaveTextContent('High');

    // Optional: Check for the correct color class
    const chipRoot = stakeholderRow.querySelector('.MuiChip-root');
    expect(chipRoot).toHaveClass('MuiChip-colorSuccess'); // Assuming 'High' maps to green (success)
  });

  test('filters stakeholders based on search query', async () => {
    renderComponent();

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/Search Stakeholders.../i);
    
    // Simulate user typing 'Police' into the search box
    await user.type(searchInput, 'Police');

    // After searching, only Jane Smith should be visible
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Peter Jones')).not.toBeInTheDocument();
  });

  test('sorts stakeholders by name when header is clicked', async () => {
    renderComponent();

    const user = userEvent.setup();
    const nameHeader = screen.getByText('Stakeholder');

    // The component initializes with ascending sort, so the first click will sort descending.
    await user.click(nameHeader);

    let rows = screen.getAllByRole('row');
    // The first row is the header, so we check from the second row.
    // Order should be: Sarah Green, Peter Jones, Michael Brown
    expect(rows[1]).toHaveTextContent('Sarah Green');
    expect(rows[2]).toHaveTextContent('Peter Jones');
    expect(rows[3]).toHaveTextContent('Michael Brown');

    // Second click: sort ascending
    await user.click(nameHeader);

    rows = screen.getAllByRole('row');
    // Order should be: Amanda Purple, Chris Yellow, David Black
    expect(rows[1]).toHaveTextContent('Amanda Purple');
    expect(rows[2]).toHaveTextContent('Chris Yellow');
    expect(rows[3]).toHaveTextContent('David Black');
  });

  test('handles pagination correctly', async () => {
    renderComponent();

    // Initially, we should see the first 5 stakeholders, sorted by name
    expect(screen.getByText('Amanda Purple')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument(); // John Doe is on page 2

    const user = userEvent.setup();
    // Click the 'Next Page' button
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await user.click(nextPageButton);

    // Now we should see the next 5 stakeholders
    expect(screen.queryByText('Amanda Purple')).not.toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sarah Green')).toBeInTheDocument();
  });

  test('displays correct counts in summary cards', () => {
    renderComponent();

    // Check the Total Stakeholders count
    const totalStakeholdersCard = screen.getByText(/Total Stakeholders/i).closest('.MuiCard-root');
    expect(totalStakeholdersCard).toHaveTextContent('10');

    // Check the High-Engagement count
    const highEngagementCard = screen.getByText(/High-Engagement/i).closest('.MuiCard-root');
    expect(highEngagementCard).toHaveTextContent('5');
  });
});
