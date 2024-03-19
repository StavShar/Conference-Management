const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user.js');

require('dotenv').config();
const port = process.env.PORT;
const dbURL = process.env.DATABASE_URL;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', userRouter);

async function connecttoDB() {
    try {
        console.log('Trying to connect to DB');
        mongoose.connect(dbURL);
    } catch (error) {
        console.log('Error connecting to DB');
    }

    const db = mongoose.connection

    db.on('error', error => { console.error('Failed to connect to MongoDB: ' + error) });
    db.once('open', () => { console.log('Connected to MongoDB.') });

}
connecttoDB();


app.get('/', (req, res) => {
    res.send('SERVER STARTED!')
})

app.listen(port, () => {
    console.log(`server started on port: ${port}`)
})