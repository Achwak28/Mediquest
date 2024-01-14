import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ResetRoute = () => {
  const  ResetCode  = localStorage.getItem('resetPassword')
  return ResetCode ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  ); 
};
export default ResetRoute;
