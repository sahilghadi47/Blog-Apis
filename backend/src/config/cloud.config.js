import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
	path: ".env",
});
// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (localFilePath, path) => {
	try {
		if (!localFilePath) return null;
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
			folder: `Blog/${path}`,
		});
		fs.unlinkSync(localFilePath);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath);
		throw error;
	}
};

const deleteImage = async (publicId) => {
	try {
		const response = await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.log(error);
	}
};

export { uploadImage, deleteImage };
