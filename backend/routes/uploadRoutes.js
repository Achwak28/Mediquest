import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Storage configuration for PDFs
const pdfStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  }, 
  filename(req, file, cb) {
    const currentDate = new Date().toISOString().replace(/:/g, '-')
    cb(null, `${path.parse(file.originalname).name}_${currentDate}${path.extname(file.originalname)}`);
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

// File filter for PDFs
function pdfFileFilter(req, file, cb) {
  const filetypes = /pdf/;
  const mimetype = /application\/pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const isPDF = mimetype.test(file.mimetype);

  if (extname && isPDF) {
    cb(null, true);
  } else {
    cb(new Error("PDF files only!"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
const uploadSingleImage = upload.single("image");

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
}).single("pdf");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "Image size exceeds the limit (2MB)" });
      }
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/${req.file.path}`,
    });
  });
});

// Example route for handling PDF file upload
router.post("/upload-pdf", (req, res) => {
  uploadPDF(req, res, (err) => {
    if (err) {
      // Handle the upload error
      return res.status(400).json({ error: err.message });
    }

    // PDF file uploaded successfully
    res
      .status(200)
      .json({
        message: "file uploaded successfully",
        file: `/${req.file.path}`,
      });
  });
});

export default router;

