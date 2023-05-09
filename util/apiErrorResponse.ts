import type { NextApiResponse } from "next";

export const apiErrorResponse = ({
  res,
  body,
  isLoggingEnabled,
  logs,
  code,
  resErrMsg: responseErrMsg,
}: {
  res: NextApiResponse;
  body: {
    email: string;
    pubKeyCred: { authenticatorAttachment: AuthenticatorAttachment; id: string; rawId: string; response: AuthenticatorAssertionResponse; type: string };
  };
  isLoggingEnabled: boolean;
  logs: Array<string>;
  code: number;
  resErrMsg: string;
}) => {
  if (isLoggingEnabled) {
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    logs.forEach((log: string) => {
      console.log(log);
    });
  }
  // Sends a HTTP bad request error code
  return res.status(code).json({ data: { body: body, error: responseErrMsg } });
};

export default apiErrorResponse;