const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer-config'); // Adjust the path based on your folder structure
const backendURL = 'http://localhost:3001';

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    console.log('isssssssssssssssss :', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the URL of the uploaded file

    const fileURL = backendURL+`/uploads/${req.file.filename}`;
    console.log('fileURL:', fileURL);
    res.status(200).json({ fileURL: fileURL });
    return fileURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

module.exports = { pictureRouter: router };;
