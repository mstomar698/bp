import { Store } from '../store';
import { useContext } from 'react';

const HomeScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  console.log(userInfo);
  return (
    <div className="text-green-300 min-h-screen flex flex-grow justify-center items-center">
      <div>
        HomeScreen <br />
        {userInfo ? <>Authenticated</> : <>UnAuthenticated</>}
      </div>
    </div>
  );
};

export default HomeScreen;
