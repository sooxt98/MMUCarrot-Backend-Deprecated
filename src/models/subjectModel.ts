import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SubjectSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    faculty_id: {
        type: String,
        required: true
    },
    coordinator_ids: {
        type: [String],
        required: true
    }
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});