import React, { useState, useMemo } from "react";
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

} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  PersonAdd,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

// Mock Data
const mockTeamMembers = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    email: "john.smith@example.com",
    role: "Program Manager",
    status: "active",
    lastLogin: new Date(2025, 6, 18, 10, 30, 0),
    assignedTasks: 15,
    region: "North America",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "SJ",
    email: "sarah.j@example.com",
    role: "Regional Supervisor",
    status: "active",
    lastLogin: new Date(2025, 6, 17, 14, 0, 0),
    assignedTasks: 22,
    region: "Europe",
  },
  {
    id: 3,
    name: "Mike Davis",
    avatar: "MD",
    email: "mike.davis@example.com",
    role: "Team Lead",
    status: "inactive",
    lastLogin: new Date(2025, 5, 20, 9, 0, 0),
    assignedTasks: 8,
    region: "Asia",
  },
  {
    id: 4,
    name: "Lisa Chen",
    avatar: "LC",
    email: "lisa.chen@example.com",
    role: "Team Member",
    status: "active",
    lastLogin: new Date(2025, 6, 18, 15, 0, 0),
    assignedTasks: 5,
    region: "North America",
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "DW",
    email: "david.w@example.com",
    role: "Team Member",
    status: "pending",
    lastLogin: null,
    assignedTasks: 0,
    region: "Europe",
  },
  {
    id: 6,
    name: "Emily Brown",
    avatar: "EB",
    email: "emily.b@example.com",
    role: "Auditor",
    status: "active",
    lastLogin: new Date(2025, 6, 16, 11, 45, 0),
    assignedTasks: 2,
    region: "Global",
  },
];

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "role", numeric: false, disablePadding: false, label: "Role" },
  { id: "region", numeric: false, disablePadding: false, label: "Region" },
  { id: "assignedTasks", numeric: true, disablePadding: false, label: "Tasks" },
  {
    id: "lastLogin",
    numeric: false,
    disablePadding: false,
    label: "Last Login",
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "actions", numeric: false, disablePadding: false, label: "Actions" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: "bold" } }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
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
    case "active":
      return (
        <Chip
          label="Active"
          color="success"
          size="small"
          icon={<CheckCircle />}
        />
      );
    case "inactive":
      return (
        <Chip label="Inactive" color="default" size="small" icon={<Cancel />} />
      );
    case "pending":
      return (
        <Chip label="Pending" color="warning" size="small" icon={<Pending />} />
      );
    default:
      return <Chip label={status} size="small" />;
  }
};

export default function TeamMembersPage() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const filteredMembers = useMemo(
    () =>
      mockTeamMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.role.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const sortedAndPagedMembers = useMemo(() => {
    const sorted = [...filteredMembers].sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "lastLogin") {
        const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return isAsc ? dateA - dateB : dateB - dateA;
      }
      if (orderBy === "assignedTasks") {
        return isAsc
          ? a.assignedTasks - b.assignedTasks
          : b.assignedTasks - a.assignedTasks;
      }
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredMembers, order, orderBy, page, rowsPerPage]);

  const activeMembers = useMemo(
    () => mockTeamMembers.filter((m) => m.status === "active").length,
    [],
  );
  const pendingInvites = useMemo(
    () => mockTeamMembers.filter((m) => m.status === "pending").length,
    [],
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Team Members
        </Typography>
        <Button variant="contained" startIcon={<PersonAdd />}>
          Invite Member
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Members</Typography>
              <Typography variant="h4">{mockTeamMembers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Members</Typography>
              <Typography variant="h4">{activeMembers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Invitations</Typography>
              <Typography variant="h4">{pendingInvites}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 300,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Members..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
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
              {sortedAndPagedMembers.map((member) => (
                <TableRow hover key={member.id}>
                  <TableCell component="th" scope="row" padding="none">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
                        {member.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.region}</TableCell>
                  <TableCell align="right">{member.assignedTasks}</TableCell>
                  <TableCell>
                    {member.lastLogin
                      ? formatDistanceToNow(member.lastLogin, {
                          addSuffix: true,
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell>{getStatusChip(member.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, member)}>
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
          count={filteredMembers.length}
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
        <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit User</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Deactivate User
        </MenuItem>
      </Menu>
    </Box>
  );
}
