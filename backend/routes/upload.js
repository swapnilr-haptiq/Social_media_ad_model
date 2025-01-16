

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();
// import Navbar from "../../frontend/src/components/Charts/Navbar";


const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      cb(null, "latest-upload.csv"); 
    },
  }),
});

router.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please upload a file." });
    }

    res.status(200).json({
      message: "File uploaded successfully.",
      filePath: path.join(__dirname, "../uploads", req.file.filename),
    });
  },
  (err, req, res, next) => {
 
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    }
   
    res.status(500).json({ error: err.message });
  }
);

module.exports = router;
