import express from 'express';
import multer from 'multer';
import cors from 'cors';
import MongoConnection from './src/database/database';
import * as Routes from './src/routes/index';

const app = express();
const { PORT, DB_NAME } = process.env;

const formData = multer().none();

// CORS isteklerine izin veriyoruz
app.use(cors());

// multipart/form-data desteği
app.use(formData);

// Tüm Server Route Alanı >>>

app.use('/auth/', Routes.AuthRoute);
app.use('/user/', Routes.UserRoute);
app.use('/message/', Routes.MessageRoute);

// Tüm Server Route Alanı <<<

// Sunucu başlat >>>
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
// Sunucu başlat <<<

// MongoDB bağlantısını kur >>>
const db = MongoConnection(DB_NAME);
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('MongoDB Connected'));
// MongoDB bağlantısını kur <<<
