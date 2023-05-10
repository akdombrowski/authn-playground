import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Layout from "../components/layout";
import NextLinkComposed from "../components/NextLinkComposed";
import { SyntheticEvent } from "react";
import { signIn } from "next-auth/react";

export default function IndexPage() {
  return (
    <Layout>
      <Grid container>
        <Grid
          item
          xs={12}>
          <Typography
            variant="h2"
            textAlign="center">
            Under Construction
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          pt={5}
          justifyContent="flex-start">
          <Typography variant="body1">
            This is a playground for implementing authentication with Next.js.
          </Typography>
        </Grid>
        <Grid
          item
          container
          justifyContent="space-around"
          pt="3%"
          xs={12}>
          {/* <Grid
            item
            container
            justifyContent="center"
            xs={6}> */}
          <Button
            component={NextLinkComposed}
            variant="contained"
            to={{ pathname: "/login" }}
            size="small"
            sx={{ width: "25%" }}
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              signIn();
            }}>
            Login
          </Button>
          {/* </Grid>
          <Grid
            item
            xs={6}> */}
          <Button
            component={NextLinkComposed}
            variant="contained"
            to={{ pathname: "/registration" }}
            size="small"
            sx={{ width: "25%" }}>
            Register
          </Button>
          {/* </Grid> */}
        </Grid>
      </Grid>
    </Layout>
  );
}
