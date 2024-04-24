import { Schema, model, models } from 'mongoose';

const ExpenseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
    },
    type: {
        type: String,
        required: [true, 'Type is required!'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required!'],
    },
    pending: {
        type: Boolean,
        default: false
    }
});

const Expense = models.Expense || model('Expense', ExpenseSchema);

export default Expense;