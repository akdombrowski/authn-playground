import darkScrollbar from "@mui/material/darkScrollbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam: { palette: { mode: string } }) => ({
        body: themeParam.palette.mode === "dark" ? darkScrollbar() : null,
      }),
    },
  },
});

export default theme;
