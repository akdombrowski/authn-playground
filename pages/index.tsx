import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Layout from "../components/layout";
import NextLinkComposed from "../components/NextLinkComposed";

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
          justifyContent="center"
          pt="3%"
          xs={12}>
          <Button
            component={NextLinkComposed}
            variant="contained"
            to={{ pathname: "/login" }}
            size="small"
            sx={{ width: "50%" }}>
            Login
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}
