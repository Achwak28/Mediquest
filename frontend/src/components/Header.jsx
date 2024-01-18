import React from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
  NavItem,
} from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { userInfoMediquest } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const dark = {
    backgroundColor: "#0d0d0d",
  };
  const white = {
    color: "white",
  };
  const bolder = {
    fontWeight: "bolder",
  };

  return (
    <header style={{ background: "#0d0d0d", position: "fixed", top: "0", width:"100%", zIndex:99 }}>
      <Navbar variant="dark" expand="lg" collapseOnSelect style={dark}>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="logo bolder">
              Medi<span style={{ color: "#75dab4" }}>Q</span>uest
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto m-auto">
              <LinkContainer
                className="white mx-2"
                to="/exams"
                style={{ cursor: "pointer" }}
              >
                <NavItem eventKey={1}>Exams</NavItem>
              </LinkContainer>
              <LinkContainer
                className="white mx-2"
                to="/courses"
                style={{ cursor: "pointer" }}
              >
                <NavItem eventKey={2}>Courses</NavItem>
              </LinkContainer>
              <LinkContainer
                className="white mx-2"
                to="/summaries"
                style={{ cursor: "pointer" }}
              >
                <NavItem eventKey={3}>Summaries</NavItem>
              </LinkContainer>
            </Nav>
            <SearchBox />
             {/* Admin Links */}
             {userInfoMediquest && userInfoMediquest.isAdmin && (
              <NavDropdown
                title="Dashboard"
                id="adminDashboard"
                className="mx-2"
                style={{
                  cursor: "pointer",
                  color: "white",
                 
                  fontWeight:"bold",
                }}
              >
                <LinkContainer to="/admin/documentlist">
                  <NavDropdown.Item>Documents</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
           
            {userInfoMediquest ? (
              <>
                <NavDropdown
                  title={userInfoMediquest.name}
                  id="username"
                  className="mx-2"
                  style={{
                    color: "#75dab4",
                    marginRight: "0.9rem",
                    
                    fontWeight: "bold",
                  }}
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                <LinkContainer to="/profile" style={{ cursor: "pointer" }}>
                  <Nav.Link>
                    <Image
                      src={userInfoMediquest.image}
                      className="mx-2"
                      alt="user image"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: userInfoMediquest.image === '/images/user_image.png' ? '0' : '50%',
                      }}
                    />
                  </Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <LinkContainer
                to="/login"
                style={{
                  cursor: "pointer",
                  color: "white",
                  marginLeft: "0.5rem",
                }}
              >
                <Nav.Link>
                  Sign In
                  <FaUserCircle
                    style={{ marginLeft: "0.3rem" }}
                    color="white"
                    size={30}
                  />
                </Nav.Link>
              </LinkContainer>
            )}

            {"  "}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
