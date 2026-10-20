import express from "express";
import nodemailer from 'nodemailer';

export const sendOtp = async (email, otp, purpose = 'Email Verification') => {
try {
    // Validate credentials
    const emailUser = process.env.EMAIL_USER;
    let emailPass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
    
    if (!emailUser || !emailPass) {
      throw new Error('Email credentials not configured in environment variables. Set EMAIL_USER and EMAIL_PASS');
    }
    
    // Remove spaces from app password (Gmail includes spaces for readability)
    emailPass = emailPass.replace(/\s/g, '');
    
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Verify transporter connection before sending
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: `Mayuri Silks - ${purpose}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Mayuri Silk</h1>
          </div>
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">${purpose}</h2>
            <p style="color: #666; line-height: 1.6;">
              ${purpose === 'Password Reset' ? 'Use the code below to reset your password:' : purpose === 'Login Verification' ? 'Use the code below to sign in:' : 'Thank you for registering with Mayuri silk! Use the verification code below to complete your registration:'}
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666; line-height: 1.6;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The Mayuri Silk team            </p>
          </div>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('✗ Error sending OTP email:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

export default sendOtp;

