import { Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SigninScreen from './screens/SiginScreen';
import SignupScreen from './screens/SignupScree';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SigninScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  );
};

export default AllRoutes;
