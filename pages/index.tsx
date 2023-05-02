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
      </Grid>
    </Layout>
  );
}
