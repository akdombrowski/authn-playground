import { SessionProvider } from "next-auth/react";
import "./styles.css";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <CssBaseline enableColorScheme>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </CssBaseline>
    </SessionProvider>
  );
}
