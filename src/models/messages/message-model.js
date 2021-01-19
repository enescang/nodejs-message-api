import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageSchema = new Schema({
    messageSender: { type: Schema.Types.ObjectId, required: true },
    messageReceiver: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    sent: { type: Date, default: new Date() },
}, { collection: 'messages' });

export default mongoose.model('messages', MessageSchema);
