export const isWebAuthnAvail = async () => {
  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  if (
    window.PublicKeyCredential &&
    PublicKeyCredential.isConditionalMediationAvailable
  ) {
    // Check if conditional mediation is available.
    const isCMA = await PublicKeyCredential.isConditionalMediationAvailable();
    if (isCMA) {
      // Call WebAuthn authentication
      return true;
    }
  }
  return false;
};

export default isWebAuthnAvail;
