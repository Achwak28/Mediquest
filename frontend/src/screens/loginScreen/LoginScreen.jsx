import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import StyledButton from "../../components/Button";
import { useLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
 import './LoginScreen.css'
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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

  return (
    <Row className="login-container">
    <Col className="login-content" md={6}>
      <FormContainer>
        <h1 className="white">Welcome</h1>
        <p className="white">Sign In to continue to MediQuest</p>
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
          <Link  controlId="forgotPassword"
              to=""
              style={{ color: "#75dab4", marginBottom: "0.5rem" }}
            >
              {" "}
             
              Forgot Password?
       
             
            </Link>
          </Form.Group>
     
          <StyledButton text="LOGIN" type="submit"  />

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3">
          <Col className="white">
            Don't have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
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
