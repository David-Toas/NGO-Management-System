import transporter from "../utils/mailer.js";

export const sendWelcomeMail = async ({ name, email }) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Welcome to Our NGO",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2D6A4F;">Welcome, ${name}!</h2>
        <p>Thank you for registering with our NGO Management System.</p>
        <p>Your account has been created successfully.
           You can now log in and get started.</p>
        <a href="${process.env.APP_URL}/login"
           style="background:#2D6A4F; color:white; padding:10px 20px;
                  text-decoration:none; border-radius:5px;">
          Login to Your Account
        </a>
        <p style="margin-top:20px; color:#888;">
          If you did not register, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendForgotPasswordMail = async ({ name, email, resetToken }) => {
  const resetURL = `${process.env.APP_BASE_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2D6A4F;">Password Reset</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password.
           Click the button below to proceed:</p>
        <a href="${resetURL}"
           style="background:#2D6A4F; color:white; padding:10px 20px;
                  text-decoration:none; border-radius:5px;">
          Reset My Password
        </a>
        <p style="margin-top:15px;">
          This link expires in <strong>15 minutes</strong>.
        </p>
        <p style="color:#888;">
          If you didn't request this, ignore this email.
          Your password will remain unchanged.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendDonationConfirmationMail = async ({
  name,
  email,
  amount,
  projectName,
  reference,
}) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Donation Received - Thank You!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2D6A4F;">Thank You for Your Donation!</h2>
        <p>Dear ${name},</p>
        <p>We have successfully received your donation.
           Here are your details:</p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <tr style="background:#D8F3DC;">
            <td style="padding:10px; border:1px solid #B7E4C7;">
              <strong>Amount</strong>
            </td>
            <td style="padding:10px; border:1px solid #B7E4C7;">
              NGN ${amount.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #B7E4C7;">
              <strong>Project</strong>
            </td>
            <td style="padding:10px; border:1px solid #B7E4C7;">
              ${projectName || "General Fund"}
            </td>
          </tr>
          <tr style="background:#D8F3DC;">
            <td style="padding:10px; border:1px solid #B7E4C7;">
              <strong>Reference</strong>
            </td>
            <td style="padding:10px; border:1px solid #B7E4C7;">
              ${reference}
            </td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #B7E4C7;">
              <strong>Date</strong>
            </td>
            <td style="padding:10px; border:1px solid #B7E4C7;">
              ${new Date().toDateString()}
            </td>
          </tr>
        </table>

        <p>Your generosity is making a real difference.
           We will keep you updated on how your donation is being used.</p>
        <p style="color:#888; font-size:12px;">
          This is an automated email. Please do not reply directly.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
