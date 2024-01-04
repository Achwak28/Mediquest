import React from "react";
import { Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import "./ExamsSCreen.css";
import ExamCard from "../../components/ExamCard";

const CoursesScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
  });
  console.log(data)
  return (
    <>
      <Row className="exams-row">
        <Col className="filter-side" md={3} style={{height:"88vh"}}>
          first
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
                <strong>Courses</strong>
              </Col>
              <Col>
                <strong></strong>
              </Col>
            </Row>
            <Row className="m-2">
              {
                  data?.documents.filter((item) => item.category === 'course').map((document) => (
                    <Col key={document._id} sm={12} md={4} lg={5} xl={3}>
                    <ExamCard document={document} className="m-3" />
                    </Col>
                  ))
              }
             
            </Row>
          </Col>
        )
        }
      </Row>
    </>
  );
};

export default CoursesScreen;