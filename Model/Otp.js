const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema(
    {
        otp: Number,
    }
)

const otpModel = mongoose.model(
    "Otps", otpSchema
)

module.exports = {otpModel}