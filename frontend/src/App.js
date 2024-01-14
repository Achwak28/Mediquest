import React from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { createContext } from "react";
import 'react-toastify/dist/ReactToastify.css'

export const RecoveryContext = createContext();



const App = () => {
  return (
    <>
      <Header />
      <main >
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Outlet />
        </Container>
      </main>
      <ToastContainer />
    </>
  );
};

export default App;
