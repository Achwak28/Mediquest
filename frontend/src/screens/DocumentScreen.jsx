import React from "react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaFolderPlus } from "react-icons/fa";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import SpinnerDownload from 'react-bootstrap/Spinner';
import { IoMdEye } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Rating from "../components/Rating";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  useGetDocumentDetailsQuery,
  useCreateReviewMutation,
  useDeleteCommentMutation,
  useGetDownloadDocumentQuery,
  useDownloadDocumentMutation,
} from "../slices/documentApiSlice";
import {
  useCreateCollectionMutation,
  useAddMoreDocsMutation,
  useGetMyCollectionsQuery,
} from "../slices/collectionsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";

const DocumentScreen = () => {
  const { id: documentId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showCols, setShowCol] = useState(false);
  const [loadingDownload, setLoading] = useState(false);

  const [createCollection, { isLoading: loandingCollectionCreation, error }] =
    useCreateCollectionMutation();

  const [addMoreDocs, { isLoading: loandingAddingToCollection }] =
    useAddMoreDocsMutation();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    refetch,
    isError,
  } = useGetDocumentDetailsQuery(documentId);

  const [downloadDocument] = useDownloadDocumentMutation()
  //const {data:downloadedDocument} =   useGetDownloadDocumentQuery(documentId)


  const { userInfoMediquest } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [deleteComment, { isLoading: loadingDelete }] =
    useDeleteCommentMutation();

  
    const downloadFile2 = async (e) =>{
      e.preventDefault()
      try {
      const res =  await downloadDocument({documentId})

      //const blob = await res.blob();
      const blob = res.data 

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type }));
      link.download = "file.pdf";
      // link.download = res.headers["content-disposition"].split("filename=")[1];
      link.click();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }

    const downloadFile = async (e) =>{
      e.preventDefault()
      setLoading(true)
        axios({
          url:`/api/documents/${documentId}/download`,
          method: "GET",
          responseType: "blob",
        }).then((response) => {
          console.log(response)
          console.log(response.file)
          setLoading(false)
          // Access the response data directly
          const blob = response.data;
          // Create blob link to download
          const url = window.URL.createObjectURL(
            new Blob([blob]),
          );
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `FileName.pdf`,
          );
      
          // Append to html link element page
          document.body.appendChild(link);
          setLoading(false)
          // Start download
          link.click();
      
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        });
    
    }
  const {
    data: collections,
    isLoading: loadingCollections,
    errorCollections,
  } = useGetMyCollectionsQuery();

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
      setComment("");
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteReview = async () => {
    try {
      await deleteComment({
        documentId,
      }).unwrap();
      refetch();
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToCollectionHandler = async (id) => {
    try {
      await addMoreDocs({
        collectionId: id,
        _id: documentId,
        name: data.name,
        image: data.image,
      }).unwrap();
      navigate(`/collection/${id}`);
      toast.success("Added to collection successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const addToNewCollectionHandler = async () => {
    try {
      const res = await createCollection({
        collectionItems: { ...data },
      }).unwrap();
      navigate(`/collection/${res._id}`);
      toast.success("collection created successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  const showCollections = () => {
    setShowCol(!showCols);
  };

  const btnStyle = {
    padding: "1rem 3rem",
    margin: "auto",
    color: "black",
    backgroundColor: "#75dab4",
    borderRadius: "5px",
    fontWeight: "bolder",
    fontSize: "1rem",
    border: "transparent",
  };

 
  // image resizing
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem 5rem",
          paddingTop: "85px",
          minHeight:"100vh"
        }}
      >
        <Link className="btn btn-light my-3" to="/exams">
          Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError?.error}
          </Message>
        ) : (
          <>
            <Meta title={data.name} />
            <Row
              style={{
                padding: "2rem",
                color: "black",
                backgroundColor: "white",
              }}
            >
              <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>{data.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Image
                    src={data.image}
                    alt={data.name}
                    style={{ margin: "auto", width: "100%", height: "100%" }}
                  />
                </Modal.Body>
              </Modal>

              <Col sm={12} md={6} lg={4}>
                <Image
                  src={data.image}
                  alt={data.name}
                  style={{ cursor: "pointer" }}
                  fluid
                  onClick={handleShow}
                />
              </Col>
              <Col  sm={12} md={6} lg={4}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{data.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={data.rating}
                      text={`${data.numReviews} reviews`}
                    />
                  </ListGroup.Item>

                  <ListGroup.Item>
                    Description: {data.description}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <IoMdEye
                      color="rgb(72 175 140)"
                      onClick={handleShow}
                      size={40}
                      style={{ marginRight: "1rem", cursor: "pointer" }}
                    />
                    <FaDownload
                    onClick={(e) => downloadFile(e)}
                      color="rgb(72 175 140)"
                      size={28}
                      style={{ cursor: "pointer" }}
                    /> {" "}
                    {loadingDownload && <Spinner animation="border" variant="dark" />}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col sm={12} md={12} lg={4}>
                <Card className="d-flex align-items-center  
                        justify-content-center rounded" style={{ color: "black" }}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <button
                        className="btn-block mb-3"
                        onClick={showCollections}
                        style={btnStyle}
                      >
                        Add To Collection <FaArrowRightLong color="black" />
                      </button>

                      {showCols &&
                        (loadingCollections ? (
                          <Loader />
                        ) : errorCollections ? (
                          <Message variant="danger">
                            {error?.data?.message || error.error}
                          </Message>
                        ) : userInfoMediquest ? (
                          <>
                            {collections?.map((collection) => (
                              <Row className="p-2 mt-2">
                                <Col md={9}>
                                  <strong>{collection.title}</strong>
                                </Col>
                                <Col md={2}>
                                  <Button
                                    style={{
                                      backgroundColor: "#0b1e33",
                                      border: "#0b1e33",
                                    }}
                                    className="btn-sm"
                                    onClick={() =>
                                      addToCollectionHandler(collection._id)
                                    }
                                  >
                                   <FaFolderPlus
                                      size={18}
                                      style={{ cursor: "pointer" }}
                                    />
                                   
                                  </Button>
                                </Col>{" "}
                              </Row>
                            ))}
                             {loandingAddingToCollection && (
                                      <Spinner
                                        animation="border"
                                        role="status"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          margin: "auto",
                                          display: "block",
                                          color:"black",
                                        }}
                                      ></Spinner>
                                    ) }
                            <Button
                              type="button"
                              className="btn-block mt-3"
                              onClick={addToNewCollectionHandler}
                              style={{                    
                                padding: "0.5rem 2rem",
                                color: "#75dab4",
                                backgroundColor: "black",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                border: "transparent",
                              }}
                            >
                              {loandingCollectionCreation ? (
                                <Spinner
                                  animation="border"
                                  role="status"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    margin: "0 4rem",
                                    display: "block",
                                  }}
                                ></Spinner>
                              ) : (
                                "Add To New Collection"
                              )}
                            </Button>
                          </>
                        ) : (
                          <Message>
                            Please <Link to="/login">sign in</Link> So you can
                            add the document to your collections
                          </Message>
                        ))}
                      {}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row
              className="review"
              style={{
                padding: "2rem",
                color: "black",
                margin: "auto",
              }}
            >
              <Col md={12} lg={8}>
                <h2>Reviews</h2>
                {data.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush">
                  {data.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <Row>
                        <Col md={10}>
                          <strong>{review.name}</strong>
                          <Rating value={review.rating} />
                          <p>{review.createdAt.substring(0, 10)}</p>
                        </Col>
                        <Col md={2} className="justify-content-end">
                          {userInfoMediquest &&
                            userInfoMediquest._id === review.user && (
                              <Button
                                variant="danger"
                                className="btn-sm"
                                onClick={() => deleteReview()}
                              >
                                {loadingDelete ? (
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      margin: "auto",
                                      display: "block",
                                      color: "white",
                                    }}
                                  ></Spinner>
                                ) : (
                                  <FaTrash color="white" size={20} />
                                )}
                              </Button>
                            )}
                        </Col>
                      </Row>

                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h2>Write a Review</h2>

                    {loadingProductReview && <Loader />}

                    {userInfoMediquest ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group className="my-2" controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className="my-2" controlId="comment">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            row="3"
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={loadingProductReview}
                          type="submit"
                          variant="primary"
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
                        Please <Link to="/login">sign in</Link> to write a
                        review
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
