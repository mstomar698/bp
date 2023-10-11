import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';
import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {
  return (
    <div className="bg-black min-h-screen max-w-full overflow-hidden">
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen mt-20">
          <AllRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
