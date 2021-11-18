// sm - 640
// md - 768
// lg - 1280
const path = require("path");
const express = require("express");
const { unlink } = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const { imageUpload } = require("./image-upload");
const resizeImages = require("./resize-images");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post(
  "/upload",
  imageUpload(path.join(__dirname, "public", "images")).single("image"),
  resizeImages,
  async (req, res, next) => {
    console.log(req.images);
    res.status(200).json(req.images);
  }
);

app.use((req, res, next) => {
  next(new Error("Could not find this route."));
});

// Http error handling middleware
app.use((err, req, res, next) => {
  if (req.file) {
    unlink(req.file.path, (err) => {
      console.log("File Error", err);
    });
  }

  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      errors: {
        status: 400,
        message: err.message,
      },
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.code || 500).json({
    errors: {
      status: err.code || 500,
      message: err.message || "An unknown error occurred!",
    },
  });
});

app.listen(3000, () => {
  console.log(`App running on ${3000}`);
});
