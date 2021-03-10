const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tbot');

const studyUserSchema = new mongoose.Schema({
  shames: [
    {
      description: String,
    },
  ],
  id: String,
});

const StudyUser = mongoose.model('StudyUser', studyUserSchema);

module.exports = StudyUser;
