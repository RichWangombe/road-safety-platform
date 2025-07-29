// Kanban board service wrapping apiService. Provides column/task CRUD helpers.
import apiService from "../api/apiService";

export const getColumns = async () => {
  const response = await apiService.get("/v1/kanban/columns");
  return response.data;
};

export const createTask = async (columnId, task) => {
  const response = await apiService.post(
    `/v1/kanban/columns/${columnId}/tasks`,
    task,
  );
  return response.data;
};

// More service methods (updateTask, deleteTask) can be added here
