import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const rpName = "authn-playground";
const rpID = "authnplayground";

const isResponseInstanceOfAAR = (response: any) => {
  if (!(response instanceof AuthenticatorAttestationResponse)) {
    console.log(
      "response is not an isntance of AuthenticatorAttestationResponse"
    );
    console.log("response is of type: " + typeof response);
    return false;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  // Get data submitted in request's body.
  const body = req.body;

  if (!body) {
    return res.status(400).json({ data: "No data found" });
  }

  const email = body.email;
  const pubKeyCred = body.pubKeyCred;
  const { authenticatorAttachment, id, rawId, response, type } = pubKeyCred;

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!email) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("email not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Email not found" });
  }

  if (!pubKeyCred) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("pubKeyCred not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred not found" });
  }

  if (!authenticatorAttachment) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("authenticatorAttachment not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res
      .status(400)
      .json({ data: "Cred authenticatorAttachment not found" });
  }

  if (!id) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("id not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred id not found" });
  }

  if (!rawId) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("rawId not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred rawId not found" });
  }

  if (!response) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("response not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred response not found" });
  }

  if (!type) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log("type not found");
    console.log("body: ", body);
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Cred type not found" });
  }

  try {
    const decoder = new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    });
    const { authenticatorAttachment, id, rawId, response, type } = pubKeyCred;
    const rawIdArr = new Uint8Array(rawId);
    const rawIdStr = rawIdArr.toString();

    if (!(response instanceof AuthenticatorAttestationResponse)) {
      throw new Error(
        "The PublicKeyCredential's response is not an instance of AuthenticatorAttestationResponse"
      );
    }

    const res = response as AuthenticatorAttestationResponse;
    const attestationObjectArr = new Uint8Array(res.attestationObject);
    const attestationObjectStr = attestationObjectArr.toString();
    const clientDataJSONArr = new Uint8Array(res.clientDataJSON);
    const clientDataJSONStr = clientDataJSONArr.toString();
    const clientExtensionResults = pubKeyCred.getClientExtensionResults();
    const jsonText = decoder.decode(clientDataJSONArr);

    const C = JSON.parse(jsonText);

    console.log("");
    console.log("C.type");
    console.log(C.type);

    if (C.type !== "webauthn.create") {
      throw new Error(
        "PublicKeyCredential's clientData doesn't represent a create operation"
      );
    }

    // replace chars that are in base64url encoding to get base64
    // encoding, then base64 decode that string
    const credChallStr = window.btoa(
      C.challenge.replace("-", "+").replace("_", "/")
    );
    if (challengeUint8.toString() !== credChallStr) {
      throw new Error(
        "PublicKeyCredential's returned challenge does not match what was sent for credential creation"
      );
    }

    if (C.origin !== rp) {
      throw new Error(
        "PublicKeyCredential's relying party doesn't match. Expected " +
          rp +
          " but received " +
          C.origin
      );
    }

    // TokenBinding
    console.log("");
    console.log("C.tokenBinding.status");
    console.log(C.tokenBinding.status);

    const hash = crypto.subtle.digest("SHA-256", res.clientDataJSON);

    // CBOR decoding
    res.attestationObject;
  } catch (e) {}

  // Sends a HTTP success code
  res.status(200).json({
    data: {
      email: body.email,
      pubKeyCred: pubKeyCred,
      success: true,
      session: session,
    },
  });
};

export default handler;
