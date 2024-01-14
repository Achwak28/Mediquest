import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";
import Year from "../../components/year/filterRadio";

const ExamsScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data: documents, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);

  console.log(documents);
  const [exams, setExams] = useState(
    documents?.documents.filter((item) => item.category === "exams")
  );

  console.log(
    exams+"  exams"
  );

  // ----------- Radio Filtering -----------
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    const newDocuments = documents?.documents.filter(
      (document) => document.year === selectedCategory
    );
    console.log(newDocuments)
    setExams(newDocuments);
  };

  const filterDocuments = (year) => {
    const newDocuments = documents.filter((document) => document.year === "1");
    console.log(newDocuments);
    setExams(newDocuments);
  };

  return (
    <>
      <Row className="exams-row">
        <Col className="filter-side" md={3} style={{ height: "88vh", paddingLetf:"2rem" }}>
          <Year handleChange={handleChange} />

          <Form.Check label="1" name="group1" type="radio" />
        </Col>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError?.error}
          </Message>
        ) : (
          <Col
            className="content-side"
            style={{ backgroundColor: "#161616" }}
            md={9}
          >
            <Row className="p-3 mt-3">
              <Col>
                <strong>Exams</strong>
              </Col>
              <Col>
                <strong></strong>
              </Col>
            </Row>
            <Row className="m-2">
              {documents.documents
                .filter((item) => item.category === "exams")
                .map((document) => (
                  <Col key={document._id} sm={12} md={4} lg={5} xl={3}>
                    <ExamCard document={document} className="m-3" />
                  </Col>
                ))}
            </Row>
          </Col>
        )}
      </Row>
    </>
  );
};

export default ExamsScreen;
