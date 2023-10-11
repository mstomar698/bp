import { FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-black/30 border-green-300 border hover:border-green-500 focus:border-green-500 mb-0.5 rounded-t-md">
      <div className="flex justify-center items-center my-2 gap-4">
        <Link
          to="https://github.com/mstomar698"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 hover:text-green-500 mx-2"
        >
          <FaGithub size={24} />
        </Link>
        <Link
          to="https://www.linkedin.com/in/mayank-tomar-726187205/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 hover:text-green-500 mx-2"
        >
          <FaLinkedin size={24} />
        </Link>
        <Link
          to="https://www.mstomar.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 hover:text-green-500 mx-2"
        >
          <FaGlobe size={24} />
        </Link>
      </div>
      <h1 className="text-green-300 text-xl max-sm:text-lg mb-2 text-center flex items-center justify-center">
        Made by{' '}
        <Link
          className="text-red-300 underline pl-2"
          to={'/https://mstomar.co'}
        >
          mstomar698
        </Link>
      </h1>
    </div>
  );
};

export default Footer;
