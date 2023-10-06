import axios from 'axios';
import React, { createContext, useEffect, useReducer } from 'react';

interface StateType {
  fullBox: boolean;
  userInfo: {
    name: string;
    email: string;
    token: string;
    isAdmin: boolean;
  } | null;
  books: any;
}

interface ActionType {
  type: string;
  payload?: any;
}

const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const booksString = localStorage.getItem('books');
const books = booksString ? JSON.parse(booksString) : [];
const initialState: StateType = {
  fullBox: false,
  userInfo,
  books,
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
    default:
      return state;
  }
}

export const Store = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function StoreProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Fetch books if user is authenticated
    if (state.userInfo) {
      const fetchBooks = async () => {
        try {
          const response = await axios.get('https://bp-production.up.railway.app/api/books', {
          // const response = await axios.get('http://localhost:5000/api/books', {
            headers: { Authorization: `${state?.userInfo?.token}` },
          });

          if (response.status === 200) {
            const books = response.data;
            // Dispatch an action to update the state with the fetched books
            dispatch({ type: 'FETCH_BOOKS_SUCCESS', payload: books });
            localStorage.setItem('books', JSON.stringify(books));
          }
        } catch (error: any) {
          console.error('Error fetching books:', error);
          // Dispatch an action for error handling if needed
          dispatch({ type: 'FETCH_BOOKS_ERROR', payload: error.message });
        }
      };

      fetchBooks();
    }
  }, [state.userInfo]);

  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
