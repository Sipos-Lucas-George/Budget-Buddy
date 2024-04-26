import { Schema, model, models } from 'mongoose';

const UserSettingsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    income: {
        type: Number,
        required: [true, 'Income is required!'],
    },
    level: {
        type: Number,
        required: [true, 'Income is required!'],
    },
    individualOrHouseHold: {
        type: Number,
        required: [true, 'Individual Or HouseHold is required!'],
    },
    essentials: {
        type: Number,
        required: [true, 'Essentials is required!'],
    },
    debt: {
        type: Number,
        required: [true, 'Debt is required!'],
    },
    discretionary: {
        type: Number,
        required: [true, 'Discretionary is required!'],
    },
    savings: {
        type: Number,
        required: [true, 'Savings is required!'],
    },
    currency: {
        type: String,
        required: [true, 'Currency is required!'],
    }
});

const User_Settings = models.User_Settings || model('User_Settings', UserSettingsSchema);

export default User_Settings;
