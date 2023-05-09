import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { apiErrorResponse, convertStringToUint8Array } from "../../util";

const rpName = process.env.RP_NAME;
const rpID = process.env.RP_ID;
const DEBUG = process.env.DEBUG
  ? (process.env.DEBUG as unknown as boolean)
  : false;

const isResponseInstanceOfAAR = (response: any, isLoggingEnabled: boolean) => {
  if (!(response instanceof AuthenticatorAttestationResponse)) {
    if (isLoggingEnabled) {
      console.log(
        "response is not an isntance of AuthenticatorAttestationResponse"
      );
      console.log("response is of type: " + typeof response);
    }
    return false;
  }

  return true;
};

/**
 * Main API handler for /webauthn
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @return {*}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  // Get data submitted in request's body.
  const body = req.body;

  if (!body) {
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: false,
      logs: [],
      code: 400,
      resErrMsg: "No data found",
    });
  }

  const email = body.email;
  const pubKeyCred = body.pubKeyCred;

  if (!email) {
    const log1 = "email not found";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Email not found";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  if (!pubKeyCred) {
    const log1 = "pubKeyCred missing";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Cred missing";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  const { authenticatorAttachment, id, rawId, response, type } = pubKeyCred;

  if (!authenticatorAttachment) {
    const log1 = "authenticatorAttachment missing";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Cred's authenticatorAttachment missing";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  if (!id) {
    const log1 = "id missing";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Cred's id missing";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  if (!rawId) {
    const log1 = "rawId missing";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Cred's rawId missing";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  if (!response) {
    const log1 = "cred response missing";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Cred's response missing";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  if (!type) {
    const log1 = "type missing";
    const log2 = "body: " + body;
    const logs = [log1, log2];
    const code = 400;
    const resErrMsg = "Cred's type missing";
    return apiErrorResponse({
      res,
      body,
      isLoggingEnabled: DEBUG,
      logs,
      code,
      resErrMsg,
    });
  }

  try {
    const decoder = new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    });
    const rawIdArr = new Uint8Array(rawId);
    const rawIdStr = rawIdArr.toString();

    if (!isResponseInstanceOfAAR(response, DEBUG)) {
      const log1 =
        "PublicKeyCredential's response is not an instance of AuthenticatorAttestationResponse";
      const log2 = "body: " + body;
      const logs = [log1, log2];
      const code = 400;
      const resErrMsg =
        "The PublicKeyCredential's response is not an instance of AuthenticatorAttestationResponse";
      return apiErrorResponse({
        res,
        body,
        isLoggingEnabled: DEBUG,
        logs,
        code,
        resErrMsg,
      });
    }

    const credRes = response as AuthenticatorAttestationResponse;
    const attestationObject = credRes.attestationObject;
    const attestationObjectArr = new Uint8Array(credRes.attestationObject);
    const attestationObjectStr = attestationObjectArr.toString();
    const clientDataJSONArr = new Uint8Array(credRes.clientDataJSON);
    const clientDataJSONStr = clientDataJSONArr.toString();
    const clientExtensionResults = pubKeyCred.getClientExtensionResults();
    const jsonText = decoder.decode(clientDataJSONArr);

    const C = JSON.parse(jsonText);

    if (DEBUG) {
      console.log("");
      console.log("C.type");
      console.log(C.type);
    }

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
    const challengeUint8 = convertStringToUint8Array(
      credChallStr,
      ",",
      undefined
    );

    if (!challengeUint8) {
      throw new Error(
        "PublicKeyCredential's challenge couldn't be converted to Uint8Array"
      );
    }

    if (challengeUint8.toString() !== credChallStr) {
      throw new Error(
        "PublicKeyCredential's returned challenge does not match what was sent for credential creation"
      );
    }

    if (C.origin !== rpName) {
      throw new Error(
        "PublicKeyCredential's relying party doesn't match. Expected " +
          rpName +
          " but received " +
          C.origin
      );
    }

    if (DEBUG) {
      // TokenBinding
      console.log("");
      console.log("C.tokenBinding.status");
      console.log(C.tokenBinding.status);
    }

    const hash = crypto.subtle.digest("SHA-256", clientDataJSONArr);

    // CBOR decoding
    // attestationObject;
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
