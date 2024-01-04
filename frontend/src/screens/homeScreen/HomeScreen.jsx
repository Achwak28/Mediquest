import React from "react";
import { Col, Row } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
//import Product from "../../components/Product";
//import { useGetProductsQuery } from "../slices/productApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { FaArrowRightLong } from "react-icons/fa6";
import "./HomeScreen.css";
import bg from "../../assets/homepage_bg.png";

var sectionStyle = {
  backgroundImage: `url(${bg})`,
};

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  /* const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });*/

  return (
    <div className="home-container" >

        <Col md={7} className="home-content">
          <h1 className='mb-2'>
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

/*
before using redux toolkit

import axios from "axios";
import { useEffect, useState } from "react";


const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    };
    fetchProducts();
  }, []);
*/

/*

<>
       {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>


*/
