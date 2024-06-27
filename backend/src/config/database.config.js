import mongoose from "mongoose";
const connectMongoDB = async () => {
	const mongoURI = process.env.MONGO_URI;
	try {
		const instance = await mongoose.connect(mongoURI.toString());
		console.log(`MongoDB Connected: ${instance.connection.host}`);
	} catch (error) {
		throw Error(error.message);
	}
};

export default connectMongoDB;
