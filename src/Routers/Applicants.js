const express = require("express");
require("dotenv").config();

const ShreeForm = require("../model/ShreeForm");
const ApplicationRouter = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helper/sendEmial");

ApplicationRouter.get("/pendingapplications", async (req, res) => {
  console.log("application");
  try {
    const updated_data = await ShreeForm.find({ status: "pending" });

    res.send(updated_data);
  } catch (error) {
    console.log(error);
  }
});
ApplicationRouter.post("/applications/:id/status", async (req, res) => {
  console.log(req.body);
  console.log(req.params);
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).send("Invalid status");
  }

  try {
    console.log(id);
    console.log(status);
    const user = await ShreeForm.findById(id);
    user.status = status;

    if (status == "rejected") {
      user.status = status;
      const updated_user = await user.save();
      await sendEmail(user.email,"Your application has been rejected please come to office");
      return res.json("Email send");
    }
    const temp_password = crypto.randomBytes(6).toString("hex");

    user.application_password = await bcrypt.hash(temp_password, 10);

    await user.save();
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || "ram",
      {
        expiresIn: "1h",
      }
    );

    const verificationLink = `http://localhost:3000/verify-password?token=${token}`;
    await sendEmail(
      user.email,
      "Application Accepted 🎉",
      `
    Congratulations! Your application has been accepted.

    Temporary Password: ${temp_password}
    Please click the link to verify and set your new password:
    ${verificationLink}
  `
    );
    res.json("Email send");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = ApplicationRouter;
