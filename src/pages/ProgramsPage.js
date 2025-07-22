import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProgramForm from '../components/ProgramForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  FilterList,
  GetApp
} from '@mui/icons-material';

// Mock data for programs
export const programsData = [
  {
    id: 1,
    name: 'Highway Safety Initiative',
    description: 'Comprehensive highway safety improvement program',
    status: 'active',
    priority: 'high',
    progress: 75,
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    budget: 2500000,
    manager: { name: 'John Smith', avatar: null },
    tasks: 45,
    completedTasks: 34,
    region: 'North',
  },
  {
    id: 2,
    name: 'Urban Traffic Management',
    description: 'Smart traffic light and congestion management system',
    status: 'active',
    priority: 'medium',
    progress: 60,
    startDate: '2025-02-01',
    endDate: '2025-11-30',
    budget: 1800000,
    manager: { name: 'Sarah Johnson', avatar: null },
    tasks: 32,
    completedTasks: 19,
    region: 'Central',
  },
  {
    id: 3,
    name: 'Rural Road Maintenance',
    description: 'Systematic maintenance of rural road infrastructure',
    status: 'planning',
    priority: 'low',
    progress: 15,
    startDate: '2025-03-01',
    endDate: '2025-10-31',
    budget: 950000,
    manager: { name: 'Mike Davis', avatar: null },
    tasks: 28,
    completedTasks: 4,
    region: 'South',
  },
  {
    id: 4,
    name: 'Driver Education Campaign',
    description: 'Public awareness and driver education initiative',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    budget: 450000,
    manager: { name: 'Lisa Chen', avatar: null },
    tasks: 18,
    completedTasks: 18,
    region: 'All',
  },
];

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return { bg: '#e8f5e8', color: '#2e7d32' };
    case 'planning': return { bg: '#fff3e0', color: '#f57c00' };
    case 'completed': return { bg: '#e3f2fd', color: '#1976d2' };
    case 'on-hold': return { bg: '#fce4ec', color: '#c2185b' };
    default: return { bg: '#f5f5f5', color: '#616161' };
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return { bg: '#ffebee', color: '#d32f2f' };
    case 'medium': return { bg: '#fff3e0', color: '#f57c00' };
    case 'low': return { bg: '#e8f5e8', color: '#388e3c' };
    default: return { bg: '#f5f5f5', color: '#616161' };
  }
};

export default function ProgramsPage() {
  const { user } = useAuth();
  const canManagePrograms = user?.role === 'Program Manager';
  const navigate = useNavigate();
  const [programs, setPrograms] = useState(programsData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleMenuOpen = (event, program) => {
    setAnchorEl(event.currentTarget);
    setSelectedProgram(program);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProgram(null);
  };

  const handleFormSave = (programData) => {
    if (editingProgram) {
      // Update existing program
      setPrograms(programs.map(p => p.id === programData.id ? programData : p));
    } else {
      // Create new program
      const newProgram = { ...programData, id: Date.now(), progress: 0, tasks: 0, completedTasks: 0, manager: { name: 'Unassigned' } };
      setPrograms([...programs, newProgram]);
    }
    setEditingProgram(null);
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    setPrograms(programs.filter(p => p.id !== programToDelete.id));
    setIsConfirmOpen(false);
    setProgramToDelete(null);
  };

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPrograms = filteredPrograms.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const paginatedPrograms = sortedPrograms.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Programs Management
        </Typography>
        {canManagePrograms && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingProgram(null);
              setIsFormOpen(true);
            }}
          >
            Create Program
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Programs
              </Typography>
              <Typography variant="h4" component="div">
                {programs.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Active Programs
              </Typography>
              <Typography variant="h4" component="div">
                {programs.filter(p => p.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Budget
              </Typography>
              <Typography variant="h4" component="div">
                ${(programs.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Avg Progress
              </Typography>
              <Typography variant="h4" component="div">
                {Math.round(programs.reduce((sum, p) => sum + p.progress, 0) / programs.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          sx={{ minWidth: 120 }}
        >
          Filters
        </Button>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          sx={{ minWidth: 120 }}
        >
          Export
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Program Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Tasks</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Region</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPrograms.map((program) => {
                const statusColors = getStatusColor(program.status);
                const priorityColors = getPriorityColor(program.priority);
                
                return (
                  <TableRow key={program.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {program.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {program.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={program.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={program.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityColors.bg,
                          color: priorityColors.color,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={program.progress}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2">{program.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                          {program.manager.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{program.manager.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {program.completedTasks}/{program.tasks}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${(program.budget / 1000000).toFixed(1)}M
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{program.region}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, program)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPrograms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/program/${selectedProgram.id}`);
          handleMenuClose();
        }}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {canManagePrograms && [
          <MenuItem key="edit" onClick={() => {
            setEditingProgram(selectedProgram);
            setIsFormOpen(true);
            handleMenuClose();
          }}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => {
            setProgramToDelete(selectedProgram);
            setIsConfirmOpen(true);
            handleMenuClose();
          }}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        ]}
      </Menu>

      <ProgramForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        program={editingProgram}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Program"
        message={`Are you sure you want to delete the program "${programToDelete?.name}"? This action cannot be undone.`}
      />
    </Box>
  );
}
