import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../../models/index';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {
            email,
            username,
            password,
        } = req.body;
        const { SECRET_KEY, SECRET_ALGORITHM } = process.env;

        const isExists = await UserSchema.findOne({ email });

        // Email daha önce kayıtlı değilse
        if (isExists === null) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userAccessToken = jwt.sign({ email }, SECRET_KEY, {
                algorithm: SECRET_ALGORITHM,
            });

            // Yeni bir kullanıcı oluştur
            const user = new UserSchema({
                email,
                username,
                password: hashedPassword,
                access_token: userAccessToken,
            });
            const saveUser = await user.save();

            // Yanıt mesajı oluştur
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

        // Kullanıcıyı email ya da username üzerinden kontrol et
        if ((email != null || username != null) && password != null) {
            const user = await UserSchema.findOne({
                $or: [{
                    email,
                }, {
                    username,
                }],
            }).orFail();

            // Şifre doğruluğunu bcrypt ile kontrol et
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
            // Gerekli alanlar dolu değil ise
        } else {
            res.json('Lütfen gerekli tüm alanları doldurunuz.');
        }
    } catch (error) {
        res.json('Böyle bir kullanıcı bulunamadı');
    }
});

module.exports = router;
