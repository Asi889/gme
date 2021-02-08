const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    
    email: {type: String, required: true, },
    firstName: {type: String, required: true,},
    lastName: {type: String, required: true,},
    password: { type: String, required: true, minlength: 5 },
    avgRating: { type: Number, default: '0' },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    picture: String,
    // passwordCheck: { type: Number, required: true, minlength: 5 },
    
})

const User = mongoose.model('User', userSchema)

module.exports = User
