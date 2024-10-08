const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    maxParticipants: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true }, // date + starting time
    durationTime: { type: String, required: true },
    description: { type: String, required: true },
    lecturerName: { type: String, required: true },
    lecturerInfo: { type: String, required: true },
    lecturerPic: { type: String, required: false },
    form: { type: Array, required: false },
    answers: [{
        questionIndex: { type: Number, required: false },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
        answer: { type: String, required: false }
    }],

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    lectureCreator: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    conferenceID: { type: mongoose.Schema.Types.ObjectId, ref: "conferences", required: true }
});

// Creating a unique composite index on location and date
LectureSchema.index({ location: 1, date: 1 }, { unique: true });

const LectureModel = mongoose.model("lectures", LectureSchema);

module.exports = LectureModel;