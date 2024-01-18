import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import {
  useGetDocumentsQuery,
  useFilterDocumentsMutation,
} from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";
import Year from "../../components/year/filterRadio";

const ExamsScreen = () => {
  const [exams, setExams] = useState();
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
    category: "exam",
  });

  const [filterDocuments, { isLoading: loadingFiltered }, error] =
    useFilterDocumentsMutation();

  const handleChange = async (event) => {
    event.preventDefault();
    if (!event.target.value) {
      setExams(data);
    } else {
      try {
        const newDocuments = await filterDocuments({
          keyword,
          pageNumber,
          category: "exam",
          year: event.target.value,
        }).unwrap();
        setExams(newDocuments);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

 
  useEffect(() => {
    
    if (data) {
      setExams(data);
    }
  }, [data]);
  return (
    <>
      <Row className="exams-row">
        <Col className="filter-side" md={2}>
          <Year handleChange={handleChange} />
        </Col>

        <Col
          className="content-side"
          style={{ backgroundColor: "#161616", minHeight:"100vh" }}
          md={10}
        >
          <Row className="p-3 mt-3">
            <Col>
              <strong>Exams</strong>
            </Col>
            <Col md={2}></Col>
          </Row>{" "}
          {loadingFiltered && <Loader />}
          {/* .filter((item) => item.category === "exams") */}
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data?.message || isError?.error}
            </Message>
          ) : (
            <Row className="m-2">
              {exams?.categorizedDocs.map((document) => (
                <Col key={document._id} sm={12} md={5} lg={4} xl={3}>
                  <div className="card-container">
                  <ExamCard document={document} className="m-3" />
                  </div>
                </Col>
              ))}
              {exams?.categorizedDocs.length === 0 && (
                <Row className="justify-content-center">
                  <Col md={10}>
                    <Message>no matches were found!</Message>
                  </Col>
                </Row>
              )}
            </Row>
          )}
          {exams?.pages > 1 && (
            <Pagination className="mx-auto my-2">
              {[...Array(exams?.pages).keys()].map((x) => (
                <LinkContainer key={x + 1} to={`/exams/page/${x + 1}`}>
                  <Pagination.Item active={x + 1 === exams?.page}>
                    {x + 1}
                  </Pagination.Item>
                </LinkContainer>
              ))}
            </Pagination>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ExamsScreen;
