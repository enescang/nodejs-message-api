import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    access_token: { type: String, required: true },
    createdDate: { type: String, default: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }) },
}, { collection: 'user' });

export default mongoose.model('user', UserSchema);
