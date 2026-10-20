import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Session = mongoose.model('Session', sessionSchema);
export default Session;