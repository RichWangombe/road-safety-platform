import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  InputBase,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Avatar,
  Tooltip,
  Button,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  AdminPanelSettings,
  SupervisorAccount,
  Work,
  Group as GroupIcon,
  VpnKey,
  CheckCircle, 
  Cancel
} from '@mui/icons-material';

// Mock Data
const mockRoles = [
  {
    id: 1,
    name: 'Program Manager',
    description: 'Manages road safety programs and budgets.',
    userCount: 5,
    permissions: ['create_program', 'edit_program', 'delete_program', 'view_reports'],
    status: 'active',
    icon: <AdminPanelSettings />
  },
  {
    id: 2,
    name: 'Regional Supervisor',
    description: 'Supervises activities within a specific region.',
    userCount: 12,
    permissions: ['approve_tasks', 'view_reports', 'manage_teams'],
    status: 'active',
    icon: <SupervisorAccount />
  },
  {
    id: 3,
    name: 'Team Lead',
    description: 'Leads a team of members for specific tasks.',
    userCount: 25,
    permissions: ['assign_tasks', 'view_progress'],
    status: 'active',
    icon: <Work />
  },
  {
    id: 4,
    name: 'Team Member',
    description: 'Executes assigned road safety tasks.',
    userCount: 80,
    permissions: ['view_tasks', 'update_task_status'],
    status: 'active',
    icon: <GroupIcon />
  },
  {
    id: 5,
    name: 'Auditor',
    description: 'Conducts audits and reviews compliance.',
    userCount: 3,
    permissions: ['view_reports', 'access_all_data'],
    status: 'restricted',
    icon: <AdminPanelSettings />
  },
  {
    id: 6,
    name: 'Stakeholder',
    description: 'External partner with view-only access.',
    userCount: 15,
    permissions: ['view_dashboards'],
    status: 'inactive',
    icon: <GroupIcon />
  },
];

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Role Name' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'userCount', numeric: true, disablePadding: false, label: 'Users' },
  { id: 'permissions', numeric: false, disablePadding: false, label: 'Key Permissions' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 'bold' } }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== 'actions' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const getStatusChip = (status) => {
    switch (status) {
        case 'active':
            return <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />;
        case 'inactive':
            return <Chip label="Inactive" color="default" size="small" icon={<Cancel />} />;
        case 'restricted':
            return <Chip label="Restricted" color="warning" size="small" />;
        default:
            return <Chip label={status} size="small" />;
    }
};

export default function RolesPage() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const filteredRoles = useMemo(() =>
    mockRoles.filter(role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  const sortedAndPagedRoles = useMemo(() => {
    const sorted = [...filteredRoles].sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'userCount') {
        return isAsc ? a.userCount - b.userCount : b.userCount - a.userCount;
      }
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredRoles, order, orderBy, page, rowsPerPage]);

  const totalUsers = useMemo(() => mockRoles.reduce((sum, role) => sum + role.userCount, 0), []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Roles & Permissions</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Add New Role</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
            <Card><CardContent><Typography variant="h6">Total Roles</Typography><Typography variant="h4">{mockRoles.length}</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Card><CardContent><Typography variant="h6">Active Roles</Typography><Typography variant="h4">{mockRoles.filter(r => r.status === 'active').length}</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Card><CardContent><Typography variant="h6">Total Users</Typography><Typography variant="h4">{totalUsers}</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Roles..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedAndPagedRoles.map((role) => (
                <TableRow hover key={role.id}>
                  <TableCell component="th" scope="row" padding="none">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>{role.icon}</Avatar>
                      <Typography variant="subtitle2">{role.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell align="right">{role.userCount}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.permissions.slice(0, 2).map(p => <Chip key={p} label={p.replace(/_/g, ' ')} size="small" variant="outlined" />)}
                      {role.permissions.length > 2 && <Tooltip title={role.permissions.slice(2).join(', ')}><Chip label={`+${role.permissions.length - 2}`} size="small" /></Tooltip>}
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(role.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, role)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRoles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit Permissions</MenuItem>
        <MenuItem onClick={handleMenuClose}>Assign Users</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>Delete Role</MenuItem>
      </Menu>
    </Box>
  );
}
