import React from "react";
import { useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Button, Form } from "react-bootstrap";
import { IoMdEye } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import Rating from "../components/Rating";
import { useGetDocumentDetailsQuery, useCreateReviewMutation } from "../slices/documentApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message"
import Meta from "../components/Meta"

const DocumentScreen = () => {
  const { id: documentId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const navigate = useNavigate();


  const {
    data: document,
    isLoading,
    refetch,
    isError,
  } = useGetDocumentDetailsQuery(documentId);

  

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

    const submitHandler = async (e) => {
      e.preventDefault();
  
      try {
        await createReview({
          documentId,
          rating,
          comment,
        }).unwrap();
        refetch();
        setRating(0);
        setComment('');
        toast.success('Review created successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };  

  return (
    <>
    <div style={{backgroundColor:"white",  padding: "2rem 5rem",}}>
      <Link className="btn btn-light my-3" to="/exams">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        
        <Message variant="danger">{
          isError?.data?.message || isError?.error
          
          }</Message>
       
      ) : (
        <>
        <Meta title={document.name}/>
        <Row style={{
          padding: "2rem 5rem",
          color: "black",
          backgroundColor:"white"
        }}>
          <Col md={6}>
            <Image src={document.image} alt={document.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{document.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={document.rating}
                  text={`${document.numReviews} reviews`}
                />
              </ListGroup.Item>
         
              <ListGroup.Item>
                Description: {document.description}
              </ListGroup.Item>
              <ListGroup.Item>
                <IoMdEye color="rgb(72 175 140)" size={40} style={{marginRight:"1rem",cursor:"pointer"}} />
                <FaDownload  color="rgb(72 175 140)" size={28} style={{cursor:"pointer"}} />
              </ListGroup.Item>
            </ListGroup>
          </Col>
          
        </Row>
        <Row className='review' style={{
          padding: "2rem 5rem",
          color: "black",
          margin:"auto"
        }}>
            <Col md={10}>
              <h2>Reviews</h2>
              {document.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {document.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                 
                ))}
                <ListGroup.Item>
                  <h2>Write a Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfoMediquest ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                        style={{
                          marginTop: "1rem",
                          backgroundColor: "#75D4B4",
                          border: "none",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          
        </>
      )}
      </div>
    </>
  );
};

export default DocumentScreen;
