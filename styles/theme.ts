import darkScrollbar from "@mui/material/darkScrollbar";
import { createTheme } from "@mui/material/styles";

const unresponsiveFontsTheme = createTheme({
  breakpoints: {
    values: {
      xxxs: 0,
      xxs: 200,
      xs: 328,
      sm: 428,
      md: 528,
      lg: 720,
      xl: 1080,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam: { palette: { mode: string } }) => ({
        body: themeParam.palette.mode === "dark" ? darkScrollbar() : null,
      }),
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#3685B5",
      contrastText: "#f1dfbd",
    },
    secondary: {
      main: "#575a4b",
      contrastText: "#ffffff",
    },
    background: {
      default: "#080708",
    },
    text: {
      primary: "#cae9ff",
    },
    error: {
      main: "#b86f52",
    },
  },
});

const theme = createTheme(unresponsiveFontsTheme);

export default theme;

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxxs: true;
    xxs: true;
  }
}
