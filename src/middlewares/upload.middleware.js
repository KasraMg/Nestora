const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;

    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("فقط تصویر مجاز است (jpeg, jpg, png, webp, gif)"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  single: upload.single.bind(upload),
  array: upload.array.bind(upload),
  fields: upload.fields.bind(upload),
  upload,
};
