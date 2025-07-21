const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre("save",async function(next){
   try{
     if(!(this.isModified("password"))) return next();
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(this.password,salt);
     this.password = hash;
     next();
   }
   catch(error){
    console.error(error);
    next(error);
   }
})
const ShreeUser = mongoose.model("User", userSchema);
module.exports = ShreeUser;
