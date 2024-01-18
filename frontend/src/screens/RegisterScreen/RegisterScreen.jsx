import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import StyledButton from "../../components/Button";
import {
  useRegisterMutation,
  useSendCodeMutation,
} from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import "./RegisterScreen.css";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOTPinput, setShowOTPinput] = useState(false);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState("");
  const [otpCode, setOTPCode] = useState();

  const [disable, setDisable] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [sendCode, { isLoading: LoadingOTP }] = useSendCodeMutation();

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfoMediquest) {
      navigate(redirect);
    }
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [navigate, redirect, userInfoMediquest, disable]);

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

  const sendConfirmationCode = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else if (!password || password.length < 8) {
      toast.error(`Password must be at least 8 characters long`);
    } else {
      if (email && name && password) {
        const otp = Math.floor(Math.random() * 9000 + 1000);
        setOTPCode(otp);
        setTimeout(() => setOTPCode(null), 300000);
        try {
          await sendCode({ recipient_email: email, OTP: otp }).unwrap();
          toast.success("A Confirmation Code is sent to your email");
          setShowOTPinput(true);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      } else {
        toast.error("you must enter your informations");
      }
    }
  };
  const resendCode = async () => {
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    setOTPCode(OTP);
    if (disable) {
      toast.error("Wait for 1 min to ask for another OTP code");
    } else {
      try {
        await sendCode({ recipient_email: email, OTP: OTP }).unwrap();
        setTimeout(() => setOTPCode(null), 300000);
        setDisable(true);
        setTimer(60);
        toast.success("A new Code has succesfully been sent to your email.");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const verfiyCode = async () => {
    if (parseInt(OTPinput) === otpCode) {

      
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } else {
      toast.error("The code is not incorrect, try again or re-send the code");
    }
  };
  return (
    <div className="register-container">
      <div className="register-form-container">
        <Col md={8}>
          {!showOTPinput ? (
            <FormContainer className="register-content mt-4">
              <h1 className="white mt-4">Welcome</h1>
              <p className="white">
                Sign Up to continue to Medi
                <span style={{ color: "#75dab4" }}>Q</span>uest
              </p>
              <Form onSubmit={sendConfirmationCode}>
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

                {LoadingOTP && (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{
                      width: "50px",
                      height: "50px",
                      margin: "auto",
                      display: "block",
                      color: "white",
                    }}
                  ></Spinner>
                )}
                <StyledButton
                  text="REGISTER"
                  type="submit"
                  style={{ margin: "auto" }}
                />
              </Form>

              <Row className="py-3">
                <Col className="white">
                  Already have an account?{" "}
                  <Link
                    to={redirect ? `/login?redirect=${redirect}` : "/login"}
                    style={{ color: "#75dab4" }}
                  >
                    {" "}
                    {/*to={redirect ? `/register?redirect=${redirect}` : '/register'*/}
                    Log In
                  </Link>
                </Col>
              </Row>
            </FormContainer>
          ) : (
            <>
              <Col md={8} className="mx-auto mt-5">
                <div
                  className=" align-items-center  
                        justify-content-center mx-auto"
                >
                  <h3 className="white mt-5">Enter Confirmation Code</h3>
                  <p className="white">
                    Enter the confirmation code we sent to {email}.{" "}
                    <a
                      style={{
                        color: disable ? "gray" : "#38b58b",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                        fontSize: "medium",
                      }}
                      onClick={() => resendCode()}
                    >
                      {disable
                        ? `Resend Code in ${timerCount}s`
                        : "Resend Code"}
                    </a>
                  </p>
                  {LoadingOTP && (
                    <Spinner
                      animation="border"
                      role="status"
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "auto",
                        display: "block",
                        color: "white",
                      }}
                    ></Spinner>
                  )}
                  <Form>
                    <Form.Group
                      className="my-2 white mt-3 mb-2"
                      controlId="otp-input"
                    >
                      <Form.Control
                        className="inputs"
                        type="name"
                        placeholder="Confirmation Code"
                        value={OTPinput}
                        onChange={(e) => setOTPinput(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      style={{ width: "100%", fontWeight: "700" }}
                      className="verify-btn btn-block shadow-none mt-2 mb-3"
                      type="button"
                      onClick={() => verfiyCode()}
                    >
                      {isLoading ? (
                        <Spinner
                          animation="border"
                          role="status"
                          style={{
                            width: "20px",
                            height: "20px",
                            margin: "auto",
                            display: "block",
                          }}
                        ></Spinner>
                      ) : (
                        "Next"
                      )}
                    </Button>
                    <a
                      className="mt-4"
                      style={{
                        color: "#38b58b",
                        cursor: "pointer",
                        fontSize: "large",
                        fontWeight: "600",
                        textDecoration: "none",
                        marginTop: "10px",
                      }}
                      onClick={() => setShowOTPinput(false)}
                    >
                      Go Back
                    </a>
                  </Form>
                </div>
              </Col>
            </>
          )}
        </Col>
      </div>
    </div>
  );
};

export default RegisterScreen;
