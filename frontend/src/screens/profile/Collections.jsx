import React from "react";
import { Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { PiFoldersFill } from "react-icons/pi";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyCollectionsQuery } from "../../slices/collectionsApiSlice";
import "./ProfileScreen.css";
import "../exams/ExamsSCreen.css";

const ProfileScreen = () => {



  const { data, isLoading, error } = useGetMyCollectionsQuery();


  return (
    <>
      <Row className="exams-row" style={{}}>
        <Col
          className="content-side"
          style={{ backgroundColor: "#161616", minHeight:"100vh" }}
         
        >
          <Row className="p-3 mt-2">
            <Col>
              <h2>Collections</h2>
            </Col>
          </Row>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error.data.message}</Message>
          ) : data.length === 0 ? (
            <Row className="justify-content-center">
              <Col md={6}><Message>you have no collections, create new one now!</Message></Col>
              
            </Row>
          ) : (
            <Row className="m-2">
              {data?.map((collection) => (
                <Col sm={6} md={4}>
                  <div className="collection-card mx-3">
                    <LinkContainer
                      to={`/collection/${collection._id}`}
                      style={{ cursor: "pointer" }}
                    >
                      <PiFoldersFill size={170} />
                    </LinkContainer>
                    <h6>{collection.title}</h6>

                    <Col>Created At</Col>
                    <Col>{collection.createdAt.substring(0, 10)}</Col>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
