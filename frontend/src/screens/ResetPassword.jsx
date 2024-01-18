import React from "react";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "./profile/ProfileScreen.css";

const ResetPassword = () => {
  const location = useLocation();
  const data = location.state;
  const email = data.email.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await resetPassword({
          email,
          password,
        }).unwrap();
        setPassword("");
        setConfirmPassword("");
        setShowMessage(true);
        localStorage.removeItem('resetPassword')
        toast.success("Password updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div
        className="container-forgot container-reset"
        
      >
        <Row
          className="justify-content-center"
          style={{
            paddingTop: "8.5rem",
            paddingBottom: "7rem",
           
            height: "100vh",
            color: "black",
          }}
        >
          <Col md={6}>
            <Card className="p-3 rounded shadow-lg reset-card mx-3">
              <ListGroup variant="flush">
                {isLoading && <Loader />}
                {showMessage && (
                  <Message>
                    Now you can <Link to="/login">log in</Link> using your new
                    password
                  </Message>
                )}

                <h2 style={{ marginLeft: "19.2px", fontWeight: "bold" }}>
                  Reset Password
                </h2>

                <ListGroup.Item>
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2" controlId="password">
                      <Form.Label style={{ color: "black", fontWeight: "600" }}>
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2" controlId="confirmPassword">
                      <Form.Label style={{ color: "black", fontWeight: "600" }}>
                        Confirm Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button
                      className="verify-btn btn-block shadow-none"
                      type="submit"
                      style={{ marginTop: "1rem" }}
                    >
                      Reset Password
                    </Button>
                  </Form>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ResetPassword;
