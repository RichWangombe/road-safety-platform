import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import apiService from "../api/apiService";
import useCan from "../hooks/useCan";

// Build columns from statuses and place tasks into them, preserving order
const buildColumns = (statuses, tasks) => {
  const map = new Map();
  statuses
    .slice()
    .sort((a, b) => a.position - b.position)
    .forEach((s) => {
      map.set(String(s.id), {
        id: s.id,
        name: s.name,
        position: s.position,
        tasks: [],
      });
    });

  tasks.forEach((task) => {
    const key = String(task?.status?.id || task.status_id);
    if (!map.has(key)) return; // unknown status
    map.get(key).tasks.push(task);
  });

  // Sort tasks within each column by position
  Array.from(map.values()).forEach((col) => {
    col.tasks.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  });

  return Array.from(map.values()).sort((a, b) => a.position - b.position);
};

export default function TaskBoard() {
  // Allow ?activity_id=123 as deep link
  const [searchParams, setSearchParams] = useSearchParams();
  const [programId, setProgramId] = useState(searchParams.get("program_id") || "");
  const [activityId, setActivityId] = useState(searchParams.get("activity_id") || "");

  const [columns, setColumns] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const canMove = useCan('move');
  const [error, setError] = useState(null);

  const loadStatuses = useCallback(async () => {
    try {
      const { data } = await apiService.get("/v1/task-statuses");
      const sorted = (data || []).slice().sort((a, b) => a.position - b.position);
      setStatuses(sorted);
      return true;
    } catch (err) {
      console.error("Failed to load statuses", err);
      setError("Failed to load task statuses");
      return false;
    }
  }, []);

  const loadPrograms = useCallback(async () => {
    try {
      const { data } = await apiService.get("/v1/programs");
      const list = Array.isArray(data) ? data : [];
      setPrograms(list);
      // Prefer Nairobi demo if present
      if (!programId && list.length > 0) {
        const preferred = list.find(p => (p.name || "").includes("Nairobi Road Safety Demo")) || list[0];
        const nextId = String(preferred.id);
        setProgramId(nextId);
        const current = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...current, program_id: nextId });
      }
      return true;
    } catch (err) {
      console.error("Failed to load programs", err);
      setError("Failed to load programs");
      return false;
    }
  }, [programId, searchParams, setSearchParams]);

  const loadActivities = useCallback(async () => {
    try {
      if (!programId) {
        setActivities([]);
        return true;
      }
      const { data } = await apiService.get("/v1/activities", { params: { program_id: programId } });
      const list = Array.isArray(data) ? data : [];
      setActivities(list);
      if ((!activityId || !list.some(a => String(a.id) === String(activityId))) && list.length > 0) {
        const firstId = String(list[0].id);
        setActivityId(firstId);
        const current = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...current, activity_id: firstId });
      }
      return true;
    } catch (err) {
      console.error("Failed to load activities", err);
      setError("Failed to load activities");
      return false;
    }
  }, [programId, activityId, searchParams, setSearchParams]);

  const loadSummary = useCallback(async () => {
    if (!activityId) return;
    try {
      const { data } = await apiService.get("/v1/tasks/summary", {
        params: { activity_id: activityId },
      });
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  }, [activityId]);

  const loadTasks = useCallback(async () => {
    if (!activityId) return;
    setTasksLoading(true);
    try {
      const { data } = await apiService.get("/v1/tasks", {
        params: { activity_id: activityId },
      });
      setColumns(buildColumns(statuses, data || []));
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  }, [activityId, statuses]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBootLoading(true);
      await Promise.all([loadStatuses(), loadPrograms()]);
      if (!cancelled) {
        setBootDone(true);
        // If there is no activity or statuses failed, do not keep spinner
        setBootLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadStatuses, loadPrograms]);

  useEffect(() => {
    if (!bootDone) return;
    // when program changes, fetch activities scoped to it
    loadActivities();
  }, [bootDone, programId, loadActivities]);

  useEffect(() => {
    if (!bootDone) return;
    if (!statuses.length || !activityId) return; // show empty state without spinner
    loadTasks();
    loadSummary();
  }, [bootDone, statuses, activityId, loadTasks, loadSummary]);

  const handleProgramChange = (e) => {
    const next = String(e.target.value);
    setProgramId(next);
    // reset activity when program changes
    setActivityId("");
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, program_id: next });
  };

  const handleActivityChange = (e) => {
    const next = String(e.target.value);
    setActivityId(next);
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, activity_id: next });
  };

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

  const totalTasks = columns.reduce((sum, c) => sum + (c.tasks?.length || 0), 0);

  if (bootLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filters and KPIs */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="program-select-label">Program</InputLabel>
          <Select
            labelId="program-select-label"
            label="Program"
            value={programId || ""}
            onChange={handleProgramChange}
            MenuProps={{
              disablePortal: false,
              PaperProps: { sx: { maxHeight: 320, zIndex: (theme) => theme.zIndex.modal + 1 } },
            }}
          >
            <MenuItem value="" disabled>Select a program</MenuItem>
            {programs.map((p) => (
              <MenuItem key={p.id} value={String(p.id)}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="activity-select-label">Activity</InputLabel>
          <Select
            labelId="activity-select-label"
            label="Activity"
            value={activityId || ""}
            onChange={handleActivityChange}
            disabled={!programId || activities.length === 0}
            MenuProps={{
              disablePortal: false,
              PaperProps: { sx: { maxHeight: 320, zIndex: (theme) => theme.zIndex.modal + 1 } },
            }}
          >
            <MenuItem value="" disabled>Select an activity</MenuItem>
            {activities.map((a) => (
              <MenuItem key={a.id} value={String(a.id)}>{a.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Overdue: ${summary?.overdue ?? 0}`} color="error" variant="outlined" />
          <Chip label={`Due today: ${summary?.due_today ?? 0}`} color="warning" variant="outlined" />
          <Chip label={`Awaiting approval: ${summary?.awaiting_approval ?? 0}`} color="info" variant="outlined" />
          <Chip label={`Completed: ${summary?.completed ?? 0}`} color="success" variant="outlined" />
        </Stack>
      </Stack>

      {programs.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" gutterBottom>
            No programs in your scope yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ask a Program Manager to add you to a program, or create one if you have permission.
          </Typography>
          <Button variant="contained" href="/programs">Go to Programs</Button>
        </Paper>
      )}

      {programs.length > 0 && activities.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" gutterBottom>
            No activities in the selected program.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Create an activity to start planning tasks.
          </Typography>
          <Button variant="outlined" href="/activities">Create Activity</Button>
        </Paper>
      )}

      {programs.length > 0 && activities.length > 0 && totalTasks === 0 && !tasksLoading && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">
            No tasks found for this activity. Adjust filters or create a new task.
          </Typography>
        </Paper>
      )}

      {tasksLoading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading tasks...
          </Typography>
        </Stack>
      )}

      {/* Board */}
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
    </Box>
  );
}
