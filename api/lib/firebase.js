import admin from 'firebase-admin';
import serviceAccount from '../../my-firebase-private-key.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = {
    db
};