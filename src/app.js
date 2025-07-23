const express = require("express");
require("dotenv").config();

const AuthRouter = require("./Routers/AuthRouter");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const DBconnection = require("./helper/dbConnection");
const ApplicationRouter = require("./Routers/Applicants");
const upload = require("../middleware/multerjs");
DBconnection();
app.use(
  cors({
    origin: "https://shreegenesisprojectfrontend.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome user");
});
app.use("/", AuthRouter);
app.use("/",ApplicationRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
