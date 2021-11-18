const multer = require("multer");
const crypto = require("crypto");
const { mkdirSync } = require("fs");

const MIME_TYPE = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

// 10 mb = 10000000
const MAX_FILE_SIZE = 10000000;

const imageUpload = (fieldPath) => {
  return multer({
    limits: { fileSize: MAX_FILE_SIZE },
    storage: multer.diskStorage({
      destination(_, __, cb) {
        mkdirSync(fieldPath, { recursive: true });
        cb(null, fieldPath);
      },
      filename(req, file, cb) {
        const ext = MIME_TYPE[file.mimetype];
        const id = crypto.randomBytes(6).toString("hex");
        const imageName = `${id}.${ext}`;
        cb(null, imageName);
      },
    }),
    fileFilter(_, file, cb) {
      const isValid = MIME_TYPE[file.mimetype];
      let error = isValid ? null : new Error("Invalid Input Type.");
      // cb(error, isValid);
      if (error !== null) {
        cb(error);
      } else {
        cb(null, true);
      }
    },
  });
};

module.exports = { MIME_TYPE, imageUpload };
