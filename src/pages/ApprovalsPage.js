import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import apiService from "../api/apiService";

export default function ApprovalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [programId, setProgramId] = useState(searchParams.get("program_id") || "");
  const [activityId, setActivityId] = useState(searchParams.get("activity_id") || "");

  const [loading, setLoading] = useState(true);
  const [bootDone, setBootDone] = useState(false);
  const [error, setError] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);

  const statusBySlug = useMemo(() => {
    const map = new Map();
    statuses.forEach((s) => map.set(s.slug, s));
    return map;
  }, [statuses]);

  const loadPrograms = useCallback(async () => {
    try {
      const { data } = await apiService.get("/v1/programs");
      const list = Array.isArray(data) ? data : [];
      setPrograms(list);
      if (!programId && list.length) {
        const preferred = list.find(p => (p.name || "").includes("Nairobi Road Safety Demo")) || list[0];
        const nextId = String(preferred.id);
        setProgramId(nextId);
        const current = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...current, program_id: nextId });
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load programs");
    }
  }, [programId, searchParams, setSearchParams]);

  const loadActivities = useCallback(async () => {
    try {
      if (!programId) { setActivities([]); return; }
      const { data } = await apiService.get("/v1/activities", { params: { program_id: programId } });
      const list = Array.isArray(data) ? data : [];
      setActivities(list);
      if ((!activityId || !list.some(a => String(a.id) === String(activityId))) && list.length > 0) {
        const firstId = String(list[0].id);
        setActivityId(firstId);
        const current = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...current, activity_id: firstId });
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load activities");
    }
  }, [programId, activityId, searchParams, setSearchParams]);

  const loadStatuses = useCallback(async () => {
    try {
      const { data } = await apiService.get("/v1/task-statuses");
      setStatuses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiService.get("/v1/tasks", {
        params: {
          needs_approval: 1,
          program_id: programId || undefined,
          activity_id: activityId || undefined,
        },
      });
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [programId, activityId]);

  const loadSummary = useCallback(async () => {
    try {
      const { data } = await apiService.get("/v1/tasks/summary", {
        params: {
          program_id: programId || undefined,
          activity_id: activityId || undefined,
        },
      });
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  }, [programId, activityId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await Promise.all([loadPrograms(), loadStatuses()]);
      if (!cancelled) {
        setBootDone(true);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadPrograms, loadStatuses]);

  useEffect(() => {
    if (!bootDone) return;
    loadActivities();
  }, [bootDone, programId, loadActivities]);

  useEffect(() => {
    if (!bootDone) return;
    loadTasks();
    loadSummary();
  }, [bootDone, activityId, loadTasks, loadSummary]);

  const handleProgramChange = (e) => {
    const next = String(e.target.value);
    setProgramId(next);
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

  const approveTask = async (task) => {
    try {
      const completed = statusBySlug.get("completed");
      if (!completed) return;
      await apiService.post(`/v1/tasks/${task.id}/move`, {
        status_id: completed.id,
        position: 0,
      });
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      loadSummary();
    } catch (e) {
      console.error("Approve failed", e);
    }
  };

  const requestChanges = async (task) => {
    try {
      const draft = statusBySlug.get("draft");
      if (!draft) return;
      await apiService.post(`/v1/tasks/${task.id}/move`, {
        status_id: draft.id,
        position: 0,
      });
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      loadSummary();
    } catch (e) {
      console.error("Request changes failed", e);
    }
  };

  if (!bootDone) return <CircularProgress />;
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="program-select-label">Program</InputLabel>
          <Select
            labelId="program-select-label"
            label="Program"
            value={programId || ""}
            onChange={handleProgramChange}
          >
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
          >
            {activities.map((a) => (
              <MenuItem key={a.id} value={String(a.id)}>{a.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Awaiting approval: ${summary?.awaiting_approval ?? 0}`} color="info" variant="outlined" />
          <Chip label={`Overdue: ${summary?.overdue ?? 0}`} color="error" variant="outlined" />
          <Chip label={`Due today: ${summary?.due_today ?? 0}`} color="warning" variant="outlined" />
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
        </Paper>
      )}

      {programs.length > 0 && activities.length > 0 && tasks.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">
            No tasks awaiting your approval for this activity.
          </Typography>
        </Paper>
      )}

      {tasks.length > 0 && (
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Paper key={task.id} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="subtitle1" fontWeight={600}>{task.title}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label={task?.status?.name || 'Unknown'} />
                  {task.priority && <Chip size="small" label={task.priority} />}
                  {task?.assignee?.name && <Chip size="small" label={`Assignee: ${task.assignee.name}`} />}
                  {task?.due_date && (
                    <Chip size="small" label={new Date(task.due_date).toLocaleDateString()} />
                  )}
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" color="success" onClick={() => approveTask(task)}>Approve</Button>
                <Button variant="outlined" color="warning" onClick={() => requestChanges(task)}>Request changes</Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
