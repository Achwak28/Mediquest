import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";
import SelectCheckbox from "../../components/SelectCheckbox";

const SummariesScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
    category: "summary",
  });

  return (
    <>
      <Row className="exams-row">
        <Col className="filter-side" md={2} style={{ height: "100vh" }}>
          <SelectCheckbox />
        </Col>

        <Col
          className="content-side"
          style={{ backgroundColor: "#161616" }}
          md={10}
        >
          <Row className="p-3 mt-3">
            <Col>
              <strong>Summaries</strong>
            </Col>
            {/*<Col>
                <strong>16 exams</strong>
              </Col> */}
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
                <Col key={document._id} sm={12}  md={5} lg={4} xl={3}>
                  <ExamCard document={document} className="m-3" />
                </Col>
              ))}
            </Row>
          )}
          {data?.pages > 1 && (
            <Pagination className="mx-auto my-2">
              {[...Array(data?.pages).keys()].map((x) => (
                <LinkContainer key={x + 1} to={`/summaries/page/${x + 1}`}>
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

export default SummariesScreen;
