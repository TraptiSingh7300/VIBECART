import multer from "multer";

const storage = multer.memoryStorage();

//single upload
export const singleUpload = multer({ storage }).single("file");

export const multipleUpload = multer({ storage }).array("file", 5);
