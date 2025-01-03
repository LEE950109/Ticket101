const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    name: String,
    image: String,
    region: String,
    date: String,
    location: String,
    age: String,
    price: String,
    site: String,
    link: String
}, { 
    collection: 'performance'
});

module.exports = mongoose.model('Performance', performanceSchema); 