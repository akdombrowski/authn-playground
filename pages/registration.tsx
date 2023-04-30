import { useState, SyntheticEvent } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import NavBtn from "../components/navBtn";

import { signIn, signOut, useSession } from "next-auth/react";

import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { randomFillSync } = await import("node:crypto");

  const challUint8 = new Uint8Array(32);
  randomFillSync(challUint8);

  const challenge = challUint8.toString();

  return {
    props: {
      challenge,
    },
  };
};

const login = ({ challenge }: { challenge: string }) => {
  const { data: session, status } = useSession();
  const [webAuthnSuccess, setWebAuthnSuccess] = useState(false);
  const [webAuthnCred, setWebAuthnCred] = useState("");

  console.log(challenge.split(","));

  const isWebAuthnAvail = () => {
    return window.PublicKeyCredential;
  };

  const createPubKey = (email: string) => {
    const challengeArray = new Uint8Array(challenge.toSplit(","));
    const pubKey = {
      // The challenge is produced by the server; see the Security Considerations
      challenge: challengeArray,

      // Relying Party:
      rp: {
        name: "webauthn-playground",
      },

      // User:
      user: {
        id: Uint8Array.from(
          window.atob("MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII="),
          (c) => c.charCodeAt(0)
        ),
        name: email,
        displayName: email,
      },

      // This Relying Party will accept either an ES256 or RS256 credential, but
      // prefers an ES256 credential.
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7, // "ES256" as registered in the IANA COSE Algorithms registry
        },
        {
          type: "public-key",
          alg: -257, // Value registered by this specification for "RS256"
        },
      ],

      authenticatorSelection: {
        // Try to use UV if possible. This is also the default.
        userVerification: "preferred",
      },

      timeout: 300000, // 5 minutes
      excludeCredentials: [
        // Don’t re-register any authenticator that has one of these credentials
        {
          id: Uint8Array.from(
            window.atob("ufJWp8YGlibm1Kd9XQBWN1WAw2jy5In2Xhon9HAqcXE="),
            (c) => c.charCodeAt(0)
          ),
          type: "public-key",
        },
        {
          id: Uint8Array.from(
            window.atob("E/e1dhZc++mIsz4f9hb6NifAzJpF1V4mEtRlIPBiWdY="),
            (c) => c.charCodeAt(0)
          ),
          type: "public-key",
        },
      ],

      // Make excludeCredentials check backwards compatible with credentials registered with U2F
      extensions: { appidExclude: "https://webauthnplayground.com" },
    };
    createCred(pubKey);
  };

  const createCred = (pubKey) => {
    // Note: The following call will cause the authenticator to display UI.
    navigator.credentials
      .create({ publicKey })
      .then(function (newCredentialInfo) {
        // Send new credential info to server for verification and registration.
      })
      .catch(function (err) {
        // No acceptable authenticator or user refused consent. Handle appropriately.
      });
  };

  // Handles the submit event on form submit.
  const handleSubmit = async (event: SyntheticEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "/api/webauthn";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    setWebAuthnSuccess(result.data?.success);
    setWebAuthnCred(result.data);
  };

  return (
    <Grid
      container
      py={5}
      px={3}>
      {webAuthnSuccess || session ? (
        <Grid
          item
          container
          xs={12}>
          <Grid
            item
            xs={12}>
            <Typography>"You're signed in"</Typography>
          </Grid>
          <Grid
            item
            xs={12}>
            <NavBtn
              href="/protected"
              variant="contained"
            />
          </Grid>
        </Grid>
      ) : (
        <Grid
          item
          container
          xs={12}>
          <Grid
            item
            container
            xs={12}
            justifyContent="center">
            <NavBtn
              variant="contained"
              size="small"
              href={`/api/auth/signin`}
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                signIn();
              }}>
              Provider Login
            </NavBtn>
          </Grid>
          <Grid
            item
            xs={12}
            mt={5}>
            <Divider variant="middle">
              <Chip label="OR" />
            </Divider>
          </Grid>
          <Grid
            item
            container
            xs={12}
            justifyContent="center">
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
                <Grid container>
                  <Grid
                    item
                    xs>
                    <Link
                      href="#"
                      variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default login;
