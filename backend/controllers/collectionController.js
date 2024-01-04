import Collection from "../models/collectionModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// description Create new collection
//route POST /api/collections
//access Private
const createNewCollection = asyncHandler(async (req, res) => {
  const { collectionItems } = req.body;
  if (!collectionItems) {
    res.status(400);
    throw new Error("No collection item");
  } else {
    const collection = new Collection({
      collectionItems: {
        ...collectionItems,
        document: collectionItems._id,
        _id: undefined,
      },
      user: req.user._id,
      title: "New Collection",
    });

    const createdCollection = await collection.save();

    res.status(201).json(createdCollection);
  }
});

// description get collections for logged in user
//route GET /api/collections/mycollections
//access Private
const getMyCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ user: req.user._id });
  res.json(collections);
});

// description get SINGLE Collection BY id
//route GET /api/collections/:id
//access Private
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (collection) {
    res.json(collection);
  } else {
    res.status(404);
    throw new Error("Collection not found");
  }
});

// description change collection name
//route POST /api/collections/:id
//access Private
const updateCollectionTitle = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.title = title;

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } else {
    res.status(404);
    throw new Error("collection not found");
  }
});

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    await Collection.deleteOne({ _id: collection._id });
    res.json({ message: 'Collection removed' });
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});


// description update collection's title
//route PUT /api/collections/:id/title
//access Private
const changeCollectionTitle = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.title = req.body.title || collection.title;

    const updatedCollection = collection.save();
    res.status(200).json(updatedCollection);
  } else {
    req.status(400);
    throw new Error("Something went wrong! Try again");
  }
});

// description get all collections
//route GET /api/collections
//access Private/admin
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({}).populate("user", "id name");
  res.json(collections);
});

export {
  createNewCollection,
  getMyCollections,
  getCollectionById,
  deleteCollection,
  updateCollectionTitle,
  getCollections,
  changeCollectionTitle,
};
