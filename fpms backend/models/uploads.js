const mongoose = require('mongoose');

const UploadSchema = mongoose.Schema({
    facultyid: String,
    name: String,
    title: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
},
{ collection : 'Uploads',timestamps: { createdAt: 'created_at' }});

module.exports = mongoose.model('Uploads',UploadSchema);