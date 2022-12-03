const mongoose = require("mongoose")
const mongoURI  = "mongodb+srv://mongouser:mongokimkc@cluster0.9nbsswg.mongodb.net/RIA?retryWrites=true&w=majority"

const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
         console.log ("Connected to Mongo Successfully");
    })
}
module.exports = connectToMongo
