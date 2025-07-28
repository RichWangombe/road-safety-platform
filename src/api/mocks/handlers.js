import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:3001/api/v1/stakeholders', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'John Doe', engagement: 5 },
        { id: 2, name: 'Jane Smith', engagement: 3 },
      ])
    );
  }),
];
