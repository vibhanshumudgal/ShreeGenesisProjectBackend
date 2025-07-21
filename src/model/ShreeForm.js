const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  branch: { type: String, required: true, trim: true },
  father_name: { type: String, required: true, trim: true },
  mother_name: { type: String, required: true, trim: true },
  college_name: { type: String, required: true, trim: true },
  phone_number: { type: Number, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  application_password: { type: String ,default:""},
  isVerified: { type: Boolean, default: false },
  final_password: { type: String ,default:""},
});

const ShreeForm = mongoose.model("Form", formSchema);
module.exports = ShreeForm;
