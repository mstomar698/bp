import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';

function App() {
  return (
    <div className="bg-black min-h-screen max-w-full overflow-hidden">
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
