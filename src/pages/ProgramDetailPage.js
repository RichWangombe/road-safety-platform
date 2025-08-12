import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ActivitiesTable from "../components/ActivitiesTable";
import { programsData, getStatusColor, getPriorityColor } from "./ProgramsPage"; // Assuming these are exported

const ProgramDetailPage = () => {
  const { programId } = useParams();
  const program = programsData.find((p) => p.id.toString() === programId);

  if (!program) {
    return (
      <Box>
        <Typography variant="h4" color="error">
          Program not found
        </Typography>
        <Button component={RouterLink} to="/programs" sx={{ mt: 2 }}>
          Back to Programs
        </Button>
      </Box>
    );
  }

  const statusColors = getStatusColor(program.status);
  const priorityColors = getPriorityColor(program.priority);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/programs"
        >
          Programs
        </Link>
        <Typography color="text.primary">{program.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {program.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {program.description}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={program.status}
              size="small"
              sx={{
                backgroundColor: statusColors.bg,
                color: statusColors.color,
                textTransform: "capitalize",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Priority
            </Typography>
            <Chip
              label={program.priority}
              size="small"
              sx={{
                backgroundColor: priorityColors.bg,
                color: priorityColors.color,
                textTransform: "capitalize",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Region
            </Typography>
            <Typography variant="body2">{program.region}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Budget
            </Typography>
            <Typography variant="body2">
              ${program.budget.toLocaleString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Timeline
            </Typography>
            <Typography variant="body2">
              {program.startDate} to {program.endDate}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Program Manager
            </Typography>
            <Typography variant="body2">{program.manager.name}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <ActivitiesTable programId={programId} />
    </Box>
  );
};

export default ProgramDetailPage;
