import adminotp from '../models/admin.js';
import adminpassword from '../models/adminpassword.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendOtp from '../utils/sendOtp.js';

dotenv.config();

export const adminLogin = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingAdmin = await adminpassword.findOne({ email });
        if (!existingAdmin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const existingOtp = await adminotp.findOne({ email });
        const hashedOtp = await bcrypt.hash(otp, 10);
        if (existingOtp) {
            existingOtp.Otp = hashedOtp;
            existingOtp.createdAt = Date.now();
            await existingOtp.save();
        } else {
            await new adminotp({ email, Otp: hashedOtp }).save();
        }

        await sendOtp(email, otp);
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in adminLogin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyAdminOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const existingOtp = await adminotp.findOne({ email });
        if (!existingOtp) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        if (!(await bcrypt.compare(otp, existingOtp.Otp))) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Authentication is not configured' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await adminotp.deleteOne({ email });
        return res.status(200).json({ message: 'OTP verified successfully', token });
    } catch (error) {
        console.error('Error in verifyAdminOtp:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const adminwithpassword = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
        const password =
            typeof req.body?.password === 'string'
                ? req.body.password
                : typeof req.body?.pass === 'string'
                    ? req.body.pass
                    : '';

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingAdmin = await adminpassword.findOne({ email });
        if (!existingAdmin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        if (existingAdmin.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Authentication is not configured' });
        }

        const token = jwt.sign({ email: existingAdmin.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in adminwithpassword:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
