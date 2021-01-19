import express from 'express';
import { UserSchema } from '../../models';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { username } = req.query;
        const user = await UserSchema.aggregate([{
            $match: {
                username,
            },
        },
        {
            $project: {
                __v: 0,
                createdDate: 0,
                password: 0,
                access_token: 0,
            },
        },
        ]);
        if (user.length > 0) {
            res.json(user[0]);
        } else {
            res.json(`${username} ile bağlı herhangi bir kullanıcı bulunamadı`);
        }
    } catch (error) {
        res.json('Error: user/');
    }
});

router.get('/search', async (req, res) => {
    try {
        const allUser = await UserSchema.aggregate([
            {
                $project: {
                    createdDate: 0,
                    password: 0,
                    access_token: 0,
                    __v: 0,
                },
            },
        ]);
        res.json({ data: allUser });
    } catch (error) {
        res.json('Error: user/search');
    }
});

module.exports = router;
