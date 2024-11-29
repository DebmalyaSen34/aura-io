const generateEmailTemplate = (otp) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
          <tr>
            <td style="padding: 20px;">
              <h1 style="color: #4a4a4a; text-align: center;">Your One-Time Password</h1>
              <p style="font-size: 16px; text-align: center;">Thank you for using our service. Your security is important to us, which is why we use One-Time Passwords (OTP) for verification.</p>
              <div style="background-color: #ffffff; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
                <h2 style="color: #3498db; font-size: 28px; margin: 0;">Your OTP Code:</h2>
                <p style="font-size: 36px; font-weight: bold; color: #2ecc71; letter-spacing: 5px; margin: 10px 0;">${otp}</p>
              </div>
              <p style="font-size: 14px; text-align: center;">This OTP will expire in 10 minutes for security reasons. Please do not share this code with anyone.</p>
              <p style="font-size: 14px; text-align: center;">If you didn't request this OTP, please ignore this email or contact our support team if you have any concerns.</p>
              <div style="text-align: center; margin-top: 20px;">
                <p style="font-size: 12px; color: #888;">© 2023 Your Company Name. All rights reserved.</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
};

export default generateEmailTemplate;