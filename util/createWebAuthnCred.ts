import { convertStringToUint8Array } from "./convertStringToUint8Array";

export const createWebAuthnPubKeyCred = async ({
  userIDArrayStr,
  challengeStr,
  email,
  rpName,
}: {
  userIDArrayStr: string;
  challengeStr: string;
  email: string;
  rpName: string;
}): Promise<PublicKeyCredential | null> => {
  const userID = await convertStringToUint8Array(userIDArrayStr, ",", 10);
  const challenge = await convertStringToUint8Array(challengeStr, ",", 10);

  if (!userID) {
    throw new Error(
      "Didn't get a userID or one that could be converted to a Uint8Array"
    );
  }

  if (!challenge) {
    throw new Error("Missing challenge");
  }

  const pubKeyOpt: PublicKeyCredentialCreationOptions = {
    // The challenge is produced by the server; see the Security Considerations
    challenge: challenge,

    // Relying Party:
    rp: {
      name: rpName,
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
      } as PublicKeyCredentialParameters,
    ],

    authenticatorSelection: {
      // UV required.
      userVerification: "required" as UserVerificationRequirement,
    },

    timeout: 300000, // 5 minutes
    excludeCredentials: [
      // Don’t re-register any authenticator that has one of these credentials
    ],

    // Make excludeCredentials check backwards compatible with credentials registered with U2F
    extensions: {},
  };

  try {
    const pubKeyCred = await createPubKey(pubKeyOpt);
    return pubKeyCred as PublicKeyCredential;
  } catch (e: any) {
    console.error("failed to create webauthn cred");
    console.error(e.message);
    return null;
  }
};

export const createPubKey = async (
  pubKeyOpt: PublicKeyCredentialCreationOptions
) => {
  // Note: The following call will cause the authenticator to display UI.
  return navigator.credentials.create({ publicKey: pubKeyOpt });
};

export default createWebAuthnPubKeyCred;
