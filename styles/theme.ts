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
