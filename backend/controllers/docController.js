import Document from "../models/docModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// description get all products
//route GET /api/products
//access PUBLIC
const getDocSimple = asyncHandler(async (req, res) => {
  const documents = await Document.find({});
  res.json(documents);
});

const getDocs = asyncHandler(async (req, res) => {
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


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createDocument = asyncHandler(async (req, res) => {
  const document = new Document({
    name: "Document Name",
    user: req.user._id,
    image: "/images/doc_image.png",
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
  const { name, year, description, image, category } =
    req.body;

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
    res.json({ message: 'Document removed' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
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
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({}).sort({ rating: -1 }).limit(3);

  res.json(documents);
});
export {   
  getDocs,
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  createDocumentReview,
  getTopDocuments,
  getAllFavorites,
};
