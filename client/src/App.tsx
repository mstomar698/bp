import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="bg-black min-h-screen max-w-full overflow-hidden">
      <BrowserRouter>
        <AllRoutes />
        <ToastContainer position="bottom-center" limit={1} />
      </BrowserRouter>
    </div>
  );
}

export default App;
