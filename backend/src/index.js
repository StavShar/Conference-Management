const express = require('express')

const app = express()

require('dotenv').config();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('SERVER STARTED!')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})