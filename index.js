const express = require("express");
const cors = require("cors");

const connectDb = require("./db/database");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));

connectDb();

app.listen(8080, () => {
  console.log("Server started");
});
