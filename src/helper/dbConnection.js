const { default: mongoose } = require("mongoose");
const ConnectionString = "mongodb+srv://vibhanshusharma89636:dEikDKUN9JayL0lR@database.ackzc.mongodb.net/po";
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