import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetCollectionDetailsQuery,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteDocFromCollectionMutation,
} from "../slices/collectionsApiSlice";

const CollectionScreen = () => {
  const { id: collectionId } = useParams();
  const [title, setTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  const navigate = useNavigate();
  const {
    data: collection,
    refetch,
    isLoading,
    error,
  } = useGetCollectionDetailsQuery(collectionId);

  const [deleteCollection] =
    useDeleteCollectionMutation();

    const [deleteDocFromCollection] = useDeleteDocFromCollectionMutation();

  const [updateCollection, { isLoading: loadingUpdate }] =
    useUpdateCollectionMutation();

  const deleteCollectionHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteCollection(id);
        navigate("/profile/userinfo");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteDocumentHandler = async (documentId) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteDocFromCollection({
          collectionId: collectionId,
          document: documentId,
        }).unwrap();;
        toast.success("document deleted")
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  } 

  const editCollectionName = async (e) => {
    e.preventDefault();
    try {
      await updateCollection({
        collectionId,
        title,
      }).unwrap();
      setShowInput(!showInput) // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      refetch();
      // navigate("/admin/documentlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return <>
  
    <div
        className="collection-container"
        style={{
          backgoundColor: "#f1f2f5",
          paddingTop: "85px",
        }}
      >
     {isLoading ? (
    <div style={{marginTop:"10vh"}} className="mt-4">
       <Loader className="mt-4" />
    </div>
   
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <>
     <Row className="justify-content-center my-3" style={{  textAlign:"start", fontWeight:"700" }}>
        <Col md={4}>
          <h1 style={{fontWeight:"bold"}}>  {collection.title}</h1>
        </Col>

        <Col md={2}>
          <Button
            style={{ backgroundColor: "#0b5ed7", border: "#0b5ed7" }}
            className="btn-sm mx-2"
            onClick={() => setShowInput(!showInput)}
          >
            <FaEdit color="white" size={22} />
          </Button> 

          <Button
            variant="danger"
            className="btn-sm"
            onClick={() => deleteCollectionHandler(collectionId)}
          >
            <FaTrash color="white" size={20} />
          </Button>
        </Col>
        {showInput && ( <Row className="justify-content-center">
          <Col md={4}>
            <Form onSubmit={editCollectionName}>
              <Row>
                <Col md={9}>
                  <Form.Group className="my-2" controlId="title">
                    <Form.Control
                      type="title"
                      placeholder="Enter new title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Button
                    type="submit"
                    variant="primary"
                    style={{
                      marginTop: "0.5rem",
                      backgroundColor: "#75D4B4",
                      border: "none",
                      color: "black",
                      fontWeight: "bold",
                      width:"80px"
                    }}
                  >
                    {loadingUpdate ? (
                      <Spinner
                        animation="border"
                        role="status"
                        style={{
                          width: "25px",
                          height: "25px",
                          margin: "auto",
                          display: "block",
                        }}
                      ></Spinner>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>)}
       
      </Row>
      <Row className="justify-content-center mb-5" style={{marginBottom:"5rem"}}>
        <Col md={8}>
          <Card>
            <ListGroup variant="flush" style={{textAlign:"start"}}>
              <ListGroup.Item>
                <p>
                  <strong>Name: </strong> {collection.user.name}
                </p>
                <p>
                  <strong>Email: </strong>{" "}
                  <a href={`mailto:${collection.user.email}`}>
                    {collection.user.email}
                  </a>
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Collection Items</h2>
                {collection.collectionItems.length === 0 ? (
                  <Message>collection is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {collection.collectionItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={5} className="mt-4">
                            <Link to={`/document/${item.document}`}>
                              {item.name}
                            </Link> 
                          </Col>
                          <Col md={2} className="mt-3">
                            <Button type="button" variant="light" onClick={() => deleteDocumentHandler(item.document)}>
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>)}
   
     
      </div>
   
  </>
};

export default CollectionScreen;
