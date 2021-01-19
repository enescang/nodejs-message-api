import express from 'express';
import mongoose from 'mongoose';
import { UserSchema, MessageSchema } from '../../models';

const router = express.Router();
const { ObjectId } = mongoose.Types;

router.post('/send', async (req, res) => {
    try {
        const { user, text, senderId } = req.body;
        // Check message sender user is exists
        await UserSchema.findById(senderId).orFail();

        // Check message receiver user is exists
        const receiverUser = await UserSchema.findById(user).orFail();

        // If users are exists create a messge object
        const message = new MessageSchema({
            messageSender: senderId,
            messageReceiver: user,
            text,
        });
        const saveMessage = await message.save();

        const responseMessage = {
            text,
            user: {
                _id: receiverUser._id,
                username: receiverUser.username,
                email: receiverUser.email,
            },
            sent: saveMessage.sent,
        };
        res.json(responseMessage);
    } catch (error) {
        res.json('Error: message/send');
    }
});

// Bir kullanıcının gönderdiği mesajlar
router.get('/with_user', async (req, res) => {
    try {
        const { user } = req.query;
        const messages = await MessageSchema.aggregate([
            {
                $match: {
                    messageSender: ObjectId(user),
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'messageReceiver',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                    messageSender: 0,
                    messageReceiver: 0,
                    'user.createdDate': 0,
                    'user.password': 0,
                    'user.access_token': 0,
                    'user.__v': 0,
                },
            },
        ]);
        res.json({ data: messages });
    } catch (error) {
        res.json(`Error: message/with_user${error}`);
    }
});

// bir kullanıcıya gelen son mesajlar
router.get('/convos', async (req, res) => {
    try {
        const { user } = req.query;

        const messages = await MessageSchema.aggregate([
            {
                $match: {
                    messageReceiver: ObjectId(user),
                },
            },
            {
                $group: {
                    _id: '$messageSender',
                    user: { $last: '$messageSender' },
                    sent: { $last: '$sent' },
                    text: { $last: '$text' },
                },
            },
            {
                $project: {
                    last_message: {
                        user: '$user',
                        text: '$text',
                        sent: '$sent',
                    },
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'last_message.user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    _id: 0,
                    'user.createdDate': 0,
                    'user.password': 0,
                    'user.access_token': 0,
                    'user.__v': 0,
                },
            },
            {
                $sort: {
                    'last_message.sent': -1,
                },
            },
        ]);

        res.json({ data: messages });
    } catch (error) {
        res.json(`Error: message/convos${error}`);
    }
});

module.exports = router;
