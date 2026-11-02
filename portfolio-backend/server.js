const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello! My server is working.');
});

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // sends to yourself
      subject:  `Portfolio Contact: ${subject}`,
      text: `From: ${name} (${email})\n\nMessage:\n${message}`
    });

    res.send('Message sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send message.');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


//hgcv msft xlks yjet