const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gigSchema = new Schema({
    gigMakerID: { type: Schema.Types.ObjectId, ref: "User" },
    gigTakerID: { type: Schema.Types.ObjectId, ref: "User" },
    category: String,
    description: String,
    created: { type: Date, default: Date.now },
    dueDate: { type: Date, default: () => new Date(+new Date() + 21 * 24 * 60 * 60 * 1000) },
    expirationDate: { type: Date, default: () => new Date(+new Date() + 21 * 24 * 60 * 60 * 1000) },
    // location: String,
    location: {
        name: String,
        latitude: String,
        longitude: String
    },
    status: { type: String, default: 'no taker yet' },
    cost: Number
})

const Gig = mongoose.model("Gig", gigSchema)
module.exports = Gig