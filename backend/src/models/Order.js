import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pickup_scheduled' },
    pickupDate: { type: Date, required: true },
    estimatedDelivery: { type: Date },
    items: [String],
    total: Number,
    address: String,
    specialInstructions: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;