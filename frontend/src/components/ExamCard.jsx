import React from 'react'
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
import {useAddToFavMutation} from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice";
 
const ExamCard = ({document}) => {

  const [addToFav] = useAddToFavMutation();

  const {_id: documentId} = document
  const dispatch = useDispatch();
  const { userInfoMediquest } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addToFav({documentId}).unwrap()
      dispatch(setCredentials({ ...res }));
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
                    color="#75dab4"
                    style={{  cursor:"pointer" }}
                  />
                  <span
                   style={{
                    color: "#75dab4",
                    fontSize: "24",
                    marginLeft: "0.2rem",
                    cursor:"pointer"
                  }}>
                  {document.numLikes}

                  </span>
                 
                </div>
              </div>
    
    </>
  )
}

export default ExamCard
