const mongoose = require('mongoose');

const FacultySchema = mongoose.Schema({
    email: String,
    password: String,
    name: String,
    designation: String,
},
{ collection : 'Faculty'});


const Faculty = mongoose.model('Faculty',FacultySchema);

module.exports = {
    Faculty
}
