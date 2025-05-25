import { createTheme } from "@mui/material/styles";

// Світла тема з теплими фіолетовими
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#364F6B", // Темно-синій
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3FC1C9", // Бірюзовий
      contrastText: "#ffffff",
    },
    error: {
      main: "#FC5185", // Рожево-червоний
    },
    background: {
      default: "#F5F5F5", // Світлий фон
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#5e5e5e",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#364F6B", // Такий самий як primary.main
          color: "#ffffff",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2E073F", // Темний фіолетовий
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7A1CAC", // Яскравий пурпурний
      contrastText: "#ffffff",
    },
    error: {
      main: "#ff1744", // Насичений варіант для теми
    },
    background: {
      default: "#003161", // Темний фон (основний)
      paper: "#1e1e1e",   // Трохи світліший для елементів (карток тощо)
    },
    text: {
      primary: "#EBD3F8", // Світло-фіолетовий для основного тексту
      secondary: "#b0bec5", // Світло-сірий для другого тексту
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#2E073F", // Гармонійний з темним фоном
          color: "#ffffff",
        },
      },
    },
  },
});

