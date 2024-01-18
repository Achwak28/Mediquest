import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import StyledButton from "../../components/Button";
import {
  useLoginMutation,
  useSendOTPMutation,
} from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import "./LoginScreen.css";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [sendOTP, { isLoading: loadingOTP }] = useSendOTPMutation();

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfoMediquest) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfoMediquest]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const navigateToOTP = async () => {
    if (email) {
      const otp = Math.floor(Math.random() * 9000 + 1000);
      const data = { email: { email }, otp: otp };
      try {
        await sendOTP({ recipient_email: email, OTP: otp }).unwrap();
        localStorage.setItem("otpCode", JSON.stringify(true));
        setTimeout(() => localStorage.removeItem("otpCode"), 600000);
        navigate("/forgotpassword", { state: data });
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } else {
      toast.error("you must enter your email");
    }
  };

  return (
    <Row className="login-container ">
      <Col className="login-content mt-5" md={6}>
        <FormContainer>
          <h1 className="white">Welcome</h1>
          <p className="white">Sign In to continue to Medi<span style={{color:"#75dab4"}}>Q</span>uest</p>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2 white mt-3" controlId="email">
              <Form.Control
                className="inputs"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2 " controlId="password">
              <Form.Control
                className="inputs"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mx-auto mb-3">
              <p
                id="forgotPassword"
                onClick={() => navigateToOTP()}
                style={{
                  color: "#75dab4",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {" "}
                Forgot Password?
              </p>
            </Form.Group>

            <StyledButton text="LOGIN" type="submit" />

            {loadingOTP && <Loader style={{ color: "white !important" }} />}
            {isLoading && (
              <Spinner
                animation="border"
                role="status"
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "auto",
                  display: "block",
                  color:"white"
                }}
              ></Spinner>
            )}
          </Form>

          <Row className="py-3">
            <Col className="white">
              Don't have an account?{" "}
              <Link
               to={redirect ? `/register?redirect=${redirect}` : '/register'}
                style={{ color: "#75dab4" }}
              >
                {" "}
                Register
              </Link>
            </Col>
          </Row>
        </FormContainer>
      </Col>
      <Col md={6} className="login-bg"></Col>
    </Row>
  );
};

export default LoginScreen;
