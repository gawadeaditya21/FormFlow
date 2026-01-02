import mongoose from 'mongoose';

function connectDB() {
    return mongoose
        .connect(process.env.MONGO_URI, {dbName: "formflow"})
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

export default connectDB;