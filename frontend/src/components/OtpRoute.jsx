import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OtpRoute = () => {
  const  otpCode  = localStorage.getItem('otpCode')
  return otpCode ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  ); 
};
export default OtpRoute;
