import mongoose from "mongoose";

const reviewSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    comment:{
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const docSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name:{
        type: String,
        required:true
    },
    year:{
        type: String,
        required:true
    },
    image:{ 
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    reviews:[reviewSchema],
    rating:{
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    numLikes: {
        type: Number,
        required: true,
        default: 0
    }

}, {
    timestamps: true,
})

const Document = mongoose.model("Document", docSchema);

export default Document;