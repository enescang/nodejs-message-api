import express from 'express';
import MongoConnection from './src/database/database';

const app = express();

const { PORT, DB_NAME } = process.env;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

const db = MongoConnection(DB_NAME);
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('MongoDB Connected'));
