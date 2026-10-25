import OTP from "../models/Otp.js";
import Session from "../models/Session.js";
import User from "../models/user_registration.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomBytes, randomInt } from "node:crypto";
import PasswordReset from "../models/PasswordReset.js";
import { sendOtp } from "../utils/sendOtp.js";

const hashResetToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const createLoginSession = async (user, jwtSecret) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await Session.create({
    userId: user._id,
    expiresAt,
  });

  const token = jwt.sign({ email: user.email }, jwtSecret, {
    subject: user._id.toString(),
    jwtid: session._id.toString(),
    expiresIn: "1h",
  });

  return token;
};

export const login = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Authentication is not configured",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = await createLoginSession(user, jwtSecret);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Unable to login:", err);
    return res.status(500).json({
      message: "Unable to login",
    });
  }
};

export const Login_with_otp = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const otp = randomInt(100000, 1000000);
      const otpHash = await bcrypt.hash(String(otp), 10);

      await OTP.findOneAndUpdate(
        { email },
        {
          $set: {
            Otp: otpHash,
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      await sendOtp(email, otp);
    }

    return res.status(200).json({
      message: "If the account exists, a login OTP has been sent",
    });
  } catch (err) {
    console.error("Unable to send login OTP:", err);
    return res.status(500).json({
      message: "Unable to send OTP",
    });
  }
};

export const Login_verification = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const otp = String(req.body?.otp ?? req.body?.Otp ?? "");

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Email and a 6-digit OTP are required",
      });
    }

    const [loginOtp, user] = await Promise.all([
      OTP.findOne({ email }),
      User.findOne({ email }),
    ]);

    if (!loginOtp || !user) {
      return res.status(401).json({
        message: "Invalid or expired OTP",
      });
    }

    // Login OTPs are stored as bcrypt hashes.
    const isValidOtp = await bcrypt.compare(otp, String(loginOtp.Otp));

    if (!isValidOtp) {
      return res.status(401).json({
        message: "Invalid or expired OTP",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Authentication is not configured",
      });
    }

    const token = await createLoginSession(user, jwtSecret);

    await OTP.deleteOne({ _id: loginOtp._id });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Unable to verify login OTP:", err);
    return res.status(500).json({
      message: "Unable to verify OTP",
    });
  }
};

export const forgot_password = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const existingReset = await PasswordReset.findOne({ email });

      if (
        !existingReset?.otpSentAt ||
        Date.now() - existingReset.otpSentAt.getTime() >= 60000
      ) {
        const otp = randomInt(100000, 1000000);
        const otpHash = await bcrypt.hash(String(otp), 10);

        const resetRecord = await PasswordReset.findOneAndUpdate(
          { email },
          {
            $set: {
              userId: user._id,
              otpHash,
              otpSentAt: new Date(),
              otpAttempts: 0,
              resetTokenHash: null,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
          },
          {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        );

        try {
          await sendOtp(email, otp);
        } catch (error) {
          await PasswordReset.deleteOne({
            _id: resetRecord._id,
            otpHash,
          });
          throw error;
        }
      }
    }

    return res.status(200).json({
      message:
        "If the account exists, password reset instructions have been sent",
    });
  } catch (err) {
    console.error("Unable to request password reset:", err);
    return res.status(500).json({
      message: "Unable to request password reset",
    });
  }
};

export const verify_reset_otp = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const otp = String(req.body?.otp ?? "");

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Email and a valid 6-digit OTP are required",
      });
    }

    const now = new Date();

    const resetRecord = await PasswordReset.findOne({
      email,
      otpHash: { $ne: null },
      otpAttempts: { $lt: 5 },
      expiresAt: { $gt: now },
    });

    if (!resetRecord) {
      return res.status(401).json({
        message: "Invalid or expired OTP. Please request a new code.",
      });
    }

    const isValidOtp = await bcrypt.compare(otp, resetRecord.otpHash);

    if (!isValidOtp) {
      await PasswordReset.updateOne(
        {
          _id: resetRecord._id,
          otpHash: resetRecord.otpHash,
          otpAttempts: { $lt: 5 },
        },
        {
          $inc: { otpAttempts: 1 },
        }
      );

      return res.status(401).json({
        message: "Incorrect OTP. Please check the code and try again.",
      });
    }

    // Create a short-lived, single-use password-reset token.
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenHash = hashResetToken(resetToken);

    const updatedRecord = await PasswordReset.updateOne(
      {
        _id: resetRecord._id,
        otpHash: resetRecord.otpHash,
        otpAttempts: { $lt: 5 },
        expiresAt: { $gt: now },
      },
      {
        $set: { resetTokenHash },
        $unset: { otpHash: 1 },
      }
    );

    if (!updatedRecord.modifiedCount) {
      return res.status(401).json({
        message:
          "OTP has expired or was already used. Please request a new code.",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (err) {
    console.error("Unable to verify password reset OTP:", err);
    return res.status(500).json({
      message: "Unable to verify OTP. Please try again.",
    });
  }
};

export const reset_password = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const resetToken =
      typeof req.body?.resetToken === "string" ? req.body.resetToken : "";

    const newPassword =
      typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        message: "Email, reset token, and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const now = new Date();
    const resetTokenHash = hashResetToken(resetToken);

    // Consume the valid reset token before changing the password.
    const resetRecord = await PasswordReset.findOneAndUpdate(
      {
        email,
        resetTokenHash,
        expiresAt: { $gt: now },
      },
      {
        $set: {
          resetTokenHash: null,
          expiresAt: now,
        },
      },
      { new: false }
    );

    if (!resetRecord) {
      return res.status(401).json({
        message:
          "Reset session is invalid or expired. Please request a new OTP.",
      });
    }

    const user = await User.findById(resetRecord.userId);

    if (!user || user.email.toLowerCase() !== email) {
      return res.status(400).json({
        message: "Unable to reset password. Please request a new OTP.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password reset successful. Please log in.",
    });
  } catch (err) {
    console.error("Unable to reset password:", err);
    return res.status(500).json({
      message: "Unable to reset password. Please try again.",
    });
  }
};
