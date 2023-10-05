import { useContext, useState } from 'react';
import { Store } from '../store';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt } from 'react-icons/fa';
import { HiDotsVertical, HiMenu } from 'react-icons/hi';
import { RxCross1 } from 'react-icons/rx';

const Navbar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [userMenu, setUserMenu] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);
  const { userInfo } = state;
  const handleUserMenuClick = () => {
    setUserMenu((prevState) => !prevState);
    setMobileMenu(false);
  };

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
    handleUserMenuClick();
  };
  return (
    <div>
      <header className="bg-gray-300">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-black space-x-2 font-bold text-lg flex flex-row"
            >
              <FaHome className="mt-1" />
              <span className="mr-2">mstomar698</span>
            </Link>
          </div>
          <div>
            {/* for mobile */}
            {userInfo ? (
              <>
                <div className="lg:hidden md:hidden">
                  <div
                    className="text-black focus:outline-none border rounded-lg p-1 shadow-lg bg-gray-500 px-2 flex flex-row"
                    onClick={() => setMobileMenu(true)}
                  >
                    <HiMenu className="text-3xl" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="lg:hidden md:hidden text-black hover:underline"
                >
                  <button className="text-black focus:outline-none border rounded-lg p-1 shadow-lg bg-gray-500 px-2 flex flex-row">
                    <FaSignInAlt className="mt-1" />
                    <span className="ml-2">Sign In</span>
                  </button>
                </Link>
              </>
            )}
            {mobileMenu && (
              <div className="lg:hidden md:hidden h-screen w-full top-0 z-10 left-0 absolute bg-black text-white">
                <div>
                  {userInfo ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-32">
                      <h1 className="shadow-white/50 shadow-sm rounded-lg p-1">
                        {userInfo.name}
                      </h1>
                      <div className="border-2 shadow-white/50 shadow-lg m-4 rounded-lg p-4">
                        <div
                          className="text-white/80 w-full flex justify-center items-center shadow-2xl"
                          onClick={() => setMobileMenu(false)}
                        >
                          <RxCross1 className="text-3xl" />
                        </div>
                        <div className="text-white/80 w-full flex justify-center items-center shadow-2xl">
                          <Link
                            to="/profile"
                            onClick={handleUserMenuClick}
                            className="block px-4 py-2 hover:bg-indigo-500 hover:text-red-500"
                          >
                            Profile
                          </Link>
                        </div>
                        {userInfo.isAdmin && (
                          <div className="">
                            <div className="w-full flex  justify-center items-center shadow-2xl">
                              <Link
                                to="/admin/users"
                                onClick={handleUserMenuClick}
                                className="block px-4 py-2 hover:bg-indigo-500 hover:text-red-500"
                              >
                                Users
                              </Link>
                            </div>
                            <div className="text-white/80 w-full flex  justify-center items-center shadow-2xl">
                              <Link
                                to="/admin/dashboard"
                                onClick={handleUserMenuClick}
                                className="block px-4 py-2 hover:bg-indigo-500 hover:text-red-500"
                              >
                                Dashboard
                              </Link>
                            </div>
                          </div>
                        )}

                        <div className="text-white/80 w-full flex  justify-center items-center shadow-2xl">
                          <div
                            onClick={signoutHandler}
                            className="block px-4 py-2 hover:bg-indigo-500 hover:text-red-500"
                          >
                            SignOut
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>{setMobileMenu(false)}</>
                  )}
                </div>
              </div>
            )}
            {/* for lg-Device */}
            <nav className="max-sm:hidden flex items-center justify-end">
              {userInfo ? (
                <div className="relative mx-1">
                  <button
                    className="text-black focus:outline-none border rounded-lg p-1 shadow-lg bg-gray-500 px-2 flex flex-row"
                    onClick={handleUserMenuClick}
                  >
                    <span className="mr-2">{userInfo.name}</span>
                    <HiDotsVertical className="mt-1" />
                  </button>
                  {userMenu && (
                    <>
                      <div className="absolute right-0 mt-2 w-48 bg-green-400 rounded-md shadow-green-700 shadow-xl z-10 p-2">
                        <ul className="text-center">
                          <li>
                            <Link
                              to="/profile"
                              onClick={handleUserMenuClick}
                              className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-red-500"
                            >
                              Profile
                            </Link>
                          </li>
                          {userInfo.isAdmin && (
                            <>
                              <ul>
                                <li>
                                  <Link
                                    to="/admin/users"
                                    onClick={handleUserMenuClick}
                                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-red-500"
                                  >
                                    Users
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/admin/dashboard"
                                    onClick={handleUserMenuClick}
                                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-red-500"
                                  >
                                    Dashboard
                                  </Link>
                                </li>
                              </ul>
                            </>
                          )}
                          <li>
                            <button
                              onClick={signoutHandler}
                              className="w-full px-4 py-2 shadow-2xl shadow-green-900 text-gray-800 hover:bg-indigo-500 hover:text-red-500 text-center"
                            >
                              Sign Out
                            </button>
                          </li>
                        </ul>
                        {userInfo.isAdmin && (
                          <>
                            <ul>
                              <li>
                                <Link
                                  to="/admin/dashboard"
                                  onClick={handleUserMenuClick}
                                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-red-500"
                                >
                                  Dashboard
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/admin/users"
                                  onClick={handleUserMenuClick}
                                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-red-500"
                                >
                                  Users
                                </Link>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="text-black hover:underline">
                  <button className="text-black focus:outline-none border rounded-lg p-1 shadow-lg bg-gray-500 px-2 flex flex-row">
                    <FaSignInAlt className="mt-1" />
                    <span className="ml-2">Sign In</span>
                  </button>
                </Link>
              )}
            </nav>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
