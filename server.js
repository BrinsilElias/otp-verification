const port = 8080
const cors = require('cors')
const path = require('path')
const express = require('express')
const bodyparser = require('body-parser')
const nodemailer = require('nodemailer');

const app = express()
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

require('./Connection/connection.js')
const { otpModel } = require('./Model/Otp.js')

app.use(express.static(path.join(__dirname,'/build')));
app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname,'/build/index.html')); 
});

// app.get('/', (req, res) => {
//     res.json("Server is working")
// })

// Retrieve Items
app.get('/api/otps', async (req, res) => {
    let data = await otpModel.find()
    res.json(data)
})

// Generate and save OTP
app.post('/api/generate-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    console.log(email, otp) // Generate a random 6-digit OTP
  
    // Save OTP in MongoDB
    const newOTP = new otpModel({ otp });
    await newOTP.save();
  
    // Send OTP to the user's email
    sendOTPByEmail(email, otp);
  
    res.json({ message: 'OTP generated and sent successfully' });
});

// Validate OTP
app.post('/api/validate-otp', async (req, res) => {
    const { otp } = req.body;
  
    // Check if OTP exists in the database
    const existingOTP = await otpModel.findOne({ otp });
  
    if (existingOTP) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
});

app.listen(port, () => {
    console.log(`app running on port http://localhost:${port}`)
})

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Send OTP to the user's email
async function sendOTPByEmail(email, otp) {
    // Create a Nodemailer transporter using your email credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'brinsilelias01@gmail.com',
        pass: 'annoabbkaxxotiyc',
      },
    });
  
    // Set up email data
    const mailOptions = {
      from: 'brinsilelias01@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP: ${otp}`,
    };
  
    // Send the email
    await transporter.sendMail(mailOptions);
}