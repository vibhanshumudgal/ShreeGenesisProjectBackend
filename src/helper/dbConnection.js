const { default: mongoose } = require("mongoose");
require("dotenv").config();
const ConnectionString = process.env.CONNECTION_STRING ;
const DBconnection = async ()=>{
  try{
     await mongoose.connect(ConnectionString);
     console.log("Succes DB Connected");
  }
  catch(Error){
    console.error(error);
  }
}
module.exports = DBconnection;