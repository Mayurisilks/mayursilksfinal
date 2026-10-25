import { randomInt } from "node:crypto";
import User from "../models/user_registration.js";
import { sendOtp } from "../utils/sendOtp.js";
import OTP from "../models/Otp.js";
import bcrypt from "bcrypt";
import tempUser from "../models/temporary.js";

export const user_register = async (req, res) => {
  try {
    const { Firstname, Lastname, phone, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!Firstname || !Lastname || !phone || !password || !email) {
      return res.status(400).json({
        message: "All registration fields are required",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or phone number already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Keep registration details temporary until OTP verification.
    await tempUser.findOneAndUpdate(
      { email },
      {
        $set: {
          Firstname,
          Lastname,
          phone,
          email,
          password: hashedPassword,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    const otp = randomInt(100000, 1000000);
    const otpHash = await bcrypt.hash(String(otp), 10);

    await OTP.findOneAndUpdate(
      { email },
      { $set: { Otp: otpHash, createdAt: new Date() } },
      { upsert: true, new: true, runValidators: true }
    );

    await sendOtp(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Unable to register user",
    });
  }
};

export const otp_verification = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = String(req.body.otp ?? req.body.Otp ?? "").trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const pendingUser = await tempUser.findOne({ email });
    const savedOtp = await OTP.findOne({ email });

    if (!pendingUser || !savedOtp) {
      return res.status(400).json({
        message: "Registration expired. Please register again.",
      });
    }

    const isValidOtp = await bcrypt.compare(otp, savedOtp.Otp);

    if (!isValidOtp) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: pendingUser.email }, { phone: pendingUser.phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or phone number already registered",
      });
    }

    await User.create({
      Firstname: pendingUser.Firstname,
      Lastname: pendingUser.Lastname,
      email: pendingUser.email,
      phone: pendingUser.phone,
      password: pendingUser.password,
    });

    await tempUser.deleteOne({ _id: pendingUser._id });
    await OTP.deleteOne({ _id: savedOtp._id });

    return res.status(200).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "Unable to verify OTP",
    });
  }
};

export const resend_otp = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const pendingUser = await tempUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        message: "Registration not found. Please register again.",
      });
    }

    const otp = randomInt(100000, 1000000);
    const otpHash = await bcrypt.hash(String(otp), 10);

    await OTP.findOneAndUpdate(
      { email },
      { $set: { Otp: otpHash, createdAt: new Date() } },
      { upsert: true, new: true, runValidators: true }
    );

    await sendOtp(email, otp);

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({
      message: "Unable to resend OTP",
    });
  }
};
