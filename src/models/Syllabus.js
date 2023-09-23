const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  sName: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model('Syllabus', syllabusSchema);