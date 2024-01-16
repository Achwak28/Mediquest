import React from "react";
import { Row, Col } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";

const CoursesScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
    category: "course",
  });
  console.log(data);
  return (
    <>
      <Row className="exams-row">
        <Col className="filter-side" md={2} style={{ height: "100vh" }}>
          first
        </Col>

        <Col
          className="content-side"
          style={{ backgroundColor: "#161616" }}
          md={10}
        >
          <Row className="p-3 mt-3">
            <Col>
              <strong>Courses</strong>
            </Col>
            <Col>
              <strong></strong>
            </Col>
          </Row>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data?.message || isError?.error}
            </Message>
          ) : (
            <Row className="m-2">
              {data?.categorizedDocs.map((document) => (
                <Col key={document._id} sm={12} md={4} lg={5} xl={3}>
                  <ExamCard document={document} className="m-3" />
                </Col>
              ))}
            </Row>
          )}
           {data?.pages > 1 && (
                <Pagination className="mx-auto my-2">
                  {[...Array(data?.pages).keys()].map((x) => (
                    <LinkContainer key={x + 1} to={`/courses/page/${x + 1}`}>
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

export default CoursesScreen;
