import Header from "./header";
import Footer from "./footer";
import type { ReactNode } from "react";
import Container from "@mui/material/Container";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Container maxWidth="xl">{children}</Container>
      <Footer />
    </>
  );
}
