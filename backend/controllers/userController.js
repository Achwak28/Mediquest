import User from "../models/userModel.js";
import Document from "../models/docModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
//import validator from "email-validator"
import EmailValidator from "email-deep-validator";

const emailValidator = new EmailValidator();

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
  const minLength = 8;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  if (!password || password.length < minLength) {
    res.status(400);
    throw new Error( `Password must be at least ${minLength} characters long`);
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
    /* res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      favourites: user.favourites,
      isAdmin: user.isAdmin,
    });*/
    res.status(200).json(user);
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

const toFav1 = asyncHandler(async (req, res) => {
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

// description add and remove documents from favourite's list
//route POST /api/users/toFav
//access private
const toFav = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    _id: documentId,
    name,
    image,
    rating,
    numReviews,
    numLikes,
  } = req.body;

  const document = await Document.findById({ _id: documentId });
  const user = await User.findById(_id);

  if (user) {
    if (document) {
      const alreadyAdded = await User.findOne({
        _id,
      }).select({ favourites: { $elemMatch: { _id: documentId } } });

      if (alreadyAdded.favourites.length !== 0) {
        if( document.numLikes > 0){
          document.numLikes = Number(document.numLikes - 1);
        }else{
          document.numLikes = 0;
        }
        

        await document.save();

        const dislikedDocument = {
          name: alreadyAdded.favourites[0].name,
          image: alreadyAdded.favourites[0].image,
          _id: documentId,
          rating: alreadyAdded.favourites[0].rating,
          numReviews: alreadyAdded.favourites[0].numReviews,
          numLikes: document.numLikes,
        };

        user.favourites.pull(dislikedDocument);

        await user.save();

        const likes = document.numLikes;

        res.status(200).json({ message: "Document Removed", user, likes });
      } else {
        document.numLikes = Number(document.numLikes + 1);

        await document.save();

        const likedDocument = {
          name,
          image,
          rating,
          numReviews,
          numLikes: document.numLikes,
          _id: documentId,
        };

        user.favourites.push(likedDocument);
        await user.save();

        const likes = document.numLikes;

        res.status(201).json({ message: "Document added", user, likes });
      }
    } else {
      res.status(404);
      throw new Error("Document Not Found");
    }
  } else {
    res.status(400);
    throw new Error("something went wrong");
  }
});

const getAllFavorites = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  if (user) {
    const favouritesList = user.favourites;
    res.status(200).send(favouritesList);
  } else {
    res.status(404).send({ message: "User Not found" });
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

// forgot password recovery

// description send otp code to user email
//route PUT /api/users/send_recovery_email
//access public
function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Mediquest Password Recovery",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #75dab4;text-decoration:none;font-weight:600">MediQuest</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing MediQuest. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #75dab4;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Best Regards,<br />MediQuest</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>MediQuest Inc</p>
      <p>Algeria</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

const sendOTPcode = asyncHandler(async (req, res) => {
  const { recipient_email } = req.body;
  
  const userExists = await User.findOne({ email: recipient_email });
  
  if (!userExists) {
    res.status(404);
    throw new Error("User does not Exist!");
  }
  sendEmail(req.body)
    .then((response) =>
      res.status(200).send({ message: `Email sent succesfuly` })
    )
    .catch((error) => res.status(400).send({ message: `${error.message}` }));
});

// description update user profile
//route PUT /api/users/resetpassword
//access private
const updatePassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const minLength = 8;

  if (user) {
    if (!req.body.password || req.body.password.length < minLength) {
      res.status(400);
      throw new Error( `Password must be at least ${minLength} characters long`);
    }
    user.password = req.body.password;

    const updatedUser = await user.save();

    res.status(200).json({
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


function sendVCode({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Mediquest Verification Code",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #75dab4;text-decoration:none;font-weight:600">MediQuest</a>
    </div>
    <p style="font-size:1.1em">Hi there,</p>
    <p>Thank you for creating an account with Mediquest. Use the following confirmation code to verify your email address:</p>
    <h2 style="background: #75dab4;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Best Regards,<br />MediQuest</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>MediQuest Inc</p>
      <p>Algeria</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}
//description send code to new users
//route POST /api/users/verificationcode
//access public
const sendVerificationcode = asyncHandler(async (req, res) => {
  const { recipient_email } = req.body;
  
  const userExists = await User.findOne({ email: recipient_email });
  
  if (userExists) {
    res.status(404);
    throw new Error("User already Exists!");
  }

  sendVCode(req.body)
    .then((response) =>
      res.status(200).send({ message: `Code sent succesfuly` })
    )
    .catch((error) => res.status(400).send({ message: `${error.message}` }));
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
  sendOTPcode,
  updatePassword,
  sendVerificationcode,
};
