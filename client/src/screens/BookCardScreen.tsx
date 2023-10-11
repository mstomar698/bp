import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getError } from '../utils';
import { Store } from '../store';
// import {
//   BsFillArrowLeftSquareFill,
//   BsFillArrowRightSquareFill,
//   BsFillPlayCircleFill,
// } from 'react-icons/bs';
import { FcReading, FcReadingEbook } from 'react-icons/fc';
import { RxCross2 } from 'react-icons/rx';

type Book = {
  name: string;
  author: string;
  genre: string;
  yearRelease: number;
  price: number;
  reads: number;
  purchases: number;
  publishedBy: string;
  description: string;
  coverImage: string;
};
type BookCardScreenState = {
  loading: boolean;
  error: string;
  loadingUpdate: boolean;
  book: Book | null;
  scrolled: boolean;
};

type BookCardScreenAction =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: any }
  | { type: 'FETCH_FAIL'; payload: string }
  | { type: 'SET_SCROLLED'; payload: boolean };

const reducer = (
  state: BookCardScreenState,
  action: BookCardScreenAction
): BookCardScreenState => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, book: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SCROLLED':
      return { ...state, scrolled: action.payload };
    default:
      return state;
  }
};

// We are using separate reducers to fetch book from its ID that we get from PARAMS
const BookCardScreen: React.FC = () => {
  const [{ error, book }, dispatchBook] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingUpdate: false,
    book: null,
    scrolled: false,
  });

  // We have to use original store dispatch to update the collections if we add book from book card screen
  const { state, dispatch, fetchCollectionsOnAdd } = useContext(Store);
  const { userInfo, collections } = state;
  const [
    deleteBookFromCollectionConfirmatonModal,
    setDeleteBookFromCollectionConfirmatonModal,
  ] = useState(false);
  const [bookInCollection, setBookInCollection] = useState<{
    [bookId: string]: boolean;
  }>({});

  const params = useParams<{ id: string }>();
  const { id: bookId } = params;
  const navigate = useNavigate();

  const handleBookDeletionFormCollections = async (bookId: string) => {
    const payload = {
      email: userInfo?.email,
      bookId: bookId,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/collections/delete/book_from_collection`,
        payload,
        {
          headers: { Authorization: `${userInfo!.token}` },
        }
      );
      if (response.status === 200) {
        const collectionString = localStorage.getItem(
          `collection_${userInfo?.email}`
        );
        let collection = collectionString ? JSON.parse(collectionString) : [];

        collection = collection.filter((id: string) => id !== bookId);

        localStorage.setItem(
          `collection_${userInfo?.email}`,
          JSON.stringify(collection)
        );
        setBookInCollection((prevState) => ({
          ...prevState,
          [bookId]: true,
        }));
        fetchCollectionsOnAdd();
        setDeleteBookFromCollectionConfirmatonModal(false);
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error deleting book:', error);
    }
  };
  const handleAddToCollections = async (bookId: string) => {
    const BookExistInCollection =
      userInfo?.email &&
      userInfo.email in collections &&
      collections[userInfo.email].includes(bookId);
    if (BookExistInCollection) {
      setDeleteBookFromCollectionConfirmatonModal(true);
      return;
    }
    const payload = {
      email: userInfo?.email,
      bookId: bookId,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/collections/add_to_collection`,
        payload,
        {
          headers: { Authorization: `${userInfo!.token}` },
        }
      );
      if (response.status === 200) {
        const collectionString = localStorage.getItem(
          `collection_${userInfo?.email}`
        );
        let collection = collectionString ? JSON.parse(collectionString) : [];
        if (!collection.includes(bookId)) {
          collection.push(bookId);
          localStorage.setItem(
            `collection_${userInfo?.email}`,
            JSON.stringify(collection)
          );
          dispatch({ type: 'ADD_BOOK_TO_COLLECTION', payload: bookId });
          setBookInCollection((prevState) => ({
            ...prevState,
            [bookId]: true,
          }));
          fetchCollectionsOnAdd();
        }
      }
    } catch (error: any) {
      console.error('Error Adding book to collections:', error);
      dispatch({
        type: 'ERROR_ADD_BOOK_TO_COLLECTION',
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatchBook({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/books/${bookId}`,
          {
            headers: { Authorization: `${userInfo!.token}` },
          }
        );
        dispatchBook({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err: any) {
        dispatchBook({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [bookId, userInfo]);

  useEffect(() => {
    if (userInfo) {
      fetchCollectionsOnAdd();

      const booksInCollection: { [bookId: string]: boolean } = {};
      collections[userInfo.email]?.forEach((bookId: string) => {
        booksInCollection[bookId] = true;
      });
      setBookInCollection(booksInCollection);
    }
  }, [userInfo, collections, fetchCollectionsOnAdd]);

  return (
    <div className="bg-black text-green-300 min-h-screen">
      {book ? (
        <p className="text-red-600 hidden" hidden>
          {''}
        </p>
      ) : (
        <p className="text-green-600 flex justify-center items-center min-h-screen text-3xl">
          {'Loading...'}
        </p>
      )}
      {error && <p className="text-green-600">{error}</p>}
      {book && (
        <>
          <div
            className={`sm:px-16 px-6 min-h-screen flex items-center w-full`}
          >
            <div className="container mx-auto px-4 max-sm:px-0 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`sm:px-16 px-6 sm:py-8 py-2 flex justify-center items-center`}
                >
                  <div className="relative bg-center bg-cover bg-no-repeat w-max max-sm:w-fit">
                    <img
                      src={book.coverImage}
                      alt="Product"
                      className="object-cover h-max min-h-[500px] max-sm:min-h-[300px] w-max overflow-hidden rounded-md border border-gray-100 p-0.5"
                    />
                    {/* TODO: Add a mover if we have more images than one */}
                    {/* <div
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full py-2 px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <BsFillArrowLeftSquareFill className="w-6 h-12 text-black" />
                    </div>
                    <div
                      className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full py-2 px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <BsFillArrowRightSquareFill className="w-6 h-12 text-black" />
                    </div> */}
                  </div>
                </div>
                <div
                  className={`sm:px-16 px-6 sm:py-12 py-2 justify-start flex flex-wrap gap-8`}
                >
                  <div className="w-full p-4 pt-2">
                    <p className="text-white/50 mb-0">Title</p>
                    <h1 className="lg:text-4xl max-sm:text-xl font-bold mb-4">
                      {book.name}
                    </h1>
                    <p className="text-white/50 mb-4 max-sm:text-sm">
                      {book.description}
                    </p>
                    <p className="text-md text-white/50 max-sm:text-sm">
                      Author:{' '}
                      <span className="text-green-300 pl-1">
                        {book.author} ({book.yearRelease})
                      </span>
                    </p>
                    <p className="text-sm text-white/50 mb-2 max-sm:text-xs">
                      Genre:{' '}
                      <span className="text-green-300 pl-1">{book.genre}</span>
                    </p>
                    <p className="text-md text-white/50 max-sm:text-sm">
                      Published by:{' '}
                      <span className="text-green-300 pl-1">
                        {book.publishedBy}
                      </span>
                    </p>
                    <p className="text-xs text-white/50 mb-4">
                      Added by:{' '}
                      <span className="text-green-300 pl-1">
                        {book.publishedBy}
                      </span>
                    </p>
                    <div className="flex flex-row flex-wrap w-full justify-between sm:px-2 lg:pl-4 lg:pr-16 my-4">
                      <div className="lg:text-2xl sm:text-md flex flex-row justify-center gap-2">
                        <FcReading className="mt-1" /> Total Reads: {book.reads}
                      </div>
                      <div className="lg:text-2xl sm:text-md flex flex-row justify-center gap-2">
                        <FcReadingEbook className="mt-1" /> Total Sold:{' '}
                        {book.purchases}
                      </div>
                    </div>
                    <p className="text-xs text-white/50 mb-2">
                      Type:{' '}
                      <span className="text-green-300 pl-1">
                        {' '}
                        NOT ASSIGNED YET
                      </span>
                    </p>
                    <p className="text-xs text-white/50 mb-0">
                      Page Count:{' '}
                      <span className="text-green-300 pl-1">
                        {' '}
                        not Specified
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap flex-col justify-evenly items-start w-full p-4 space-y-4">
                    <div className="flex flex-col gap-1 max-sm:gap-0">
                      <p className="text-gray-600">Price:</p>
                      <p className="text-2xl font-bold">
                        $<span className="px-2">{book.price}*</span>
                      </p>
                      <p className="text-[10px] text-gray-500 font-bold">
                        Additional delivery and taxes included later.
                      </p>
                    </div>
                    <div className="flex flex-wrap w-full space-y-4">
                      <div className="w-full flex flex-row max-sm:flex-col max-sm:space-x-0 max-sm:space-y-4 space-x-4 justify-between">
                        <button
                          title="add to collection"
                          type="submit"
                          onClick={() => {
                            handleAddToCollections(bookId as string);
                          }}
                          className="bg-tranparent border rounded-sm w-full font-bold py-2 px-4"
                        >
                          {bookInCollection[bookId as string] ? (
                            <span className="text-blue-400">
                              Already in Colection
                            </span>
                          ) : (
                            <span>Add to Colection</span>
                          )}
                        </button>
                        <button
                          title="read book"
                          type="button"
                          onClick={() => {
                            navigate(`/readbook/${bookId}`);
                          }}
                          className="bg-transparent border rounded-sm w-full font-bold py-2 px-4"
                        >
                          Read
                        </button>
                      </div>
                      <button
                        title="checkout"
                        type="button"
                        onClick={() => {
                          handleAddToCollections(bookId as string);
                          navigate(`/buybook/${bookId}`);
                        }}
                        className="bg-transparent border w-full rounded-sm font-bold py-2 px-4"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {deleteBookFromCollectionConfirmatonModal && (
            <div className="fixed inset-0 top-[40%] rounded-lg bg-white/70 border-green-300 text-red-600 border-2 shadow-sm shadow-green-300 h-40 p-4 flex justify-around items-center flex-col w-[80%] ml-[38px] lg:ml-96 lg:w-[50%] backdrop-blur-sm z-30">
              <div
                onClick={() => {
                  setDeleteBookFromCollectionConfirmatonModal(false);
                }}
              >
                <RxCross2 className="text-red-500 text-xl top-2 fixed right-4 hover:text-green-300 hover:border-2 hover:border-red-400 hover:rounded-full" />
              </div>
              {book ? (
                <div className="text-center text-md font-semibold">
                  The <span className="text-green-600">{book?.name}</span> is
                  already in collection do wish to remove it?
                </div>
              ) : (
                <div className="text-center text-md font-semibold">
                  This book is already in collection do wish to remove it?
                </div>
              )}
              <button
                title="delete-book-from-collection"
                type="button"
                className="h-6 bg-red-400 border-red-500 text-green-300 p-4 flex justify-center items-center text-center rounded-lg mt-4 border-2"
                onClick={() => {
                  handleBookDeletionFormCollections(bookId as string);
                  setDeleteBookFromCollectionConfirmatonModal(false);
                }}
              >
                Yeah!! Delete it
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookCardScreen;
