import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    mmls_profile: {
        type: String,
        required: true
    },
    cms_cookies: {
        type: Map,
        of: String
    },
    mmls_token: {
        type: String
    },
    coordinator_ids: {
        type: Map,
        of: Boolean
    }
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});