import express from 'express'
import dotenv from 'dotenv'
import path from "path";
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import collectionRoutes from './routes/collectionRoutes.js'
import docRoutes from './routes/docRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
dotenv.config() 
 

connectDB();


const port = process.env.PORT || 8000

const app = express()

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended : true}))

// so we can access req.cookies
app.use(cookieParser())

 
app.use('/api/documents', docRoutes)
app.use('/api/users', userRoutes)
app.use('/api/collections', collectionRoutes) 
app.use('/api/upload', uploadRoutes)  



// set dirname to current directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

  
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }
  

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})
