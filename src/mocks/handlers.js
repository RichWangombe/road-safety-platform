import { rest } from 'msw';

// Corresponds to the real API data structure
const mockStakeholders = [
  { id: 1, name: 'API John Doe', type: 'government', contact_person: 'John Doe', email: 'john.d@gov.com', phone: '111-111-1111', engagement_level: 'High', last_interaction_date: '2025-07-20' },
  { id: 2, name: 'API Jane Smith', type: 'ngo', contact_person: 'Jane Smith', email: 'jane.s@ngo.org', phone: '222-222-2222', engagement_level: 'Medium', last_interaction_date: '2025-07-21' },
  // Add more mock stakeholders if needed to test pagination, etc.
];

export const handlers = [
  // Handles a GET /api/v1/stakeholders request
  rest.get('/api/v1/stakeholders', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockStakeholders)
    );
  }),
];
