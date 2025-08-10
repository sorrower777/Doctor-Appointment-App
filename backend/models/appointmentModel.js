import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorImage: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending_payment', 'confirmed', 'cancelled', 'completed'],
        default: 'pending_payment'
    },
    address: {
        type: Object,
        required: true
    },
    payment: {
        paymentId: {
            type: String,
            default: null
        },
        method: {
            type: String,
            default: null
        },
        cardLast4: {
            type: String,
            default: null
        },
        amount: {
            type: Number,
            default: null
        }
    },
    paidAt: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ""
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

// Index for better query performance
appointmentSchema.index({ userId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ status: 1 });

const appointmentModel = mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;
