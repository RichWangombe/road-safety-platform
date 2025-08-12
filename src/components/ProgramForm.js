import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const ProgramForm = ({ open, onClose, onSave, program }) => {
  // We will use this state to manage the form fields
  const [formData, setFormData] = React.useState(program || {});

  // Update form data when the program prop changes (for editing)
  React.useEffect(() => {
    setFormData(program || {});
  }, [program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {program ? "Edit Program" : "Create New Program"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="name"
              label="Program Name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="description"
              label="Description"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="budget"
              label="Budget"
              type="number"
              value={formData.budget || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="region"
              label="Region"
              value={formData.region || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramForm;
