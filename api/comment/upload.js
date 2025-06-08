// /api/comment/upload.js
import {
    uploadToCloudinary
} from '../../lib/cloudinary';
import {
    db
} from '../../lib/firebase';
import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage()
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({
            error: `Something went wrong: ${error.message}`
        });
    },
    onNoMatch(req, res) {
        res.status(405).json({
            error: `Method '${req.method}' Not Allowed`
        });
    },
});

apiRoute.use(upload.single('image'));

apiRoute.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://portofolio-2f158.web.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

apiRoute.post(async (req, res) => {
    const {
        username,
        content
    } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({
        error: 'No file uploaded'
    });

    try {
        const result = await uploadToCloudinary(file, username);
        const comment = {
            username,
            content,
            imgUrl: result.secure_url,
        };
        const docRef = await db.collection('comments').add(comment);
        const latestComment = await db.collection('comments').doc(docRef.id).get();
        res.status(200).json(latestComment.data());
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false,
    },
};