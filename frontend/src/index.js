import React from "react";
import ReactDOM from "react-dom/client";
//import 'bootstrap/dist/css/bootstrap.min.css'
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./screens/homeScreen/HomeScreen";
import ExamsScreen from "./screens/exams/ExamsScreen";
import CoursesScreen from "./screens/exams/CoursesScreen";
import SummariesScreen from "./screens/exams/SummariesScreen";
import SearchScreen from "./screens/exams/SearchScreen";
import DocumentScreen from "./screens/DocumentScreen";
import LoginScreen from "./screens/loginScreen/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen/RegisterScreen";
import OtpRoute from "./components/OtpRoute";
import OTPinput from "./screens/OTPinput";
import ResetRoute from "./components/ResetRoute";
import ResetPassword from "./screens/ResetPassword";
import CollectionScreen from "./screens/CollectionScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import DocumentListScreen from "./screens/admin/DocumentListScreen";
import DocumentEditScreen from "./screens/admin/DocumentEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/exams" element={<ExamsScreen />} />
      <Route path="/courses" element={<CoursesScreen />} />
      <Route path="/summaries" element={<SummariesScreen />} />
      <Route path="/search/:keyword" element={<SearchScreen />} />
      <Route path="/page/:pageNumber" element={<SearchScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<SearchScreen />}
      />
      <Route path="/document/:id" element={<DocumentScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      
      

      <Route path="" element={<OtpRoute />}>
      <Route path="/forgotpassword" element={<OTPinput />} />
      </Route>

      <Route path="" element={<ResetRoute />}>
      <Route path="/resetpassword" element={<ResetPassword />} />
      </Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/collection/:id" element={<CollectionScreen />} />
        <Route path="/profile" element={<ProfileScreen />}>
          <Route path="/profile/userinfo" element={<ProfileScreen />} />
          <Route path="/profile/favourites" element={<ProfileScreen />} />
          <Route path="/profile/collections" element={<ProfileScreen />} />
        </Route>
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/documentlist" element={<DocumentListScreen />} />
        <Route
          path="/admin/documentlist/:pageNumber"
          element={<DocumentListScreen />}
        />
        <Route
          path="/admin/document/:id/edit"
          element={<DocumentEditScreen />}
        />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
