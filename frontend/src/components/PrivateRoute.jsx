import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfoMediquest } = useSelector((state) => state.auth);
  return userInfoMediquest ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;
