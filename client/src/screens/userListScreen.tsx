import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../store';

type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type State = {
  loading: boolean;
  error: string;
  users: User[];
  loadingDelete: boolean;
  successDelete: boolean;
};

type Action =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_FAIL'; payload: string }
  | { type: 'DELETE_REQUEST' }
  | { type: 'DELETE_SUCCESS' }
  | { type: 'DELETE_FAIL' }
  | { type: 'DELETE_RESET' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function UserListScreen(): JSX.Element {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      users: [],
      loadingDelete: false,
      successDelete: false,
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get<User[]>(
          `https://descriptive-bubble-production.up.railway.app/api/users`,
          {
            headers: { Authorization: `${userInfo!.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err: any) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user: User) => {
    if (window.confirm(`Your are Deleteing "${user.name}"`)) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(
          `https://descriptive-bubble-production.up.railway.app/api/users/${user._id}`,
          {
            headers: { Authorization: `${userInfo!.token}` },
          }
        );
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err: any) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div className="h-screen p-8 bg-gray-200">
      <div className="p-4 h-[550px] w-screen-min overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        {loadingDelete && <p className="text-center">Deleting...</p>}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <table className="table-auto w-full text-center border shadow-2xl rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 border shadow-lg">
                <th className="p-2 text-center">ID</th>
                <th className="p-2 text-center">NAME</th>
                <th className="p-2 text-center">EMAIL</th>
                <th className="p-2 text-center">IS ADMIN</th>
                <th className="p-2 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="p-2">{user._id}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.isAdmin ? 'YES' : 'NO'}</td>
                  <td className="p-2">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded m-1"
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-300 hover:bg-red-400 px-2 py-1 rounded m-1"
                      onClick={() => deleteHandler(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
