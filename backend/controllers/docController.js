import Document from "../models/docModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import path from "path";

const __dirname = path.resolve();
// description get all documents
//route GET /api/documents
//access PUBLIC
const getDocSimple = asyncHandler(async (req, res) => {
  const documents = await Document.find({});
  res.json(documents);
});

const getDocs1 = asyncHandler(async (req, res) => {
  const pageSize = 8; //process.env.PAGINATION_LIMIT
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Document.countDocuments({ ...keyword });
  const documents = await Document.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ documents, page, pages: Math.ceil(count / pageSize) });
});

// description get all documents with pagination
//route GET /api/documents
//access PUBLIC
const getDocs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const pageSize = 8; //process.env.PAGINATION_LIMIT
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  if (category) {
    const countCategory = await Document.countDocuments({
      ...keyword,
      category: `${category}`,
    });
    const categorizedDocs = await Document.find({
      ...keyword,
      category: `${category}`,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({
      categorizedDocs,
      page,
      pages: Math.ceil(countCategory / pageSize),
    });
  } else {
    const count = await Document.countDocuments({ ...keyword });
    const documents = await Document.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ documents, page, pages: Math.ceil(count / pageSize) });
  }
});

// description get all documents coresponding the filter condition
//route GET /api/documents/filter
//access PUBLIC
const filterDocuments = asyncHandler(async (req, res) => {
  
  const {year, category} = req.body
  const pageSize = 8; //process.env.PAGINATION_LIMIT
  const page = Number(req.body.pageNumber) || 1;

  const keyword = req.body.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  if (category) {
   
    const countCategory = await Document.countDocuments({
      ...keyword,
      category: `${category}`,
      year: `${year}`,
    });
    const categorizedDocs = await Document.find({
      ...keyword,
      category: `${category}`,
      year: `${year}`,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({
      categorizedDocs,
      page,
      pages: Math.ceil(countCategory / pageSize),
    });
  } else {
    const count = await Document.countDocuments({ ...keyword });
    const documents = await Document.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ documents, page, pages: Math.ceil(count / pageSize) });
  }
});
// description get SINGLE document BY id
//route GET /api/documents/:id
//access PUBLIC
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  //const document = documents.find((p) => p._id === req.params.id)
  if (document) {
    return res.json(document);
  } else {
    res.status(404);
    throw new Error("Document not Found !");
  }
  //res.status(404).json({message :"Document is not found !"})
});

// @desc download pdf file
// @route GET /api/documents/:id/download
// @access Private/Admin
const downloadFile = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    res.status(404);
    throw new Error("Document not Found !");
  }
  const file = document.file;

try {

  /*if (file === "/sample.pdf") {
    res.status(400);
    throw new Error("Sorry, no pdf file available now!");
    const filePath = path.join(__dirname, `frontend/public/${file}`);
    console.log(__dirname)
    console.log(filePath)
    res.download(filePath, file);
  } else {*/
  if (file === "/sample.pdf") {
    // Check if it's the dummy file
    res.status(404).json({ error: "Sorry, no pdf file available now!" });
  } else {
    // It's an actual file, proceed with download
    const file = document.file;
    const filePath = path.join(__dirname, `${file}`);
    res.download(filePath, file);
  }
    
  
} catch (error) {
  console.log(error)
  res.status(404);
  throw new Error("Something went wrong");
}
  
});

// @desc    Create a document
// @route   POST /api/documents
// @access  Private/Admin
const createDocument = asyncHandler(async (req, res) => {
  const document = new Document({
    name: "Document Name",
    user: req.user._id,
    image: "/images/doc_image.png",
    file: "/sample.pdf",
    year: "1",
    category: "course",
    numLikes: 0,
    numReviews: 0,
    description: "Document description",
  });

  const createdDocument = await document.save();
  res.status(201).json(createdDocument);
});

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private/Admin
const updateDocument = asyncHandler(async (req, res) => {
  const { name, year, description, image, category, file } = req.body;

  const document = await Document.findById(req.params.id);

  if (document) {
    document.name = name;
    document.year = year;
    document.description = description;
    document.image = image;
    document.category = category;
    document.file = file;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    await Document.deleteOne({ _id: document._id });
    res.json({ message: "Document removed" });
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

// @desc    Create new review
// @route   POST /api/documents/:id/reviews
// @access  Private
const createDocumentReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const document = await Document.findById(req.params.id);

  if (document) {
    const alreadyReviewed = document.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Document already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    document.reviews.push(review);

    document.numReviews = document.reviews.length;

    document.rating =
      document.reviews.reduce((acc, item) => item.rating + acc, 0) /
      document.reviews.length;

    await document.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

// @desc    Create delete comment
// @route   DELETE /api/documents/:id/reviews
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    const alreadyReviewed = document.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      const review = {
        name: req.user.name,
        rating: alreadyReviewed.rating,
        comment: alreadyReviewed.comment,
        user: req.user._id,
      };
      document.reviews.pull(alreadyReviewed);
      await document.save();
      res.status(201).json({ message: "Comment deleted", document });
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

const getAllFavorites = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const favouritesList = user.favourites;
    res.status(200).send(favouritesList);
  } catch (err) {
    throw new Error(err.message);
  }
});
// @desc    Get top rated documents
// @route   GET /api/documents/top
// @access  Public
const getTopDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({}).sort({ rating: -1 }).limit(3);

  res.json(documents);
});
export {
  getDocs,
  filterDocuments,
  getDocumentById,
  downloadFile,
  createDocument,
  updateDocument,
  deleteDocument,
  createDocumentReview,
  deleteComment,
  getTopDocuments,
  getAllFavorites,
};
