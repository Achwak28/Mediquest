import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title:{
      type: String,
      required: true
    },
    collectionItems: [
      {
        name:{
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        document:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Document",
        }
       
      },
    ],
  
  },
  {
    timestamps: true,
  }
);


const Collection= mongoose.model("Collection", collectionSchema);

export default Collection;