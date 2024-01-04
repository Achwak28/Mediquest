import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useCreateDocumentMutation,
} from "../../slices/documentApiSlice";
import { toast } from "react-toastify";

const DocumentListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetDocumentsQuery({
    pageNumber,
  });

  const [deleteDocument, { isLoading: loadingDelete }] =
    useDeleteDocumentMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteDocument(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createDocument, { isLoading: loadingCreate }] =
    useCreateDocumentMutation();

  const createDocumentHandler = async () => {
    if (window.confirm("Are you sure you want to create a new document?")) {
      try {
        await createDocument();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          height: "86vh",
          padding: "2rem 5rem",
          color:"black",
        }}
      >
        <Row
          className="align-items-center"
          style={{ backgroundColor: "white", color:"black" }}
        >
          <Col>
            <h1>Documents</h1>
          </Col>
          <Col className="text-end">
            <Button
              className="my-3"
              style={{
                backgroundColor: "#75D4B4",
                border: "none",
                color: "black",
                fontWeight: "bold",
              }}
              onClick={createDocumentHandler}
            >
              <FaPlus /> Create Document
            </Button>
          </Col>
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <>
            <Table
              striped
              bordered
              hover
              responsive
              className="table-sm"
              style={{ backgroundColor: "white", color:"black" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>YEAR</th>
                  <th>LIKES</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.documents.map((document) => (
                  <tr key={document._id}>
                    <td>{document._id}</td>
                    <td>{document.name}</td>
                    <td>{document.category}</td>
                    <td>{document.year}</td>
                    <td>{document.numLikes}</td>
                    <td>
                      <LinkContainer
                        to={`/admin/document/${document._id}/edit`}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(document._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </>
        )}
      </div>
    </>
  );
};

export default DocumentListScreen;
