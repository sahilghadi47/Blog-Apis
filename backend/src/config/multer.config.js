import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "backend/public/temp");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const fileupload = multer({ storage: storage });

export default fileupload;
