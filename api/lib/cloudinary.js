import {
    v2 as cloudinary
} from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: 'dvhglqdf3',
    api_key: '549767326436656',
    api_secret: 'TIQKich54ROX0miIG_b0YOtGhiU' // Click 'View API Keys' above to copy your API secret
});

async function uploadToCloudinary(fileUrl, public_id) {
    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            fileUrl, {
                public_id: public_id,
            }
        )
        .catch((error) => {
            console.log(error);
        });

    return uploadResult;
}

export {
    uploadToCloudinary
};