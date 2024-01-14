import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaFolderPlus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
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
import { IoMdEye } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import Rating from "../components/Rating";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  useGetDocumentDetailsQuery,
  useCreateReviewMutation,
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

  const [createCollection, { isLoading: loandingCollectionCreation, error }] =
    useCreateCollectionMutation();

  const [addMoreDocs, { isLoading: loandingAddingToCollection, errorAdd }] =
    useAddMoreDocsMutation();

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

  const {
    data,
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

  const addToCollectionHandler = async (id) => {
    try {
      await addMoreDocs({
        collectionId: id,
        _id: documentId,
        name: document.name,
        image: document.image,
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
        collectionItems: { ...document },
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
    color: "black",
    backgroundColor: "#75dab4",
    borderRadius: "5px",
    fontWeight: "bolder",
    fontSize: "1rem",
    border: "transparent",
  };

  const onButtonClick = () => {
    // using Java Script method to get PDF file
    fetch("SamplePDF.pdf").then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);

        // Setting various property values
        let alink = window.createElement("a");
        alink.href = fileURL;
        alink.download = "SamplePDF.pdf";
        alink.click();
      });
    });
  };

  // image resizing
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [dialog, setDialog] = useState(false);

  const toggleDialog = () => {
    setDialog(!dialog);
  };

  return (
    <>
      <div style={{ backgroundColor: "white", padding: "2rem 5rem" }}>
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
            <Meta title={document.name} />
            <Row
              style={{
                padding: "2rem 5rem",
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
                  <Modal.Title>{document.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Image
                  src={document.image}
                  alt={document.name}
                  
                  style={{margin:"auto", width:"100%", height:"100%"}}
                />
                </Modal.Body>
              </Modal>
             
              <Col md={4}>
                <Image
                  src={document.image}
                  alt={document.name}
                  style={{cursor:"pointer"}}
                  fluid
                  onClick={handleShow}
                />
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
                    <button onClick={onButtonClick}>Download PDF</button>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <IoMdEye
                      color="rgb(72 175 140)"
                      size={40}
                      style={{ marginRight: "1rem", cursor: "pointer" }}
                    />
                    <FaDownload
                      color="rgb(72 175 140)"
                      size={28}
                      style={{ cursor: "pointer" }}
                    />
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4}>
                <Card style={{ color: "black" }}>
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
                            {data?.map((collection) => (
                              <Row className="p-2 mt-2">
                                <Col md={7}>
                                  <strong>{collection.title}</strong>
                                </Col>
                                <Col>
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
                            <Button
                              type="button"
                              className="btn-block mt-3"
                              onClick={addToNewCollectionHandler}
                              style={{
                                padding: "0.5rem 1rem",
                                color: "#75dab4",
                                backgroundColor: "black",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                border: "transparent",
                              }}
                            >
                              Add To New Collection
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
                padding: "2rem 5rem",
                color: "black",
                margin: "auto",
              }}
            >
              <Col md={10}>
                <h2>Reviews</h2>
                {document.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush">
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
