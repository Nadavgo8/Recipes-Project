const multer = require("multer");
const fs = require("fs");
const path = require("path");

const dir = path.join("public", "uploads", "recipes");
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.random().toString(36).slice(2)}${path
        .extname(file.originalname)
        .toLowerCase()}`
    ),
});
const fileFilter = (_req, file, cb) => {
  const ok = [".jpg", ".jpeg", ".png"].includes(
    path.extname(file.originalname).toLowerCase()
  );
  cb(ok ? null : new Error("Only jpg/jpeg/png allowed"), ok);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
