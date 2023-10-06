import { useContext, useEffect, useState } from 'react';
import { Store } from '../store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const SigninScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post<{ email: string; password: string }>(
        'https://bp-production.up.railway.app/auth/signin',
        // 'http://localhost:5000/auth/signin',
        { email, password }
      );
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err: any) {
      toast.error(getError(err));
    }
  };

    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);

  return (
    <div className="h-screen p-6 md:p-32 flex justify-center items-center">
      <div className="min-w-[50%]  min-h-[70%] mx-auto px-auto border-2 border-green-300 hover:border-2 hover:border-green-500 rounded shadow-xl p-16 max-sm:p-4 space-y-2">
      <Link to={'/'} className="text-center text-3xl underline text-green-500 flex lfex -row justify-center items-center mb-4">
          BookPedia
       </Link>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-bold text-green-300 "
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded border-2 border-green-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 font-bold text-green-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border-2 border-green-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
          <div className="text-white text-center my-4">
            New customer?{' '}
            <Link to={`/signup?redirect=${redirect}`}>
              <span className="text-green-300 font-semibold underline">
                Create your account
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninScreen;
