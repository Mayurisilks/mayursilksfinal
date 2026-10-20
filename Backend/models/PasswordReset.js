import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    otpHash: {
        type: String,
        default: null,
    },
    otpSentAt: {
        type: Date,
        default: null,
    },
    otpAttempts: {
        type: Number,
        default: 0,
    },
    resetTokenHash: {
        type: String,
        default: null,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
}, { timestamps: true });

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
export default PasswordReset;