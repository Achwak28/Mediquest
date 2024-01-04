import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfoMediquest } = useSelector((state) => state.auth);
  return userInfoMediquest && userInfoMediquest.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  ); 
};
export default AdminRoute;
