import React, { useEffect, useState } from "react";
import { Form, Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaHeart } from "react-icons/fa";
import { IoIosFolderOpen } from "react-icons/io";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useProfileMutation,
  useUploadUserImageMutation,
} from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import StyledButton from "../../components/Button";
import FavScreen from "./FavScreen";
import Collections from "./Collections";
import "./ProfileScreen.css";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState();
  const [isActive, setIsActive] = useState("profile");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState("100vh");

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const [uploadUserImage, { isLoading: loadingUpload }] =
    useUploadUserImageMutation();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
    useEffect(() => {
      function handleResize() {
        setWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [width]);
  useEffect(() => {
    if (width < 768){
      setHeight("20vh")
    } else{
      setHeight("100vh")
    };
    setName(userInfoMediquest.name);
    setEmail(userInfoMediquest.email);
    setImage(userInfoMediquest.image);
  }, [
    userInfoMediquest.email,
    userInfoMediquest.name,
    userInfoMediquest.image,
    width
  ]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadUserImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
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
          image,
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
      <Row className="profile-row pt-5">
        <Col className="profile-sidebar p-3" md={2} style={{ height: `${height}` }}>
          <Link
            to="/profile/userinfo"
            className='profile-sidebar-item'
            onClick={() => setIsActive("profile")}
          >
            <FaUser /> User Informations
          </Link>
          <Link
            to="/profile/favourites"
            className='profile-sidebar-item'
            onClick={() => setIsActive("favourites")}
          >
            <FaHeart /> Liked
          </Link>
          <Link
            to="/profile/collections"
            className='profile-sidebar-item'
            onClick={() => setIsActive("collections")}
          >
            <IoIosFolderOpen /> Collections
          </Link>
        </Col>

        <Col
          className="content-side"
          style={{ backgroundColor: "#161616" , minHeight: "100vh"}}
          md={10}
        >
          {isActive === "profile" ? (
            <Row className="m-5">
              <Col>
                <div className="profile-image">
                  {/*<FaCircleUser size={150} />*/}
                  <Image
                    src={image}
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      marginBottom: "2rem",
                    }}
                  />
                  <Form.Control
                    label="Choose File"
                    onChange={uploadFileHandler}
                    type="file"
                    style={{ width: "15rem" }}
                  ></Form.Control>
                </div>
              </Col>
              <Col>
                {" "}
                <Form onSubmit={submitHandler}>
                  <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group className="my-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <StyledButton type="submit" text="Update" />
                  {loadingUpload && <Loader />}
                  {loadingUpdateProfile && <Loader />}
                </Form>
              </Col>
            </Row>
          ) : isActive === "favourites" ? (
            <Row className="">
              {" "}
              <FavScreen />{" "}
            </Row>
          ) : (
            <Row className="">
              {" "}
              <Collections />
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
