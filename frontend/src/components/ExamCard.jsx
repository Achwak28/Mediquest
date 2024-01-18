import React, {useState,useEffect} from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
import { toast } from 'react-toastify';
import { AiFillHeart } from "react-icons/ai"
import Rating from './Rating'
import '../screens/exams/ExamsSCreen.css' 
import {
  useProfileMutation,
  useGetFavListQuery,
  useGetUserProfileQuery,
  useAddToFavMutation,
} from "../slices/usersApiSlice";
import { useGetDocumentsQuery } from "../slices/documentApiSlice";
import { setCredentials } from "../slices/authSlice";
 
const ExamCard = ({document}) => {
  
const [likes, setLikes] = useState(document.numLikes)


  const [addToFav] = useAddToFavMutation();

  const {_id: documentId} = document
  const dispatch = useDispatch();
  const { userInfoMediquest } = useSelector((state) => state.auth);


  const { data: userProfile, refetch, isLoadingUserProfile } = useGetUserProfileQuery();
 
  
  const [color, setColor]= useState()


  useEffect(() => {
    const found = userProfile?.favourites.find(obj => {
      return obj._id === document._id;
    }) 
    setColor(found ? "#fa3e5f": "#75dab4")
  }, [userProfile?.favourites])



  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addToFav({_id: documentId,
        name: document.name,
        image: document.image,
        rating: document.rating,
        numReviews: document.numReviews,
        numLikes: likes}).unwrap()
        refetch()
        
   if(color === "#75dab4"){ setColor("#fa3e5f")
    }else if (color === "#fa3e5f") {
      setColor( "#75dab4")
    }
    
    setLikes(res.likes)
      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
     <div className="card">
                <Link to={`/document/${document._id}`} className="product-image">
                  <Image className="product-image" src={document.image} variant="top" />
                </Link>
                <Link to={`/document/${document._id}`}>
                  <p className="product-title" style={{fontWeight: "bold", color:"white", marginBottom:"0"}}>{document.name}</p>
                </Link>
               
                <Rating value={document.rating}  />
                {/*text={`${document.numReviews} reviews`} */}
                <div className="likes mt-1 px-2">
                <FaComment   size={20}
                    color="#75dab4"
                    />
                 <span
                   style={{
                    color: "#75dab4",
                    fontSize: "24",
                    marginLeft: "0.2rem",
                    marginRight: "0.4rem",
                 
                  }}>
                  {document.numReviews}

                  </span>
                  <AiFillHeart onClick={submitHandler}
                    size={20}
                    color={color}
                    style={{  cursor:"pointer" }}
                  />
                  <span
                   style={{
                    color: `${color}`,
                    fontSize: "24",
                    marginLeft: "0.2rem",
                    cursor:"pointer"
                  }}>
                    {likes}
                  {/*document.numLikes*/}

                  </span>
                 
                </div>
              </div>
    
    </>
  )
}

export default ExamCard
