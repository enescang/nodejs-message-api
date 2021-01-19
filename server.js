import express from 'express';
import multer from 'multer';
import MongoConnection from './src/database/database';
import * as Routes from './src/routes/index';

const app = express();
const { PORT, DB_NAME } = process.env;

const formData = multer().none();

// Set the Server Routes >>>

app.use('/auth/', formData, Routes.AuthRoute);
app.use('/user/', formData, Routes.UserRoute);

app.use('/message/', formData, Routes.MessageRoute);

// Set the Server Routes <<<

// Start Server >>>
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
// Start Server <<<

// Connect to MongoDB >>>
const db = MongoConnection(DB_NAME);
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('MongoDB Connected'));
// Connect to MongoDB <<<
