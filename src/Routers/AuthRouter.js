const express = require("express");
const ShreeUser = require("../model/ShreeUser");
const AuthRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ShreeForm = require("../model/ShreeForm");
const ShreeAdmin = require("../model/ShreeAdmin");
const secretKey = "kuchbhi";
AuthRouter.post("/submitform", async (req, res) => {
  try {
    const {
      name,
      email,
      mother_name,
      father_name,
      college_name,
      branch,
      phone_number,
      address,
    } = req.body;

    const user = await ShreeForm.findOne({ email: email });
    if (user) {
      res.send("Form is alredy sent through this email");
      return;
    }
    const new_user = new ShreeForm({
      name: name,
      mother_name: mother_name,
      father_name: father_name,
      college_name: college_name,
      branch: branch,
      phone_number: phone_number,
      address: address,
      email: email,
    });

    await new_user.save();
    res.status(200).json("User Form Submit");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

AuthRouter.post("/user/login", async (req, res) => {
  try {
    console.log(" User login");
    const { email, password } = req.body;
    console.log(password);
    const user = await ShreeUser.findOne({ email: email });

    if (!user) throw new Error("No user present accord to this information");

    const password_matching = await bcrypt.compare(password, user.password);

    console.log(password_matching);
    console.log(password_matching);
    if (!password_matching) throw new Error("please ceck the password");
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.send({ user, ok: true });
  } catch (error) {
    res.send(error.message);
  }
});
AuthRouter.post("/user/signup", async (req, res) => {
  try {
    console.log("User Singup");
    const { name, email, password } = req.body;

    const exist_user = await ShreeUser.findOne({ email: email });
    if (exist_user) throw new Error("email alredy exisit");
    const data = new ShreeUser({
      name: name,
      email: email,
      password: password,
    });

    const saved_user = await data.save();
    const token = jwt.sign({ _id: saved_user._id }, secretKey, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.send({ saved_user, ok: true });
  } catch (error) {
    res.send(error.message);
  }
});

AuthRouter.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await ShreeAdmin.findOne({ email: email });

    if (!admin) {
      res.send("No admin Acc* this email ID");
      throw new Error("No admin exisit according to thie emailid");
    }
    const password_matching = bcrypt.compare(password, admin.password);
    if (!password) throw new Error("The password is incorrect");
    const token = jwt.sign({ _id: admin._id }, secretKey, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.send({ admin, ok: true });
  } catch (error) {
    console.log(error);
  }
});
AuthRouter.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`${name} ${email}`);
    const exist_admin = await ShreeAdmin.findOne({ email: email });
    if (exist_admin) throw new Error("Email already exist");
    const admin_data = new ShreeAdmin({
      name: name,
      email: email,
      password: password,
    });
    const saved_admin_data = await admin_data.save();
    const token = jwt.sign({ _id: saved_admin_data._id }, secretKey, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.send({ saved_admin_data, ok: true });
  } catch (error) {
    console.log(error);
  }
});
AuthRouter.post("/logout", (req, res) => {
  try {
    console.log("logout");
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.status(200).send("Logout successful.");
  } catch (err) {
    console.log(error);
  }
});
AuthRouter.post("/set-password", async (req, res) => {
  try {
    const { token, tempPassword, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await ShreeForm.findById(decoded.id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      const isMatch = await bcrypt.compare(tempPassword, user.application_password);
      if (!isMatch)
        return res.status(401).json({ msg: "Invalid temporary password" });

      user.final_password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ msg: "Password updated successfully" });
    } catch (err) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }
  } catch (err) {}
});
module.exports = AuthRouter;
