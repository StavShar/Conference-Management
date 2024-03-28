const mongoose = require('mongoose');

const ConferenceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    maxParticipants: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    durationTime: { type: String, required: true },
    date: { type: Date, required: true },
    conferencesCreator: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    //participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

// Creating a unique composite index on title and date
ConferenceSchema.index({ location: 1, date: 1 }, { unique: true });

const ConferenceModel = mongoose.model("conferences", ConferenceSchema);

module.exports = ConferenceModel;