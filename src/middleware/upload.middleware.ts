import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
	console.log("Uploaded file:", {
		originalname: file.originalname,
		mimetype: file.mimetype,
		size: file.size,
	});

	const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

	const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

	const extension = path.extname(file.originalname).toLowerCase();

	if (
		allowedMimeTypes.includes(file.mimetype) ||
		allowedExtensions.includes(extension)
	) {
		cb(null, true);
	} else {
		cb(new Error("Only JPG, PNG and WEBP images are allowed"));
	}
};

export const upload = multer({
	storage,

	limits: {
		fileSize: 2 * 1024 * 1024,
	},

	fileFilter,
});
