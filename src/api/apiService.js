export const fetchStakeholders = async (token) => {
  const response = await fetch('/api/v1/stakeholders', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Network request failed');
  }
  
  return response.json();
};
