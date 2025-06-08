// /api/comments.js
import {
    db
} from '../../lib/firebase';

export default async function handler(req, res) {
    // CORS headers for preflight and GET requests
    res.setHeader('Access-Control-Allow-Origin', 'https://portofolio-2f158.web.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const snapshot = await db.collection('comments').get();
            const comments = snapshot.docs.map(doc => doc.data());
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({
            error: `Method ${req.method} Not Allowed`
        });
    }
}