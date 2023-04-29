import Layout from "../components/layout";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function IndexPage() {
  return (
    <Layout>
      <Grid container>
        <Grid
          item
          xs={12}>
          <Typography variant="h1">NextAuth.js Example</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          pt={5}
          justifyContent="flex-start">
          <Typography variant="body1">
            This is an example site to demonstrate how to use{" "}
            <a href="https://next-auth.js.org">NextAuth.js</a> for
            authentication.
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}
