import mongoose from "mongoose";
const connectMongoDB = async () => {
	const mongoURI = process.env.MONGO_URI;
	const dbName = process.env.DB_NAME;
	try {
		const instance = await mongoose.connect(`${mongoURI}/${dbName}`);
		console.log(`MongoDB Connected: ${instance.connection.host}`);
	} catch (error) {
		throw Error(error.message);
	}
};

export default connectMongoDB;
