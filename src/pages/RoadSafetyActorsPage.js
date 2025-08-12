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
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Business,
  Gavel,
  VolunteerActivism,
  Handshake,
  LocationCity,
} from "@mui/icons-material";

// Mock Data
const mockActors = [
  {
    id: 1,
    name: "National Highway Authority",
    type: "Government Agency",
    contactPerson: "Director General",
    email: "dg@nha.gov",
    region: "National",
    status: "active",
    projectsInvolved: 5,
    icon: <Gavel color="primary" />,
  },
  {
    id: 2,
    name: "Road Safety Foundation",
    type: "NGO",
    contactPerson: "Maria Garcia",
    email: "maria.g@rsf.org",
    region: "International",
    status: "active",
    projectsInvolved: 8,
    icon: <VolunteerActivism color="secondary" />,
  },
  {
    id: 3,
    name: "ConstructCorp Ltd.",
    type: "Contractor",
    contactPerson: "David Lee",
    email: "david.lee@construct.com",
    region: "North America",
    status: "active",
    projectsInvolved: 12,
    icon: <Business color="action" />,
  },
  {
    id: 4,
    name: "City Traffic Police",
    type: "Government Agency",
    contactPerson: "Chief Inspector",
    email: "chief@citypolice.gov",
    region: "Metropolis",
    status: "inactive",
    projectsInvolved: 3,
    icon: <LocationCity color="primary" />,
  },
  {
    id: 5,
    name: "Safe-Drive Initiative",
    type: "NGO",
    contactPerson: "Chen Wei",
    email: "chen.wei@safedrive.org",
    region: "Asia-Pacific",
    status: "active",
    projectsInvolved: 6,
    icon: <VolunteerActivism color="secondary" />,
  },
  {
    id: 6,
    name: "InfraBuild Partners",
    type: "Contractor",
    contactPerson: "Fatima Ahmed",
    email: "fatima.a@infrabuild.com",
    region: "Middle East",
    status: "pending",
    projectsInvolved: 1,
    icon: <Business color="action" />,
  },
];

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Actor Name" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "region", numeric: false, disablePadding: false, label: "Region" },
  {
    id: "contactPerson",
    numeric: false,
    disablePadding: false,
    label: "Contact",
  },
  {
    id: "projectsInvolved",
    numeric: true,
    disablePadding: false,
    label: "Projects",
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
        <Chip label="Active" color="success" size="small" variant="outlined" />
      );
    case "inactive":
      return (
        <Chip
          label="Inactive"
          color="default"
          size="small"
          variant="outlined"
        />
      );
    case "pending":
      return (
        <Chip label="Pending" color="warning" size="small" variant="outlined" />
      );
    default:
      return <Chip label={status} size="small" variant="outlined" />;
  }
};

export default function RoadSafetyActorsPage() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);

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

  const handleMenuClick = (event, actor) => {
    setAnchorEl(event.currentTarget);
    setSelectedActor(actor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActor(null);
  };

  const filteredActors = useMemo(
    () =>
      mockActors.filter(
        (actor) =>
          actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          actor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          actor.region.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const sortedAndPagedActors = useMemo(() => {
    const sorted = [...filteredActors].sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "projectsInvolved") {
        return isAsc
          ? a.projectsInvolved - b.projectsInvolved
          : b.projectsInvolved - a.projectsInvolved;
      }
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredActors, order, orderBy, page, rowsPerPage]);

  const actorTypes = useMemo(
    () => [...new Set(mockActors.map((a) => a.type))].length,
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
          Road Safety Actors
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add New Actor
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Actors</Typography>
              <Typography variant="h4">{mockActors.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Actor Types</Typography>
              <Typography variant="h4">{actorTypes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Engagements</Typography>
              <Typography variant="h4">
                {mockActors.filter((a) => a.status === "active").length}
              </Typography>
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
              placeholder="Search Actors..."
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
              {sortedAndPagedActors.map((actor) => (
                <TableRow hover key={actor.id}>
                  <TableCell component="th" scope="row" padding="none">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 2, bgcolor: "transparent" }}>
                        {actor.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {actor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {actor.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{actor.type}</TableCell>
                  <TableCell>{actor.region}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {actor.contactPerson}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {actor.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{actor.projectsInvolved}</TableCell>
                  <TableCell>{getStatusChip(actor.status)}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, actor)}>
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
          count={filteredActors.length}
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
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Actor</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Remove Actor
        </MenuItem>
      </Menu>
    </Box>
  );
}
