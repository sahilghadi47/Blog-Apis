import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
	secure: true,
});

const uploadImage = async (localFilePath) => {
	try {
		if (!localFilePath) return;
		const response = await cloudinary.uploader.upload(localFilePath, {
			folder: "blog",
			resource_type: "auto",
		});
		fs.unlinkSync(localFilePath);
		return { url: response.secure_url, publicId: response.public_id };
	} catch (error) {
		fs.unlinkSync(localFilePath);
		return { error };
	}
};

const deleteImage = async (publicId) => {
	await cloudinary.uploader.destroy(publicId);
};

export { uploadImage, deleteImage };
