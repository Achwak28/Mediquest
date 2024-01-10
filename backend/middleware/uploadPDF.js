import multer from "multer";
//configure how the files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //where to store the file
    cb(null, "uploads/files/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file if it's not a pdf
  if (
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadPDF = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

export default uploadPDF;