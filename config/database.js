const mongoose = require("mongoose");
require("dotenv").config();

 const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected successfully"))
    .catch((error) => {
      console.log(error);
      console.log("DB Connection Failed");
      process.exit(1);
    });
};

module.exports = dbConnect;