import { Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
    </Routes>
  );
};

export default AllRoutes;
