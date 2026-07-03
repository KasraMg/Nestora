const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  cityId: Number,
  cityName: String, 
  provinceId: Number,
});

module.exports = mongoose.model('City', citySchema);