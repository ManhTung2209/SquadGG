import {v2 as cloudinary} from "cloudinary";
import {config} from "dotenv";

config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload buffer to Cloudinary
export const uploadToCloudinary = async (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                ...options
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(buffer);
    });
};

export default cloudinary;

