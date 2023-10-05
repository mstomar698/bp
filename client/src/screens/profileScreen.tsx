import React, { useContext, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Store } from '../store';

interface State {
  loadingUpdate: boolean;
}

type Action =
  | { type: 'UPDATE_REQUEST' }
  | { type: 'UPDATE_SUCCESS' }
  | { type: 'UPDATE_FAIL' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState<string>(userInfo!.name);
  const [email, setEmail] = useState<string>(userInfo!.email);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      console.log(loadingUpdate);
      const { data } = await axios.put(
        'https://descriptive-bubble-production.up.railway.app/user/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { authorization: `${userInfo!.token}` },
        }
      );

      dispatch({
        type: 'UPDATE_SUCCESS',
      });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err: any) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className="h-screen p-4 md:p-16 bg-gray-200">
      <div className="mx-auto max-w-md border shadow-2xl p-8 rounded-lg">
        <h1 className="my-3 text-3xl font-bold text-center">User Profile</h1>
        <form onSubmit={submitHandler} className="space-y-3">
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="name">
              Name
            </label>
            <input
              title="name"
              className="border border-gray-300 p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="email">
              Email
            </label>
            <input
              title="email"
              className="border border-gray-300 p-2 rounded"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="password">
              Password
            </label>
            <input
              title="password"
              className="border border-gray-300 p-2 rounded"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              title="confirmPassword"
              className="border border-gray-300 p-2 rounded"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;
