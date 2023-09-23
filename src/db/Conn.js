const mongoose = require("mongoose");

const dburl = "mongodb+srv://mrityunjay_kr23:2923@cluster0.wywvqt2.mongodb.net/pdf_maker?retryWrites=true&w=majority";

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});