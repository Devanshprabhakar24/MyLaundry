import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'pending'],
        default: 'active'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    weightAllowance: { type: String, required: true },
    pickupsAllowed: { type: Number, required: true },
    pickupsUsed: { type: Number, default: 0 },
    weightUsed: { type: Number, default: 0 }, // in kg
    autoRenew: { type: Boolean, default: true },
    paymentMethod: {
        cardLast4: String,
        cardBrand: String,
        expiryMonth: String,
        expiryYear: String
    },
    billingAddress: {
        address: String,
        city: String,
        zipCode: String
    }
}, { timestamps: true });

// Add index for efficient queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
