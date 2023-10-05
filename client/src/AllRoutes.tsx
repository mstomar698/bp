import { Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SigninScreen from './screens/SiginScreen';
import SignupScreen from './screens/SignupScree';
import AdminRoute from './components/adminRoute';
import UserEditScreen from './screens/userEditScreen';
import UserListScreen from './screens/userListScreen';
import DashboardScreen from './screens/dashboardScreen';
import ProtectedRoute from './components/protectedRoute';
import ProfileScreen from './screens/profileScreen';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SigninScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <DashboardScreen />
          </AdminRoute>
        }
      ></Route>
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserListScreen />
          </AdminRoute>
        }
      ></Route>
      <Route
        path="/admin/user/:id"
        element={
          <AdminRoute>
            <UserEditScreen />
          </AdminRoute>
        }
      ></Route>
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  );
};

export default AllRoutes;
