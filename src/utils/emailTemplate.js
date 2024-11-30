const generateEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
    </head>
    <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #1a1a2e; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #16213e; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 40px 20px;">
            <h1 style="color: #a0b3ff; text-align: center; font-size: 28px; margin-bottom: 20px;">Your One-Time Password</h1>
            <p style="font-size: 16px; text-align: center; color: #c8d3ff; margin-bottom: 30px;">Welcome to AURA.IO! We are glad that hear that you are about join this wonderful community. Since security is our top most priority, here is your OTP:</p>
            <div style="background-color: #0f3460; border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #a0b3ff; font-size: 24px; margin: 0 0 15px;">Your OTP Code:</h2>
              <p style="font-size: 36px; font-weight: bold; color: #7b2cbf; letter-spacing: 5px; margin: 0; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);">${otp}</p>
            </div>
            <p style="font-size: 14px; text-align: center; color: #8d99ae; margin-bottom: 20px;">This OTP will expire in 5 minutes for security reasons. Please do not share this code with anyone.</p>
            <p style="font-size: 14px; text-align: center; color: #8d99ae; margin-bottom: 30px;">If you didn't request this OTP, please ignore this email or contact our support team if you have any concerns.</p>
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2c3e50;">
              <p style="font-size: 12px; color: #6c7a89;">&copy; 2024 aura.io. All rights reserved.</p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default generateEmailTemplate;