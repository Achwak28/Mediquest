import React from "react";
import { Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useGetUserProfileQuery } from "../../slices/usersApiSlice";
import "./ProfileScreen.css";
import ExamCard from "../../components/ExamCard";
import Message from "../../components/Message";
import "../exams/ExamsSCreen.css";

const ProfileScreen = () => {
  const { data: userProfile, isLoading, error } = useGetUserProfileQuery();

  return (
    <>
      <Row className="exams-row">
        <Col
          className="content-side"
          style={{ backgroundColor: "#161616",  minHeight:"100vh"}}
        
        >
          <Row className="p-3 mt-2">
            <Col>
              <h2>Favourites</h2>
            </Col>
          </Row>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error.data.message}</Message>
          ) : userProfile?.favourites.length === 0 ? (
            <Row className="justify-content-center">
              <Col md={10}>
                <Message>You have no Favourites !</Message>
              </Col>
            </Row>
          ) : (
            <Row className="  justify-content-center">
              {userProfile?.favourites.map((document) => (
                <Col key={document._id} sm={6} md={5} lg={4} xl={3}>
                  <ExamCard document={document} />
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
