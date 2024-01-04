import User from "../models/userModel.js";
import Document from "../models/docModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// description login user
//route POST /api/users/login
//access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      favourites: user.favourites,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// description register user
//route POST /api/users
//access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    image: "/images/user_image.png",
    favourites: [],
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      favourites: user.favourites,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// description logout user
//route POST /api/users/logout
//access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwtMediquest", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged Out Successfully !" });
});

// description get user profile
//route GET /api/users/profile
//access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      favourites: user.favourites,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// description update user profile
//route PUT /api/users/profile
//access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) { 
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.image = req.body.image || user.image;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: user.image,
      favourites: user.favourites,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const toFav = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { documentId } = req.body;
  console.log(documentId);

  try {
    const user = await User.findById(_id);

    const alreadyAdded = user.favourites.find(
      (id) => id.toString() === documentId
    );
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { favourites: documentId },
        },
        {
          new: true,
        }
      );

      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        favourites: user.favourites,
        isAdmin: user.isAdmin,
      });
    } else {
      user.favourites.push(documentId);
      await user.save();
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        favourites: user.favourites,
        isAdmin: user.isAdmin, 
      });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

const getAllFavorites = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const { favourites } = user;
    const favouritesList = user.favourites;
    res.status(200).send(favourites);
  } catch (err) {
    throw new Error(err.message);
  }
});

// ADMIN CONTROLLERS

// description get all users
//route GET /api/users
//access private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// description get user bu ID
//route GET /api/users/:id
//access private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// description delete user
//route DELETE /api/users/:id
//access private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// description upadte user
//route PUT /api/users/:id
//access private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  toFav,
  getAllFavorites,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
