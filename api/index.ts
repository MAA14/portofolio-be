require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer'); // ✅ ADD THIS
const {
    uploadToCloudinary
} = require('./lib/cloudinary');

app.use(cors());
app.use(express.json());

// Setup multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage
});

// ✅ Upload endpoint
app.post('/upload', async (req, res) => {
    const file = req.file;
    const public_id = req.body.public_id;

    if (!file) {
        return res.status(400).json({
            error: 'No file uploaded'
        });
    }

    try {
        const result = await uploadToCloudinary(file, public_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.status(200).send("Hello World");
})

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
