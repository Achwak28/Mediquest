import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import "./HomeScreen.css";


const HomeScreen = () => {
  
 

  return (
    <div className="home-container" >

        <Col md={7} className="home-content">
          <h1 className='mb-2 mt-3'>
            Empower Your<br></br> Mind through<br></br> Medi
            <span style={{ color: "#75dab4" }}>Q</span>uest
          </h1>
          <p style={{color:'#ebf4f5'}}>
            With our user-friendly interface and <br /> comprehensive {" "}
            curriculum, you'll<br /> embark  on a transformative journey
          </p>
          <Link to="/exams" className="mt-2">
            <button type="button" className="start-btn">
              START LEARNING {' '} <FaArrowRightLong color="black" />
            </button>
          </Link>
        </Col>
        <Col md={6}></Col>

    </div>
  );
};

export default HomeScreen;
