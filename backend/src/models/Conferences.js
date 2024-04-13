const mongoose = require('mongoose');

const ConferenceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true }, // city + country
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pic: { type: Image, required: false },

    conferenceCreator: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "lectures" }],
});

const ConferenceModel = mongoose.model("conferences", ConferenceSchema);

module.exports = ConferenceModel;