import Document from "../models/docModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import path from "path";

const __dirname = path.resolve();
// description get all products
//route GET /api/products
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

const getDocs = asyncHandler(async (req, res) => {
 const {category} = req.query
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

 if(category){

  const countCategory = await Document.countDocuments({ ...keyword, category:`${category}`});
  const categorizedDocs = await Document.find({ ...keyword, category:`${category}`})
  .limit(pageSize)
  .skip(pageSize * (page - 1));
  res.json({ categorizedDocs, page, pages: Math.ceil(countCategory / pageSize) });
 }else {
  const count = await Document.countDocuments({ ...keyword });
  const documents = await Document.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ documents, page, pages: Math.ceil(count / pageSize) });
 }
 
   

 
});
// description get SINGLE PRODUCT BY id
//route GET /api/products/:id
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

// @desc upload pdf file
// @route GET /api/documents/:id/upload
// @access Private/Admin
const uploadFile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const file = req.file.path;
  const item = await Item.create({ name, file });
  res.status(201).json({ item });
});

// @desc download pdf file
// @route GET /api/documents/:id/download
// @access Private/Admin
const downloadFile = asyncHandler(async (req, res) => {
  console.log("enter")
  const document = await Document.findById(req.params.id);
  if (!document) {
    res.status(404);
    throw new Error("Document not Found !");
  } 
  const file = document.file;
  const filePath = path.join(__dirname, `frontend/public/${file}`);
  console.log(__dirname)
  console.log(filePath)
  res.download(filePath, file);
});

// @desc    Create a product
// @route   POST /api/products
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateDocument = asyncHandler(async (req, res) => {
  const { name, year, description, image, category } = req.body;

  const document = await Document.findById(req.params.id);

  if (document) {
    document.name = name;
    document.year = year;
    document.description = description;
    document.image = image;
    document.category = category;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error("Document not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
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
    }else {
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
