import mongoose from "mongoose";

const Mongo_URI = process.env.Mongo_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(Mongo_URI);
        console.log("MongoDB is connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;