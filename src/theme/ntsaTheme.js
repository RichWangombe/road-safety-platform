import { createTheme } from '@mui/material/styles';

const ntsaTheme = createTheme({
  palette: {
    primary: {
      main: '#006600', // NTSA green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFCC00', // NTSA yellow
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
    ntsaColors: {
      green: '#006600',
      yellow: '#FFCC00',
      red: '#CC0000', // For alerts/important elements
      blue: '#003366', // Secondary color
    }
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    // Other typography overrides
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#006600',
        },
      },
    },
    // Additional component customizations
  },
});

export default ntsaTheme;
