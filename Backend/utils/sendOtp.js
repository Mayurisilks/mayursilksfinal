import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtp = async (email, otp, purpose = "Email Verification") => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing in environment variables");
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Mayuri Silks <onboarding@resend.dev>";

    let description =
      "Thank you for registering with Mayuri Silks! Use the verification code below to complete your registration.";

    if (purpose === "Password Reset") {
      description = "Use the code below to reset your password:";
    } else if (purpose === "Login Verification") {
      description = "Use the code below to sign in:";
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Mayuri Silks - ${purpose}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #550022; margin: 0;">Mayuri Silks</h1>
          </div>

          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333;">${purpose}</h2>

            <p style="color: #666; line-height: 1.6;">
              ${description}
            </p>

            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h1 style="color: #550022; font-size: 32px; margin: 0; letter-spacing: 5px;">
                ${otp}
              </h1>
            </div>

            <p style="color: #666; line-height: 1.6;">
              This code will expire in 10 minutes. If you did not request this verification, please ignore this email.
            </p>

            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Best regards,<br />
              The Mayuri Silks Team
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message || "Failed to send OTP email");
    }

    console.log("OTP email accepted by Resend:", data?.id);

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw error;
  }
};

export default sendOtp;
