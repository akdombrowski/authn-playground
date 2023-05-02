import { useState, SyntheticEvent } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
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
  const [savedCred, setSavedCred] = useState(false);
  const [webAuthnCred, setWebAuthnCred] = useState("");
  const isWebAuthnAvail = () => {
    return window.PublicKeyCredential;
  };

  const createPubKey = async (
    email: string
  ): Promise<PublicKeyCredential | null> => {
    const challengeArray = challenge.split(",");
    const challengeUint8 = new Uint8Array(Buffer.from(challengeArray));
    const userID = new Uint8Array(16);
    self.crypto.getRandomValues(userID);

    const pubKeyOpt = {
      // The challenge is produced by the server; see the Security Considerations
      challenge: challengeUint8,

      // Relying Party:
      rp: {
        name: "webauthn-playground",
      },

      // User:
      user: {
        id: userID,
        name: email,
        displayName: email,
      },

      // This Relying Party will accept either an ES256 or RS256 credential, but
      // prefers an RS256 credential.
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -257, // Value registered by this specification for "RS256"
        },
      ],

      authenticatorSelection: {
        // UV required.
        userVerification: "required",
      },

      timeout: 300000, // 5 minutes
      excludeCredentials: [
        // Don’t re-register any authenticator that has one of these credentials
      ],

      // Make excludeCredentials check backwards compatible with credentials registered with U2F
      extensions: {},
    };

    try {
      const pubKeyCred = await createCred(pubKeyOpt);
      return pubKeyCred as PublicKeyCredential;
    } catch (e) {
      console.error("failed to create webauthn cred");
      console.error(e.message);
      return null;
    }
  };

  const createCred = async (pubKeyOpt) => {
    // Note: The following call will cause the authenticator to display UI.
    return navigator.credentials.create({ publicKey: pubKeyOpt });
  };

  // Handles the submit event on form submit.
  const handleSubmit = async (event: SyntheticEvent) => {
    let data;
    let endpoint;
    let pubKeyCred: PublicKeyCredential | null;

    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    try {
      pubKeyCred = await createPubKey(event.target.email.value);
    } catch (e) {
      console.error("WebAuthn failed:", e.message);
    }

    if (pubKeyCred) {
      const { authenticatorAttachment, id, rawId, response, type } = pubKeyCred;
      const rawIdArr = new Uint8Array(rawId);
      const rawIdStr = rawIdArr.toString();
      const attestationObjectArr = new Uint8Array(response.attestationObject);
      const attestationObjectStr = attestationObjectArr.toString();
      const clientDataJSONArr = new Uint8Array(response.clientDataJSON);
      const clientDataJSONStr = clientDataJSONArr.toString();

      // Get data from the form and webauthn.
      data = {
        email: event.target.email.value,
        pubKeyCred: {
          authenticatorAttachment: pubKeyCred.authenticatorAttachment,
          id: pubKeyCred.id,
          rawId: rawIdStr,
          response: {
            attestationObj: attestationObjectStr,
            clientDataJSON: clientDataJSONStr,
          },
          type: type,
        },
      };

      // API endpoint where we send form data.
      endpoint = "/api/webauthn";
    } else if (event.target.password.value) {
      // Get data from the form.
      data = {
        email: event.target.email.value,
        pubKeyCred: event.target.password.value,
      };
      endpoint = "/api/password";
    } else {
      console.error("No credential entered");
      return;
    }

    // Send the data to the server in JSON format.
    const jsonData = JSON.stringify(data);
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: jsonData,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
  };

  return (
    <Grid
      container
      py={5}
      px={3}>
      {savedCred || session ? (
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
