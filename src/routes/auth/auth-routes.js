import express from 'express';
import bcrypt from 'bcrypt';
import { UserSchema } from '../../models/index';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {
            email,
            username,
            password,
        } = req.body;

        const isExists = await UserSchema.findOne({
            email,
        });
        // Check if email is exists on database
        if (isExists === null) {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new UserSchema({
                email,
                username,
                password: hashedPassword,
                access_token: 'example_access_token',
            });
            const saveUser = await user.save();

            // Create response message
            const profile = {
                profile: {
                    _id: saveUser._id,
                    username: saveUser.username,
                    email: saveUser.email,
                },
                access_token: saveUser.access_token,
            };
            res.json(profile);
        } else {
            res.json('Bu email adresi zaten kayıtlı.');
        }
    } catch (error) {
        res.json(`Error: auth/register${error}`);
    }
});

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            username,
            password,
        } = req.body;

        // Check user with email
        if ((email != null || username != null) && password != null) {
            const user = await UserSchema.findOne({
                $or: [{
                    email,
                }, {
                    username,
                }],
            }).orFail();
            // Check if password is correct
            const userPassword = await bcrypt.compare(password, user.password);
            if (userPassword === true) {
                const responseMessage = {
                    profile: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                    },
                    access_token: user.access_token,
                };
                res.json(responseMessage);
            } else {
                res.json('Şifrenizi hatalı girdiniz');
            }
        } else {
            res.json('Lütfen gerekli tüm alanları doldurunuz.');
        }
    } catch (error) {
        res.json('Böyle bir kullanıcı bulunamadı');
    }
});

module.exports = router;
