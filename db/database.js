const mongoose = require("mongoose");

uri =
  "mongodb+srv://login:meraj123@cluster0.ctsrgbu.mongodb.net/Cluster0?retryWrites=true&w=majority";

const connectDb = () => {
  return mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB Atlas:", err);
    });
};

module.exports = connectDb;
