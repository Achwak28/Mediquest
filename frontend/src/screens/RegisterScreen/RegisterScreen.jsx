import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import StyledButton from "../../components/Button";
import { useRegisterMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import "./RegisterScreen.css";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfoMediquest) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfoMediquest]);

  const submitHandler = async (e) => {
    e.preventDefault();
 
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <div className="register-container">
      <div className="register-form-container">
        <Col md={8}>
          <FormContainer className="register-content">
            <h1 className="white">Welcome</h1>
            <p className="white">Sign Up to continue to MediQuest</p>
            <Form onSubmit={submitHandler}>
              <Form.Group className="my-2 white mt-3 mb-2" controlId="name">
                <Form.Control
                  className="inputs"
                  type="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2 white mb-2" controlId="email">
                <Form.Control
                  className="inputs"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2 mb-2" controlId="password">
                <Form.Control
                  className="inputs"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="my-2 mb-3" controlId="confirmPassword">
                <Form.Control
                  className="inputs"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <StyledButton
                text="REGISTER"
                type="submit"
                style={{ margin: "auto" }}
              />

              {isLoading && <Loader />}
            </Form>

            <Row className="py-3">
              <Col className="white">
                Already have an account?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  style={{ color: "#75dab4" }}
                >
                  {" "}
                  {/*to={redirect ? `/register?redirect=${redirect}` : '/register'*/}
                  Log In
                </Link>
              </Col>
            </Row>
          </FormContainer>
        </Col>
      </div>
    </div>
  );
};

export default RegisterScreen;
