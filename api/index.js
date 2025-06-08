import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
import cors from 'cors';
import multer from 'multer'; // ✅ ADD THIS
import {
    uploadToCloudinary
} from './lib/cloudinary';
import {
    db
} from './lib/firebase';

app.use(cors({
    origin: '*'
}));

app.use(express.json());

// Setup multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage
});

// ✅ Upload endpoint
app.post('/comment/upload', upload.single('image'), async (req, res) => {
    const file = req.file; // image file
    const username = req.body.username;
    const content = req.body.content;

    if (!file) {
        return res.status(400).json({
            error: 'No file uploaded'
        });
    }

    // Upload image to Cloudinary
    try {
        const result = await uploadToCloudinary(file, username); // return Object that has {securel_url} 

        // Create a new document in Firestore
        const comment = {
            username: username,
            content: content,
            imgUrl: result.secure_url,
        }
        const docRef = await db.collection('comments').add(comment); // return Object but the real data is on docRef.data

        // Get the latest comment
        const latestComment = await db.collection('comments').doc(docRef.id).get();
        res.status(200).json(latestComment.data());
        res.setHeader('Access-Control-Allow-Origin', '*');

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/comments', async (req, res) => {
    const comments = await db.collection('comments').get();
    res.status(200).json(comments.docs.map(doc => doc.data()));
    res.setHeader('Access-Control-Allow-Origin', '*');
});

app.get('/', (req, res) => {
    res.status(200).send("Hello World");
})

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;