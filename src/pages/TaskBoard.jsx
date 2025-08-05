import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import apiService from "../api/apiService";
import useCan from "../hooks/useCan";

// Utility to group tasks into columns keyed by status_id
const groupByStatus = (tasks) => {
  const columns = {};
  tasks.forEach((task) => {
    const status = task.status; // loaded by backend relation
    if (!columns[status.id]) {
      columns[status.id] = {
        id: status.id,
        name: status.name,
        position: status.position,
        tasks: [],
      };
    }
    columns[status.id].tasks.push(task);
  });

  // Sort tasks within each column by position
  Object.values(columns).forEach((col) => {
    col.tasks.sort((a, b) => a.position - b.position);
  });

  // Return array sorted by column position
  return Object.values(columns).sort((a, b) => a.position - b.position);
};

export default function TaskBoard() {
  // Allow ?activity_id=123 or default demo id
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get("activity_id") || 1;

  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const canMove = useCan('move');
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiService.get("/v1/tasks", {
        params: { activity_id: activityId },
      });
      setColumns(groupByStatus(data));
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDragEnd = async (result) => {
    if (!canMove) return; // no permission to move
    const { destination, source, draggableId } = result;
    if (!destination) return; // dropped outside

    // No change in position/column
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceColIndex = columns.findIndex(
      (c) => c.id.toString() === source.droppableId,
    );
    const destColIndex = columns.findIndex(
      (c) => c.id.toString() === destination.droppableId,
    );

    const sourceCol = { ...columns[sourceColIndex] };
    const destCol = { ...columns[destColIndex] };

    // Remove task from source
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    // Insert into dest
    destCol.tasks.splice(destination.index, 0, movedTask);

    // Update task props locally to match new position/column
    movedTask.status_id = parseInt(destCol.id, 10);
    movedTask.position = destination.index;

    const newColumns = [...columns];
    newColumns[sourceColIndex] = sourceCol;
    newColumns[destColIndex] = destCol;
    setColumns(newColumns);

    // Persist to backend
    try {
      await apiService.post(`/v1/tasks/${draggableId}/move`, {
        status_id: destCol.id,
        position: destination.index,
      });
    } catch (err) {
      console.error("Failed to move task:", err);
      // Reload state to keep consistency
      loadTasks();
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map((column) => (
          <Droppable droppableId={column.id.toString()} key={column.id}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  minWidth: 300,
                  bgcolor: snapshot.isDraggingOver ? "grey.100" : "grey.50",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {column.name}
                </Typography>

                {column.tasks.map((task, idx) => (
                  <Draggable
                    draggableId={task.id.toString()}
                    index={idx}
                    key={task.id}
                    isDragDisabled={!canMove}
                  >
                    {(prov, snap) => (
                      <Paper
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        sx={{
                          p: 1.5,
                          mb: 1,
                          borderLeft: `6px solid ${task?.status?.color || '#9E9E9E'}`,
                          opacity: snap.isDragging ? 0.7 : 1,
                        }}
                      >
                        <Typography variant="body1" fontWeight={600} noWrap>
                          {task.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                          <Chip size="small" label={task.priority} color={
                            task.priority === 'high'
                              ? 'error'
                              : task.priority === 'medium'
                              ? 'warning'
                              : 'default'
                          } />
                          {task.due_date && (
                            <Chip
                              size="small"
                              label={new Date(task.due_date).toLocaleDateString()}
                              color={new Date(task.due_date) < new Date() ? 'error' : 'success'}
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Paper>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Box>
  );
}
