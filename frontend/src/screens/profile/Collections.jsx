import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PiFoldersFill } from "react-icons/pi";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../slices/usersApiSlice";
import { useGetMyCollectionsQuery } from "../../slices/collectionsApiSlice";
import { setCredentials } from "../../slices/authSlice";
import "./ProfileScreen.css";
import "../exams/ExamsSCreen.css";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState("profile");

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfoMediquest.name);
    setEmail(userInfoMediquest.email);
  }, [userInfoMediquest.email, userInfoMediquest.name]);

  const { data, isLoading, error } = useGetMyCollectionsQuery();
  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="exams-row" style={{}}>
        <Col
          className="content-side"
          style={{ backgroundColor: "#161616" }}
          md={9}
        >
          <Row className="p-3 mt-3">
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
              <Col md={10}><Message>you have no collections, create one now!</Message></Col>
              
            </Row>
          ) : (
            <Row className="m-2">
              {data?.map((collection) => (
                <Col md={4}>
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
