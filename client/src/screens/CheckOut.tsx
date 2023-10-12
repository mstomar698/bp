import axios from 'axios';
import React, { useContext, useEffect, useReducer, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getError } from '../utils';
import { Store } from '../store';
import { FcReading, FcReadingEbook } from 'react-icons/fc';

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
type Options = {
  year?: 'numeric' | '2-digit';
  month?: 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
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
const CheckOut: React.FC = () => {
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

  const params = useParams<{ id: string }>();
  const { id: bookId } = params;
  const navigate = useNavigate()

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Format the date as a string (e.g., "Month Day, Year")
  const options: Options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = nextWeek.toLocaleDateString(undefined, options);
  const deliveryPrice = 5;
  const taxRate = 0.03;

  const handleAddToCollections = useCallback(async (bookId: string) => {
    const BookExistInCollection =
      userInfo?.email &&
      userInfo.email in collections &&
      collections[userInfo.email].includes(bookId);
    if (BookExistInCollection) {
      console.log('Book already in collections');
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
  }, [collections, dispatch, fetchCollectionsOnAdd, userInfo]);

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
        handleAddToCollections(data?._id as string)
      } catch (err: any) {
        dispatchBook({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [bookId, userInfo, handleAddToCollections]);

  useEffect(() => {
    if (userInfo) {
      fetchCollectionsOnAdd();

      const booksInCollection: { [bookId: string]: boolean } = {};
      collections[userInfo.email]?.forEach((bookId: string) => {
        booksInCollection[bookId] = true;
      });
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
      {error && (
        <p className="text-green-600 flex justify-center items-center min-h-screen text-3xl">
          {error}
        </p>
      )}
      {book && (
        <>
          <div
            className={`sm:px-16 px-6 min-h-screen flex items-center w-full`}
          >
            <div className="container mx-auto px-4 max-sm:px-0 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* img */}
                <div
                  className={`sm:px-16 px-4 sm:py-12 py-2 max-h-screen max-sm:h-full flex flex-col max-sm:flex-row gap-8 max-sm:gap-2 justify-start items-center `}
                >
                  <div className="h-[400px] max-sm:max-h-[300px] overflow-hidden justify-center items-center max-sm:items-start max-sm:justify-start flex p-4 max-sm:p-1 ">
                    <img
                      src={book.coverImage}
                      alt="Product"
                      className="rounded-lg max-sm:rounded-sm overflow-hidden p-0.5 border border-gray-300 min-h-full"
                    />
                  </div>
                  <div className="w-full p-4 pt-2 rounded">
                    <p className="text-white/50 mb-0 max-sm:text-xs">Title</p>
                    <h1 className="text-2xl max-sm:text-md font-bold mb-4">
                      {book.name}
                    </h1>
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <p className="text-md text-white/50 max-sm:text-sm">
                          Author:{' '}
                          <span className="text-green-300 pl-1">
                            {book.author} ({book.yearRelease})
                          </span>
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
                      </div>
                      <div className="w-full sm:w-1/2">
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
                    </div>
                  </div>
                </div>

                {/* conetnt */}
                <div
                  className={`sm:px-16 px-4 sm:py-12 py-2 max-h-screen max-sm:h-full overflow-hidden justify-start flex flex-wrap gap-8`}
                >
                  <div className="flex flex-grow flex-col justify-start items-start w-full  p-4 max-sm:p-0 space-y-4 max-h-full max-sm:h-full max-sm:overflow-x-hidden overflow-y-auto">
                    {/* Origin price */}
                    <div className="w-full">
                      <div className="flex flex-col gap-1 max-sm:gap-0 px-2">
                        <p className="text-gray-600">Original Price:</p>
                        <p className="text-2xl font-bold">
                          $<span className="px-2">{book.price}</span>
                        </p>
                      </div>
                    </div>
                    {/* btns */}
                    <div className="flex flex-wrap w-full space-y-4 max-sm:space-y-2">
                      <div className="w-full flex flex-row max-sm:flex-col max-sm:space-x-0 max-sm:space-y-2 space-x-4 justify-between">
                        <button
                          title="get ebook"
                          type="submit"
                          className="bg-tranparent border rounded-sm w-full font-bold py-1 px-4 flex flex-col justify-center items-center"
                        >
                          <span className="text-green-300">Get Ebook</span>
                          <span className="text-white/50 text-xs">
                            $ {book.price}
                          </span>
                        </button>
                        <button
                          title="get audio book"
                          type="submit"
                          className="bg-tranparent border rounded-sm w-full font-bold py-1 px-4 flex flex-col justify-center items-center"
                        >
                          <span className="text-green-300">Get Audio Book</span>
                          <span className="text-white/50 text-xs">
                            $ {book.price}
                          </span>
                        </button>
                      </div>
                      <div className="w-full flex flex-row max-sm:flex-col max-sm:space-x-0 max-sm:space-y-2 space-x-4 justify-between">
                        <button
                          title="buy paperback edition"
                          type="submit"
                          className="bg-tranparent border rounded-sm w-full font-bold py-1 px-4 flex flex-col justify-center items-center"
                        >
                          <span className="text-green-300">
                            Buy PaperBack Edition
                          </span>
                          <span className="text-white/50 text-xs">
                            $ {book.price}
                          </span>
                        </button>
                        <button
                          title="buy hardcover edition"
                          type="submit"
                          className="bg-tranparent border rounded-sm w-full font-bold py-1 px-4 flex flex-col justify-center items-center"
                        >
                          <span className="text-green-300">
                            Buy HardCover Edition
                          </span>
                          <span className="text-white/50 text-xs">
                            $ {book.price}
                          </span>
                        </button>
                      </div>
                    </div>
                    {/* Address section */}
                    <div className="w-full py-2">
                      <div className="flex flex-col gap-1 max-sm:gap-0 px-2">
                        <p className="text-gray-600 mb-1">Provide Address:</p>
                        <div className="flex flex-col gap-4">
                          <input
                            type="text"
                            className="border p-2 rounded"
                            placeholder="Street Address"
                            // You can add the necessary state and handlers here
                          />
                          <div className="flex flex-row space-x-4 w-full justify-between">
                            <input
                              type="text"
                              className="border p-2 w-full rounded"
                              placeholder="City"
                              // You can add the necessary state and handlers here
                            />
                            <input
                              type="text"
                              className="border p-2 w-full rounded"
                              placeholder="State"
                              // You can add the necessary state and handlers here
                            />
                          </div>
                          <div className="flex flex-row space-x-4 w-full justify-between">
                            <input
                              type="text"
                              className="border p-2 w-full rounded"
                              placeholder="Country"
                              required
                              // You can add the necessary state and handlers here
                            />
                            <input
                              type="text"
                              className="border w-[40%] max-sm:w-[50%] p-2 rounded"
                              placeholder="Pincode"
                              required
                              // You can add the necessary state and handlers here
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Delivered by  */}
                    <div className="w-full">
                      <div className="flex flex-row gap-1 max-sm:gap-0 text-center justify-start items-center px-2">
                        <p className="text-gray-600 max-sm:text-sm">Delivered By:</p>
                        <p className="text-xl font-bold text-center">
                          <span className="px-2 max-sm:px-3 text-blue-300 text-lg max-sm:text-sm">
                            {formattedDate}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Total Price + Delivery Price + Tax and all ammulations  */}
                    <div className="w-full bg-white/20 rounded-lg p-1">
                      <div className="flex flex-row justify-between gap-1 max-sm:gap-0 px-3">
                        <p className="text-white/60 text-lg justify-center h-max flex items-center pr-2">
                          T<br />O<br />T<br />A<br />L<br />
                        </p>
                        <div className="w-full p-2 py-3 px-4 space-y-1">
                          <p className="text-lg font-bold flex flex-wrap justify-start items-center text-center">
                            <p className="text-white/50 text-sm">
                              Original Price:
                            </p>
                            <span className="px-2 font-semibold text-green-300 text-xs">
                              $ {book.price}
                            </span>
                          </p>
                          <p className="text-lg font-bold flex flex-wrap justify-start items-center text-center">
                            <p className="text-white/50 text-xs">
                            Delivery:
                            </p>
                            <span className="px-2 font-semibold text-green-300 text-sm">
                            $ {deliveryPrice}
                            </span>
                          </p>
                          <p className="text-lg font-bold flex flex-wrap justify-start items-center text-center">
                            <p className="text-white/50 text-xs">
                            Tax:
                            </p>
                            <span className="px-2 font-semibold text-green-300 text-sm">
                            $ {(book?.price * taxRate).toFixed(2)}
                            </span>
                          </p>
                          
                          <p className="text-white/60 text-sm font-semibold">Overall:</p>
                          <p className="text-xl font-bold">
                            <span className="px-4 text-green-300">
                              ${' '}
                              {(
                                book?.price +
                                deliveryPrice +
                                book?.price * taxRate
                              ).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Finalize btn */}
                    <div className="w-full my-1">
                    <button
                        title="to payment"
                        type="button"
                        onClick={() => {
                          navigate(`/overview/${bookId}`);
                        }}
                        className="bg-transparent border w-full rounded-sm font-bold py-2 px-4"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="grid grid-rows-1 gap-2 max-sm:gap-1">
                <div className="p-1">
                  <div className="flex flex-row max-sm:flex-col justify-between w-full">
                    <h1 className="lg:text-2xl min-w-[70%] items-center flex justify-start max-sm:justify-center max-sm:text-lg font-bold pl-2">
                      {book.name}'s Reviews
                    </h1>
                    <div className="flex flex-row w-full justify-between px-4 text-green-100">
                      <div className="md:text-md max-sm:text-xs flex flex-row justify-center gap-2">
                        <FcReading className="mt-1 max-sm:mt-0.5" /> Total
                        Reads: {book.reads}
                      </div>
                      <div className="md:text-md max-sm:text-xs flex flex-row justify-center gap-2">
                        <FcReadingEbook className="mt-1 max-sm:mt-0.5" /> Total
                        Sold: {book.purchases}
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  className={`px-8 max-sm:px-4 py-4 max-sm:py-2 space-y-4 felx flex-col flex-grow w-full`}
                >
                  <li className="bg-white/20 p-2 flex flex-col rounded-lg">
                    <label>Your Reviews</label>
                    <input type="text" />
                  </li>
                  <li className="bg-white/20 p-2 flex flex-col rounded-lg">
                    <label>Your Reviews</label>
                    <input type="text" />
                  </li>
                  <li className="bg-white/20 p-2 flex flex-col rounded-lg">
                    <label>Your Reviews</label>
                    <input type="text" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOut;
