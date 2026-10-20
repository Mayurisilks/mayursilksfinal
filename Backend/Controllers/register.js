import User from '../models/user_registration.js';
import { sendOtp } from '../utils/sendOtp.js';
import OTP from '../models/Otp.js';
import bcrypt from 'bcrypt';

export const user_register = async (req, res) => {
  try {
    
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    await OTP.findOneAndUpdate(
      { email },
      { $set: { Otp: otp, createdAt: new Date() } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await sendOtp(email, otp);

    

    return res.status(201).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Unable to register user', error: error.message });
  }
};

export const otp_verification = async (req, res) => {
  try {
    const { Firstname, Lastname, phone, password } = req.body;

    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp ?? req.body.Otp;


    if (!email || otp === undefined || otp === null || String(otp).trim() === '') {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const savedOtp = await OTP.findOne({ email });

    if (!savedOtp || String(savedOtp.Otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await OTP.deleteOne({ _id: savedOtp._id });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ Firstname, Lastname, phone, email, password: hashedPassword   });
    await newUser.save();
    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Unable to verify OTP', error: error.message });
  }
};
export const resend_otp = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otpRecord = await OTP.findOne({ email });
    

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpRecord.Otp = otp;
    otpRecord.createdAt = new Date();
    await otpRecord.save();
    await sendOtp(email, otp);

    return res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: 'Unable to resend OTP', error: error.message });
  }
};
