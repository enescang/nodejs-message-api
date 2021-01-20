import mongoose from 'mongoose';

// Veritabanı bağlantısı dinamik hâlde yapılmaktadır
/**
 * Veritabanı adına göre bağlantı kurulur
 * @param {strign} databaseName
 */
const DB = (databaseName) => {
    mongoose.connect(process.env.MONGO_DB + databaseName, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
    return mongoose.connection;
};

export default DB;
