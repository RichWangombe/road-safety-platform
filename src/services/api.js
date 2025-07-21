// Placeholder API service for future backend integration
const API_BASE = process.env.REACT_APP_API_BASE || '';

export const getColumns = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE}/columns`);
  // return response.json();
  return [];
};

export const createTask = async (columnId, task) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE}/columns/${columnId}/tasks`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(task)
  // });
  // return response.json();
  return task;
};

// More service methods (updateTask, deleteTask) can be added here
