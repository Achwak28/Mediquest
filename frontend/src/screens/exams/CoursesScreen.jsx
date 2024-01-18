import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
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

const CoursesScreen = () => {
  const [courses, setCourses] = useState();
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
    category: "course",
  });

  const [filterDocuments, { isLoading: loadingFiltered }, error] =
    useFilterDocumentsMutation();

  const handleChange = async (event) => {
    event.preventDefault();
   
    if (!(event.target.value)) {
      setCourses(data);
    } else {
      try {
        const newDocuments = await filterDocuments({
          keyword,
          pageNumber,
          category: "course",
          year: event.target.value,
        }).unwrap();
        
        setCourses(newDocuments);
       
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setCourses(data);
    }
  }, [data]);
  return (
    <>
      <Row className="exams-row">
        <Col className="filter-side" md={2} >
          <Year handleChange={handleChange} />
        </Col>

        <Col
          className="content-side"
          style={{ backgroundColor: "#161616", minHeight:"100vh" }}
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
          {loadingFiltered && <Loader />}
          {error && (
            <Message variant="danger">
              {error?.data?.message || error?.error}
            </Message>
          )}
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data?.message || isError?.error}
            </Message>
          ) : (
            <Row className="m-2">
              {courses?.categorizedDocs.map((document) => (
                <Col key={document._id} sm={12} md={5} lg={4} xl={3}>
                  <div className="card-container">
                  <ExamCard document={document} className="m-3" />
                  </div>
                </Col>
              ))}
              {courses?.categorizedDocs.length === 0 && (
                <Row className="justify-content-center">
                  <Col md={10}>
                    <Message>no matches were found!</Message>
                  </Col>
                </Row>
              )}
            </Row>
          )}
          {courses?.pages > 1 && (
            <Pagination className="mx-auto my-2">
              {[...Array(courses?.pages).keys()].map((x) => (
                <LinkContainer key={x + 1} to={`/courses/page/${x + 1}`}>
                  <Pagination.Item active={x + 1 === courses?.page}>
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
