import darkScrollbar from "@mui/material/darkScrollbar";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

const unresponsiveFontsTheme = createTheme({
  breakpoints: {
    values: {
      xxxs: 0,
      xxs: 200,
      xs: 328,
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
