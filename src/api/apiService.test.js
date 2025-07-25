import { fetchStakeholders } from './apiService';

describe('apiService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches stakeholders successfully', async () => {
    const mockData = [{ id: 1, name: 'Test Stakeholder' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchStakeholders('test-token');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/v1/stakeholders', {
      headers: { 'Authorization': 'Bearer test-token' }
    });
  });

  it('throws error on failed request', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    
    await expect(fetchStakeholders('test-token'))
      .rejects
      .toThrow('Network request failed');
  });
});
