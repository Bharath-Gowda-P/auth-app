const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

const dbConnect = require("./config/database");
dbConnect();

const user = require("./routes/user");
app.use("/api/v1", user);

app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Auth app is running in the background</h1>");
});
