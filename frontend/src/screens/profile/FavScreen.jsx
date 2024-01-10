import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useProfileMutation,
  useGetFavListQuery,
  useGetUserProfileQuery,
} from "../../slices/usersApiSlice";
import { useGetDocumentsQuery } from "../../slices/documentApiSlice";
import StyledButton from "../../components/Button";
import "./ProfileScreen.css";
import ExamCard from "../../components/ExamCard";
import "../exams/ExamsSCreen.css";

const ProfileScreen = () => {
  const { userInfoMediquest } = useSelector((state) => state.auth);
  //const [favList, setFavList] = useState(userInfoMediquest.favourites);

  const { pageNumber, keyword } = useParams();
  const { data: userProfile, isLoadingUserProfile } = useGetUserProfileQuery();

  const { data: documents, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
  });

  //const { data: favourites, error, isLoading: loandingFav } = useGetFavListQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();




  return (
    <>
        <Row className="exams-row">
          <Col
            className="content-side"
            style={{ backgroundColor: "#161616" }}
            md={9}
          >
            <Row className="p-3 mt-3">
              <Col>
                <strong>Favourites</strong>
              
              </Col>
            </Row> 

            
          
              {isLoadingUserProfile ? (
                <Loader/> 
              ) : (
                <Row className="p-1 m-2 justify-content-center">
                {userProfile?.favourites.map((document) => (
                  <Col key={document._id} >
                    <ExamCard document={document} className="m-3" />
                  </Col>
                ))}
                 </Row>
              )}
              
           
          </Col>
        </Row>
 
    </>
  );
};

export default ProfileScreen;
