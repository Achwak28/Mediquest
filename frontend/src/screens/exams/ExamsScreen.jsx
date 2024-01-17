import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Form from "react-bootstrap/Form";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";
import Year from "../../components/year/filterRadio";

const ExamsScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
   category:"exam",
  });
  //const {documents} = data;

  const [selectedCategory, setSelectedCategory] = useState(null);

  console.log(data);
  

  // ----------- Radio Filtering -----------
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    const newDocuments = data?.documents.filter(
      (document) => document.year === selectedCategory
    );
    console.log(newDocuments);
    //setExams(newDocuments);
  };

  const filterDocuments = (year) => {
    const newDocuments = data.documents.filter(
      (document) => document.year === "1"
    );
    console.log(newDocuments);
    //setExams(newDocuments);
  };

  return (
    <>
      <Row className="exams-row">
        <Col
          className="filter-side"
          md={2}
          style={{ height: "100vh", paddingLetf: "2rem" }}
        >
          <Year handleChange={handleChange} />

          <Form.Check label="1" name="group1" type="radio" />
        </Col>

        <Col
          className="content-side"
          style={{ backgroundColor: "#161616" }}
          md={10}
        >
          <Row className="p-3 mt-3">
            <Col>
              <strong>Exams</strong>
            </Col>
            <Col md={2}>
              
            </Col>
          </Row>{" "}
          {/* .filter((item) => item.category === "exams") */}
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data?.message || isError?.error}
            </Message>
          ) : (
            <Row className="m-2">
              {data.categorizedDocs.map((document) => (
                <Col key={document._id} sm={12} md={5} lg={4} xl={3}>
                  <ExamCard document={document} className="m-3" />
                </Col>
              ))}
            </Row>
          )}
         
          {data?.pages > 1 && (
                <Pagination className="mx-auto my-2">
                  {[...Array(data?.pages).keys()].map((x) => (
                    <LinkContainer key={x + 1} to={`/exams/page/${x + 1}`}>
                      <Pagination.Item active={x + 1 === data?.page}>
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
