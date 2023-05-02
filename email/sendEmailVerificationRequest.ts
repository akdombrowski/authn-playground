import * as SibApiV3Sdk from "@sendinblue/client";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const sendVerReq = async (params) => {
  const { email, url, provider, theme } = params;
  const { host } = new URL(url);
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  // Configure API key authorization: apiKey
  const apiKey = apiInstance.authentications["apiKey"];

  apiKey.apiKey = process.env.EMAIL_API_KEY;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = `Sign in to ${host}`;
  sendSmtpEmail.htmlContent = html({ url, host, theme });
  sendSmtpEmail.sender = {
    name: "webauthn-playground",
    email: "no-reply@authnplay.dev",
  };
  sendSmtpEmail.to = [{ email: email }];
  //   sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
  sendSmtpEmail.bcc = [{ email: "akdflyinvee73@gmail.com", name: email }];
  //   sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
  sendSmtpEmail.headers = { accept: "application/json" };
  //   sendSmtpEmail.params = {
  //     parameter: "My param value",
  //     subject: "New Subject",
  //   };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      "Email send api called successfully. Returned data: " +
        JSON.stringify(data)
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send transac email.", { cause: error });
  }
};

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<html>
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center"
          style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Sign in to <strong>${escapedHost}</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                  target="_blank"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                  in</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          If you did not request this email you can safely ignore it.
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

export default sendVerReq;