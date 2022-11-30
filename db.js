const mongoose = require("mongoose")
const mongoURI  = "<Your MongoDB Atlas URI>"

const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
         console.log ("Connected to Mongo Successfully");
    })
}
module.exports = connectToMongo
