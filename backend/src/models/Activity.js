import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['new_user', 'new_order', 'status_update'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;