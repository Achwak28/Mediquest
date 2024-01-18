import { useState, useEffect } from "react";
//import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetDocumentDetailsQuery,
  useUpdateDocumentMutation,
  useUploadDocumentImageMutation,
  useUploadDocumentFileMutation,
} from "../../slices/documentApiSlice";

const ProductEditScreen = () => {
  const { id: documentId } = useParams();

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [pdf, setPdf] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: document,
    isLoading,
    refetch,
    error,
  } = useGetDocumentDetailsQuery(documentId);

  const [updateDocument, { isLoading: loadingUpdate }] =
    useUpdateDocumentMutation();

  const [uploadDocumentImage, { isLoading: loadingUpload }] =
    useUploadDocumentImageMutation();

  const [uploadDocumentFile, { isLoading: loadingUploadFile }] =
    useUploadDocumentFileMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateDocument({
        documentId,
        name,
        year,
        image,
        file: pdf,
        category,
        description,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Document updated");
      refetch();
      navigate("/admin/documentlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (document) {
      setName(document.name);
      setYear(document.year);
      setImage(document.image);
      setCategory(document.category);
      setDescription(document.description);
      setPdf(document.file);
    }
  }, [document]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadDocumentImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadPdfHandler = async (e) => {
    const formData = new FormData();
    formData.append("pdf", e.target.files[0]);
    try {
      const res = await uploadDocumentFile(formData).unwrap();
      toast.success(res.message);
      setPdf(res.file);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem 5rem",
          color: "black",
          paddingTop: "6rem",
          minHeight: "100vh",
        }}
      >
        <Link to="/admin/documentlist" className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Document</h1>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error.data.message}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  style={{ color: "black" }}
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  style={{ color: "black" }}
                  type="number"
                  placeholder="Enter year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  style={{ color: "black" }}
                  type="text"
                  placeholder="Enter image url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.Control
                  label="Choose File"
                  onChange={uploadFileHandler}
                  type="file"
                ></Form.Control>

                {loadingUpload && <Loader />}
              </Form.Group>

              <Form.Group controlId="file">
                <Form.Label>file</Form.Label>
                <Form.Control
                  style={{ color: "black" }}
                  type="text"
                  placeholder="Enter file url"
                  value={pdf}
                  onChange={(e) => setPdf(e.target.value)}
                ></Form.Control>
                <Form.Control
                  label="Choose File"
                  onChange={uploadPdfHandler}
                  type="file"
                ></Form.Control>

                {loadingUploadFile && <Loader />}
              </Form.Group>

              {/*<Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  style={{ color: "black" }}
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>*/}

              <Form.Group controlId="categorySelector">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="course">course</option>
                  <option value="exam">exam</option>
                  <option value="summary">summary</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  style={{ color: "black" }}
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button
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
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      </div>
    </>
  );
};

export default ProductEditScreen;
