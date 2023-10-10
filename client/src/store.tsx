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
  collections: {
    [email: string]: string[];
  };
}

interface ActionType {
  type: string;
  payload?: any;
}

const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const booksString = localStorage.getItem('books');
const books = booksString ? JSON.parse(booksString) : [];
const collectionString = localStorage.getItem(`collection_${userInfo?.email}`);
const collections = collectionString ? JSON.parse(collectionString) : [];
const initialState: StateType = {
  fullBox: false,
  userInfo,
  books,
  collections: { [userInfo?.email]: collections },
};

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'USER_SIGNIN':
      const currentUser = action.payload;
      const usersCollections = state.collections[currentUser.email] || [];
      return {
        ...state,
        userInfo: action.payload,
        collections: {
          ...state.collections,
          [currentUser.email]: usersCollections,
        },
      };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        collections: {},
        books: [],
      };
    case 'ADD_BOOK_TO_COLLECTION':
      const user = state.userInfo;
      if (user && user.email in state.collections) {
        const updatedCollection = [
          ...state.collections[user.email],
          action.payload,
        ];
        return {
          ...state,
          collections: {
            ...state.collections,
            [user.email]: updatedCollection,
          },
        };
      }
      return state;
    default:
      return state;
  }
}

export const Store = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
  fetchCollectionsOnAdd: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchCollectionsOnAdd: async () => {},
});

export function StoreProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.userInfo) {
      const fetchBooks = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/books`,
            {
              headers: { Authorization: `${state?.userInfo?.token}` },
            }
          );

          if (response.status === 200) {
            const books = response.data;
            dispatch({ type: 'FETCH_BOOKS_SUCCESS', payload: books });
            localStorage.setItem('books', JSON.stringify(books));
          }
        } catch (error: any) {
          console.error('Error fetching books:', error);
          dispatch({ type: 'FETCH_BOOKS_ERROR', payload: error.message });
        }
      };
      const fetchCollections = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/collections/get_collections`,
            {
              email: state.userInfo?.email,
            },
            {
              headers: { Authorization: `${state?.userInfo?.token}` },
            }
          );

          if (response.status === 200) {
            const collections = response.data;
            dispatch({
              type: 'FETCH_COLLECTIONS_SUCCESS',
              payload: collections,
            });
            localStorage.setItem(`collections_${state.userInfo?.email}`, JSON.stringify(collections));
          }
        } catch (error: any) {
          console.error('Error fetching collections:', error);
          localStorage.setItem(`collections_${state.userInfo?.email}`, JSON.stringify({}));
          dispatch({ type: 'FETCH_COLLECTIONS_ERROR', payload: error.message });
        }
      };
      fetchCollections();

      fetchBooks();
    }
  }, [state.userInfo]);

  const fetchCollectionsOnAdd = async () => {
    if (state.userInfo) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/collections/get_collections`,
          {
            email: state.userInfo?.email,
          },
          {
            headers: { Authorization: `${state?.userInfo?.token}` },
          }
        );

        if (response.status === 200) {
          const collections = response.data;
          dispatch({
            type: 'FETCH_COLLECTIONS_SUCCESS',
            payload: collections,
          });
          localStorage.setItem(`collections_${state.userInfo?.email}`, JSON.stringify(collections));
        }
      } catch (error: any) {
        console.error('Error fetching collections:', error);
        localStorage.setItem(`collections_${state.userInfo?.email}`, JSON.stringify({}));
        dispatch({
          type: 'FETCH_COLLECTIONS_ERROR',
          payload: error.message,
        });
      }
    }
  };

  const value = { state, dispatch, fetchCollectionsOnAdd };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
