const sharp = require("sharp");
const path = require("path");
const { MIME_TYPE } = require("./image-upload");

const resizeImages = async (req, res, next) => {
  //   console.log(req.file);
  try {
    const ext = MIME_TYPE[req.file.mimetype];
    const fileName = req.file.filename.split(`.${ext}`)[0];
    const imagePath = `${fileName}-640x${(640 / 16) * 9}.webp`;
    const temp = await sharp(req.file.path)
      .resize(640, (640 / 16) * 9)
      .webp()
      .toFile(path.join(__dirname, "public", "images", imagePath));
    req.images = {
      original: `images/${req.file.filename}`,
      webpMd: `images/${imagePath}`,
    };
    next();
    // console.log(temp);
  } catch (error) {
    console.log(error);
    next(new Error(""));
  }
};

module.exports = resizeImages;
