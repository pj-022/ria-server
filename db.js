const mongoose = require("mongoose")
const mongoURI  = "Your MongoDB URI"

const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
         console.log ("Connected to Mongo Successfully");
    })
}
module.exports = connectToMongo
