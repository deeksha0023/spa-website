// 📁 index.js (Single File Server Code)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contactformDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  service: String,
  date: String,
  comments: String,
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', async (req, res) => {
  try {
    const { firstName, email, phone, subject, message } = req.body;
    if (!firstName || !email || !phone || !subject || !message) {
      return res.status(400).send("All fields are required.");
    }
    const newContact = new Contact({ firstName, email, phone, subject, message });
    await newContact.save();
    console.log("✅ Contact Submitted:", newContact);
    res.send('<script>alert("Message Submitted Successfully!"); window.location.href="/";</script>');
  } catch (err) {
    console.error("❌ Error in Contact Submission:", err);
    res.status(500).send('Something went wrong.');
  }
});

app.post('/appointment', async (req, res) => {
  try {
    const { firstName, email, service, date, comments } = req.body;
    if (!firstName || !email || !service || !date) {
      return res.status(400).send("All fields except comments are required.");
    }
    const newAppointment = new Appointment({ firstName, email, service, date, comments });
    await newAppointment.save();
    console.log("✅ Appointment Submitted:", newAppointment);
    res.send('<script>alert("Appointment Submitted Successfully!"); window.location.href="/";</script>');
  } catch (err) {
    console.error("❌ Error in Appointment Submission:", err);
    res.status(500).send('Something went wrong.');
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
