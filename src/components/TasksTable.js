import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { tasksData as initialTasksData } from "../data/mockData";
import TaskForm from "./TaskForm";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, MoreVert, Edit, Delete } from "@mui/icons-material";
import { getStatusColor } from "../pages/ProgramsPage";

const TasksTable = ({ activityId }) => {
  const { user } = useAuth();
  const canManageTasks =
    user?.role === "Program Manager" || user?.role === "Team Lead";
  const [tasks, setTasks] = useState(initialTasksData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.activityId.toString() === activityId),
    [tasks, activityId],
  );

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleFormSave = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === taskData.id ? taskData : t)));
    } else {
      const newTask = {
        ...taskData,
        id: Date.now(),
        activityId: parseInt(activityId),
      };
      setTasks([...tasks, newTask]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
    setIsConfirmOpen(false);
    setTaskToDelete(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Tasks</Typography>
        {canManageTasks && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
          >
            New Task
          </Button>
        )}
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const statusColors = getStatusColor(task.status);
                return (
                  <TableRow key={task.id} hover>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, task)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tasks found for this activity.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {canManageTasks && [
          <MenuItem
            key="edit"
            onClick={() => {
              setEditingTask(selectedTask);
              setIsFormOpen(true);
              handleMenuClose();
            }}
          >
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit Task
          </MenuItem>,
          <MenuItem
            key="delete"
            onClick={() => {
              setTaskToDelete(selectedTask);
              setIsConfirmOpen(true);
              handleMenuClose();
            }}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete Task
          </MenuItem>,
        ]}
      </Menu>

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        task={editingTask}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete the task \"${taskToDelete?.name}\"?`}
      />
    </Paper>
  );
};

export default TasksTable;
