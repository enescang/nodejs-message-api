import mongoose from 'mongoose';

// Create mongoDB connection with dynamic system
/**
 * Set databaseName for connection mongoose with selected database name
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
