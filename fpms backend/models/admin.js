const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    email: String,
    password: String,
    name: String,
    designation: String,
},
{ collection : 'Admin'});


const Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;