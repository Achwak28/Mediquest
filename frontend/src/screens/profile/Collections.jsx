import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { FaUser, FaHeart } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosFolderOpen } from "react-icons/io";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../slices/usersApiSlice";
//import { useGetMyOrdersQuery } from "../../slices/ordersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import StyledButton from "../../components/Button";
import "./ProfileScreen.css";
import ExamCard from "../../components/ExamCard"
import "../exams/ExamsSCreen.css";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState("profile");

  const { userInfoMediquest } = useSelector((state) => state.auth);

  //const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfoMediquest.name);
    setEmail(userInfoMediquest.email);
  }, [userInfoMediquest.email, userInfoMediquest.name]);

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
      
      <Row className="exams-row">
       
       <Col
         className="content-side"
         style={{ backgroundColor: "#161616" }}
         md={9}
       >
         <Row className="p-3 mt-3">
           <Col><strong>Collections</strong></Col>
           
         </Row>
         <Row className="m-2">
           <Col sm={12} md={6} lg={4} xl={3}>
            <ExamCard />
           </Col>
         </Row>
       </Col>
     </Row>
     
    </>
  );
};

export default ProfileScreen;
