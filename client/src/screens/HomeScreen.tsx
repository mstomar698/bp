import { Store } from '../store';
import { useContext } from 'react';
import Navbar from '../components/navbar';

const HomeScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  console.log(userInfo);
  return (
    <div>
      <Navbar />
      <div className="text-green-300 min-h-screen flex flex-grow justify-center items-center">
        <div>
          HomeScreen <br />
          {userInfo ? <>Authenticated</> : <>UnAuthenticated</>}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
