import {
    v2 as cloudinary
} from 'cloudinary';
import streamifier from 'streamifier';

// Configuration
cloudinary.config({
    cloud_name: 'dvhglqdf3',
    api_key: '549767326436656',
    api_secret: 'TIQKich54ROX0miIG_b0YOtGhiU' // Click 'View API Keys' above to copy your API secret
});

exports.uploadToCloudinary = (file, public_id) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream({
                public_id: public_id,
                resource_type: 'image',
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream); // ✅ handle buffer
    });
};