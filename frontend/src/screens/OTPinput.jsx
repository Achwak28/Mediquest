import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSendOTPMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";

export default function () {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  const [otpCode, setOTPCode] = useState(data.otp);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const email = data.email.email;

  const [sendOTP, { isLoading }] = useSendOTPMutation();

  const resendOTP = async () => {
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    setOTPCode(OTP);
    if (disable) {
      toast.error("Wait for 1 min to ask for another OTP code");
    } else {
      try {
        await sendOTP({ recipient_email: email, OTP: OTP }).unwrap();
        setTimeout(() => setOTPCode(null), 300000);
        setDisable(true);
        setTimer(60);
        toast.success("A new OTP has succesfully been sent to your email.");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const verfiyOTP = () => {
    if (parseInt(OTPinput.join("")) === otpCode) {
      const data = { email: { email } };
      setLoadingCheck(true);
      setTimeout(() => {
        localStorage.removeItem("otpCode");
        localStorage.setItem("resetPassword", JSON.stringify(true));
        setTimeout(() => localStorage.removeItem("resetPassword"), 600000);
        navigate("/resetpassword", { state: data });
      }, 4000);
    } else {
      toast.error(
        "The code you have entered is not correct, try again or re-send the code"
      );
    }
  };

  useEffect(() => {
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
  }, [disable]);

  return (
    <>
      <div
        className="container-forgot"
        style={{
          backgoundColor: "#f1f2f5",
        }}
      >
        <Row
          className="justify-content-center"
          style={{
            paddingTop: "7rem",
            paddingBottom: "7rem",
            backgoundColor: "#f1f2f5",
            height: "100vh",
            color: "black",
          }}
        >
          <Col md={6}>
            <Card
              className="p-3 d-flex align-items-center  
                        justify-content-center rounded shadow-lg mx-3"
            >
              <ListGroup variant="flush">
                {isLoading && <Loader />}
                <ListGroup.Item>
                  <h2>Enter Verification Code</h2>
                  <p style={{ color: "gray" }}>
                    We have sent a code to your email {data.email.email}{" "}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <input
                    maxLength="1"
                    type="text"
                    name=""
                    id=""
                    className="rounded otp-input"
                    onChange={(e) =>
                      setOTPinput([
                        e.target.value,
                        OTPinput[1],
                        OTPinput[2],
                        OTPinput[3],
                      ])
                    }
                  ></input>
                  <input
                    maxLength="1"
                    type="text"
                    name=""
                    id=""
                    className="rounded otp-input"
                    onChange={(e) =>
                      setOTPinput([
                        OTPinput[0],
                        e.target.value,
                        OTPinput[2],
                        OTPinput[3],
                      ])
                    }
                  ></input>
                  <input
                    maxLength="1"
                    type="text"
                    name=""
                    id=""
                    className="rounded otp-input"
                    onChange={(e) =>
                      setOTPinput([
                        OTPinput[0],
                        OTPinput[1],
                        e.target.value,
                        OTPinput[3],
                      ])
                    }
                  ></input>
                  <input
                    maxLength="1"
                    type="text"
                    name=""
                    id=""
                    className="rounded otp-input"
                    rounded
                    onChange={(e) =>
                      setOTPinput([
                        OTPinput[0],
                        OTPinput[1],
                        OTPinput[2],
                        e.target.value,
                      ])
                    }
                  ></input>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    className="verify-btn btn-block shadow-none"
                    type="button"
                    onClick={() => verfiyOTP()}
                  >
                    {loadingCheck ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p style={{ fontSize: "medium" }}>Didn't recieve code?</p>{" "}
                  <a
                    style={{
                      color: disable ? "gray" : "#38b58b",
                      cursor: disable ? "none" : "pointer",
                      textDecorationLine: disable ? "none" : "underline",
                      fontSize: "medium",
                    }}
                    onClick={() => resendOTP()}
                  >
                    {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
