import React from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";

const ExamsScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
  });

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
              <strong>Results</strong>
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
            <Row className="m-1">
              {data?.documents.map((document) => (
                <Col key={document._id} sm={12}  md={5} lg={4} xl={3}>
                  <ExamCard document={document} className="m-2" />
                </Col>
              ))}
            </Row>
          )}

          <Paginate
            pages={data?.pages}
            page={data?.page}
            keyword={keyword ? keyword : ""}
          />
        </Col>
      </Row>
    </>
  );
};

export default ExamsScreen;
