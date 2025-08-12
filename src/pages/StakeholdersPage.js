import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
  CorporateFare,
  AccountBalance,
  LocalHospital,
  School,
} from "@mui/icons-material";
import { fetchStakeholders } from "../api/apiService";

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Stakeholder" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  {
    id: "contact_person",
    numeric: false,
    disablePadding: false,
    label: "Contact Person",
  },
  {
    id: "engagement_level",
    numeric: false,
    disablePadding: false,
    label: "Engagement",
  },
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

const getIconForStakeholder = (organization) => {
  const org = organization.toLowerCase();
  if (org.includes("ministry") || org.includes("police")) {
    return <AccountBalance color="primary" />;
  }
  if (org.includes("hospital") || org.includes("medical")) {
    return <LocalHospital color="error" />;
  }
  if (org.includes("school")) {
    return <School color="secondary" />;
  }
  return <CorporateFare color="action" />;
};

const getEngagementChip = (level) => {
  const levelMap = {
    High: { label: "High", color: "success" },
    Medium: { label: "Medium", color: "warning" },
    Low: { label: "Low", color: "error" },
  };
  const { label, color } = levelMap[level] || {
    label: level,
    color: "default",
  };
  return <Chip label={label} color={color} size="small" />;
};

export default function StakeholdersPage() {
  const { user } = useAuth();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [filteredStakeholders, setFilteredStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStakeholders = async () => {
      try {
        setError(null); // Reset error state before making request
        setLoading(true);
        const data = await fetchStakeholders(user.token);
        setStakeholders(data);
        setFilteredStakeholders(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadStakeholders();
  }, []);

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

  const handleMenuClick = (event, stakeholder) => {
    setAnchorEl(event.currentTarget);
    setSelectedStakeholder(stakeholder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStakeholder(null);
  };

  const sortedAndPagedStakeholders = useMemo(() => {
    const filtered = stakeholders.filter((stakeholder) =>
      Object.values(stakeholder).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
    const sorted = [...filtered].sort((a, b) => {
      const isAsc = order === "asc";
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [stakeholders, order, orderBy, page, rowsPerPage, searchQuery]);

  const highEngagementCount = useMemo(
    () => stakeholders.filter((s) => s.engagement_level === "High").length,
    [stakeholders],
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

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
          Stakeholders
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add New Stakeholder
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }} columns={{ xs: 12, sm: 12 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Stakeholders</Typography>
              <Typography variant="h4">{stakeholders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">High-Engagement</Typography>
              <Typography variant="h4">{highEngagementCount}</Typography>
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
              placeholder="Search Stakeholders..."
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
              {sortedAndPagedStakeholders.map((stakeholder, index) => (
                <TableRow hover key={`${stakeholder.id}-${stakeholder.name}`}>
                  <TableCell component="th" scope="row" padding="none">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 2, bgcolor: "transparent" }}>
                        {getIconForStakeholder(stakeholder.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {stakeholder.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stakeholder.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{stakeholder.type}</TableCell>
                  <TableCell>{stakeholder.contact_person}</TableCell>
                  <TableCell>
                    {getEngagementChip(stakeholder.engagement_level)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      data-testid={`action-menu-button-${stakeholder.id}`}
                      onClick={(e) => handleMenuClick(e, stakeholder)}
                    >
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
          count={filteredStakeholders.length}
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
        <MenuItem onClick={handleMenuClose}>Log Interaction</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Remove Stakeholder
        </MenuItem>
      </Menu>
    </Box>
  );
}
