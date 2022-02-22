const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;
const connectDb = async () => {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
};

module.exports = connectDb;
