import OTP from '../models/Otp.js';
import Session from '../models/Session.js';
import User from '../models/user_registration.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import PasswordReset from '../models/PasswordReset.js';
import { sendOtp } from '../utils/sendOtp.js';

const hashResetToken = (token) => createHash('sha256').update(token).digest('hex');

const createLoginSession = async (user, jwtSecret) => {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const session = await Session.create({ userId: user._id, expiresAt });
    const token = jwt.sign({ email: user.email }, jwtSecret, {
        subject: user._id.toString(),
        jwtid: session._id.toString(),
        expiresIn: '1h',
    });

    return token;
};

export const login = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const password = typeof req.body?.password === 'string' ? req.body.password : '';
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'Authentication is not configured' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = await createLoginSession(user, jwtSecret);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                Firstname: user.Firstname,
                Lastname: user.Lastname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Unable to login:', err);
        return res.status(500).json({ message: 'Unable to login' });
    }
};

export const Login_with_otp = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (user) {
            const otp = randomInt(100000, 1000000);
            await OTP.findOneAndUpdate(
                { email },
                { $set: { Otp: otp, createdAt: new Date() } },
                { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
            );
            await sendOtp(email, otp);
        }

        return res.status(200).json({ message: 'If the account exists, a login OTP has been sent' });
    } catch (err) {
        console.error('Unable to send login OTP:', err);
        return res.status(500).json({ message: 'Unable to send OTP' });
    }
};

export const Login_verification = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const otp = req.body?.otp ?? req.body?.Otp;
        if (!email || !/^\d{6}$/.test(String(otp ?? ''))) {
            return res.status(400).json({ message: 'Email and a 6-digit OTP are required' });
        }

        const [loginOtp, user] = await Promise.all([
            OTP.findOne({ email }),
            User.findOne({ email }),
        ]);
        if (!loginOtp || !user || String(loginOtp.Otp) !== String(otp)) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'Authentication is not configured' });
        }

        const token = await createLoginSession(user, jwtSecret);
        await OTP.deleteOne({ _id: loginOtp._id });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                Firstname: user.Firstname,
                Lastname: user.Lastname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Unable to verify login OTP:', err);
        return res.status(500).json({ message: 'Unable to verify OTP' });
    }
};
export const forgot_password = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (user) {
            const existingReset = await PasswordReset.findOne({ email });
            if (!existingReset?.otpSentAt || Date.now() - existingReset.otpSentAt.getTime() >= 60000) {
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
                    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
                );

                try {
                    await sendOtp(email, otp);
                } catch (error) {
                    await PasswordReset.deleteOne({ _id: resetRecord._id, otpHash });
                    throw error;
                }
            }
        }

        return res.status(200).json({
            message: 'If the account exists, password reset instructions have been sent',
        });
    } catch (err) {
        console.error('Unable to request password reset:', err);
        return res.status(500).json({ message: 'Unable to request password reset' });
    }
};

export const verify_reset_otp = async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const otp = req.body?.otp;
        const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
        if (!email || !/^\d{6}$/.test(String(otp ?? '')) || newPassword.length < 8) {
            return res.status(400).json({
                message: 'Email, a 6-digit OTP, and a password with at least 8 characters are required',
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
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }
        if (!(await bcrypt.compare(String(otp), resetRecord.otpHash))) {
            await PasswordReset.updateOne(
                { _id: resetRecord._id, otpHash: resetRecord.otpHash, otpAttempts: { $lt: 5 } },
                { $inc: { otpAttempts: 1 } }
            );
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const consumeResult = await PasswordReset.updateOne(
            {
                _id: resetRecord._id,
                otpHash: resetRecord.otpHash,
                otpAttempts: { $lt: 5 },
                expiresAt: { $gt: now },
            },
            {
                $set: { expiresAt: new Date() },
                $unset: { otpHash: 1, resetTokenHash: 1 },
            }
        );
        if (!consumeResult.modifiedCount) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        const passwordUpdate = await User.updateOne(
            { _id: resetRecord.userId },
            { $set: { password: hashedPassword } }
        );
        if (!passwordUpdate.matchedCount) {
            console.error('Unable to reset password: user does not exist');
            return res.status(404).json({ message: 'Unable to reset password' });
        }

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('Unable to reset password after OTP verification:', err);
        return res.status(500).json({ message: 'Unable to reset password' });
    }
};

