import monngoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Document from "./models/docModel.js"
import users from "./data/users.js";
import documents from "./data/documents.js";
import connectDB from './config/db.js'

dotenv.config();

connectDB();
  

const importData = async () => {
    try {
        
        await User.deleteMany()
        await Document.deleteMany()

        const createdUsers = await User.insertMany(users)
        const adminUser = createdUsers[0]._id

        const sampleDocuments = documents.map((document) => {
            return {...document, user : adminUser}
        })
        
        await Document.insertMany(sampleDocuments);
        console.log('data inserted successfully !')
        process.exit()
    } catch (error) {
        console.log(`error message ${error.message}`)
        process.exit(1)
    }
}

const destroyData = async () =>{
    try {
        
        await User.deleteMany()
        await Document.deleteMany()
        
        console.log('data has been destroyed')
        process.exit()
    } catch (error) {
        console.log(`error message ${error.message}`)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData();
  }
  