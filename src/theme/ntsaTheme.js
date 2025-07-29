import { createTheme } from "@mui/material/styles";

const ntsaTheme = createTheme({
  palette: {
    primary: {
      main: "#006600", // NTSA green
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFCC00", // NTSA yellow
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
    ntsaColors: {
      green: "#006600",
      yellow: "#FFCC00",
      red: "#CC0000", // For alerts/important elements
      blue: "#003366", // Secondary color
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      fontWeight: 600,
      textTransform: "none", // Buttons look like text, not ALL CAPS
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#006600",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px", // Slightly rounded corners
          padding: "6px 16px", // Standard padding
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // More rounded than buttons
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
          padding: (theme) => theme.spacing(2), // Add internal padding
        },
      },
    },
  },
});

export default ntsaTheme;
