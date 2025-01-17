
export const sendEmailOtpTemplate = (otp: string, otpFor: string) => {
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title> OTP VERIFICATION</title>
      </head>
      <body
        style="
          font-family: Helvetica, Arial, sans-serif;
          margin: 0px;
          padding: 0px;
          background-color: #ffffff;
        "
      >
        <table
          role="presentation"
          style="
            width: 100%;
            border-collapse: collapse;
            border: 0px;
            border-spacing: 0px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: rgb(239, 239, 239);
          "
        >
          <tbody>
            <tr>
              <td
                align="center"
                style="padding: 1rem 2rem; vertical-align: top; width: 100%"
              >
                <table
                  role="presentation"
                  style="
                    max-width: 600px;
                    border-collapse: collapse;
                    border: 0px;
                    border-spacing: 0px;
                    text-align: left;
                  "
                >
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0px 0px">
                        <div style="text-align: left">
                          <div style="padding-bottom: 20px">
                          </div>
                        </div>
                        <div
                          style="
                            padding: 20px;
                            background-color: rgb(255, 255, 255);
                          "
                        >
                          <div style="color: rgb(0, 0, 0); text-align: left">
                            <h1 style="margin: 1rem 0">Verification code</h1>
                            <p style="padding-bottom: 16px">
                              Use the following OTP to complete the procedure for ${otpFor}.
                            </p>
                            <p style="padding-bottom: 16px">
                              <strong style="font-size: 130%">${otp}</strong>
                            </p>
                            <p style="padding-bottom: 16px">
                              Validity for OTP is 3 minutes. Do not share this code with anyone.
                            </p>
                          </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
    `;
  };
  