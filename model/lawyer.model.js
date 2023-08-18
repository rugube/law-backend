const mongoose = require('mongoose');
const lawyerSchema = mongoose.Schema({
   name: String,
   email: String,
   password: String,
   address: String,
   bio: String,
   skills: [String],
   profession: String,
   gender: String,
   phone: Number,
   image: String,
   price: String,
   languages: [String],
   rating: Number,
   experience: String,
   Rank: Number

}, { timestamps: true })
const LawyerModel = mongoose.model('lawyer', lawyerSchema);
module.exports = LawyerModel;