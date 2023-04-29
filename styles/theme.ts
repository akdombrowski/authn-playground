import darkScrollbar from "@mui/material/darkScrollbar";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

const unresponsiveFontsTheme = createTheme({
  breakpoints: {
    values: {
      xxs: 0,
      xs: 265,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam: { palette: { mode: string } }) => ({
        body: themeParam.palette.mode === "dark" ? darkScrollbar() : null,
      }),
    },
  },
});

const theme = createTheme(unresponsiveFontsTheme);

export default theme;

declare module "@mui/material/styles" {
  interface Theme {
    breakpoints: {
      values: {
        xxs: number;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    breakpoints?: {
      values?: {
        xxs: number;
      };
    };
  }
}
