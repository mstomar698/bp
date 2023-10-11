import React, { useState, useEffect } from 'react';
import { Store } from '../store';
import { useContext, useMemo } from 'react';
import ReactPaginate from 'react-paginate';
import BookCard from '../components/bookCard';
import { FaFilter, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomeScreen = () => {
  const { state, dispatch, fetchCollectionsOnAdd } = useContext(Store);
  const { userInfo, books, collections } = state;
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedReads, setSelectedReads] = useState('');
  const [
    deleteBookFromCollectionConfirmatonModal,
    setDeleteBookFromCollectionConfirmatonModal,
  ] = useState(false);
  const [bookTODeleteFromCollection, setBookTODeleteFromCollection] =
    useState<any>(null);
  const [bookInCollection, setBookInCollection] = useState<{
    [bookId: string]: boolean;
  }>({});

  const toggleFilterDropdown = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  const indexOfLastItem = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage]
  );
  const indexOfFirstItem = useMemo(
    () => indexOfLastItem - itemsPerPage,
    [indexOfLastItem, itemsPerPage]
  );
  const currentItems = useMemo(() => {
    const filteredBooks = books
      .filter((book: any) =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((book: any) =>
        selectedGenre ? book.genre === selectedGenre : true
      )
      .filter((book: any) =>
        selectedPrice ? book.price <= parseFloat(selectedPrice) : true
      )
      .filter((book: any) =>
        selectedReads ? book.reads >= parseInt(selectedReads) : true
      );

    return filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  }, [
    indexOfFirstItem,
    indexOfLastItem,
    books,
    searchTerm,
    selectedGenre,
    selectedPrice,
    selectedReads,
  ]);

  const handlePageClick = (data: any) => {
    let selected = data.selected;
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const getBokById = async (bookId: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/books/${bookId}`,
        {
          headers: { Authorization: `${userInfo!.token}` },
        }
      );
      if (response.status === 200) {
        setBookTODeleteFromCollection(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching book:', error);
    }
  };
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
      getBokById(bookId);
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
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  useEffect(() => {
    if (userInfo) {
      fetchCollectionsOnAdd();

      const booksInCollection: { [bookId: string]: boolean } = {};
      collections[userInfo.email]?.forEach((bookId: string) => {
        booksInCollection[bookId] = true;
      });
      setBookInCollection(booksInCollection);
    }
    setItemsPerPage(itemsPerPage);
  }, [userInfo, collections, fetchCollectionsOnAdd, itemsPerPage]);
  return (
    <div className="text-green-300 min-h-screen flex flex-grow flex-col justify-start items-start">
      <div className="w-full my-2 mb-4 items-center justify-center flex flex-grow">
        <div className="relative min-w-[70%]">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={() => setIsFilterVisible(false)}
            className="w-full pl-12 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-green-500 text-green-900"
          />
          <div className="absolute top-0 left-0 pl-3 pt-2">
            <FaSearch className="mt-1 text-xl" />
          </div>
          <div className="absolute top-0 right-0 pr-3 pt-2">
            <FaFilter
              className={`mt-1 text-xl cursor-pointer ${
                isFilterVisible ? 'text-green-500' : ''
              }`}
              onClick={toggleFilterDropdown}
            />
          </div>
        </div>
      </div>
      <div
        className="min-h-screen w-full flex flex-wrap justify-around max-sm:flex-col max-sm:items-center max-sm:space-y-4"
        onClick={() => {
          setIsFilterVisible(false);
          setDeleteBookFromCollectionConfirmatonModal(false);
        }}
      >
        {currentItems.map((book: any) => (
          <div key={book._id}>
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCollections(book._id);
                }}
                className="absolute top-9 right-9 z-10 cursor-pointer border border-blue-700 shadow-blue-300 hover:shadow-md hover:shadow-blue-500 shadow-sm  bg-white/40 rounded-full p-1"
              >
                {bookInCollection[book._id] ? (
                  <FaHeart className="text-green-400 text-2xl mt-0.5 z-20" />
                ) : (
                  <FaRegHeart className="text-blue-400 text-2xl mt-0.5 z-20" />
                )}
              </div>
            </div>
            <Link to={`/book/${book._id}`}>
              <BookCard book={book} />
            </Link>
          </div>
        ))}
      </div>

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(books.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-around w-full py-4 items-center'}
        activeClassName={'active'}
        activeLinkClassName={'bg-green-300 text-white px-4 py-2 rounded'}
        nextLinkClassName={'bg-green-300 text-white px-4 py-2 rounded'}
        previousLinkClassName={'bg-green-300 text-white px-4 py-2 rounded'}
        disabledClassName={
          'bg-green-300 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed'
        }
      />
      {isFilterVisible && (
        <div className="absolute top-[70px] max-sm:top-[76px] right-[240px] max-sm:right-[60px] mt-12 bg-white border border-green-300 rounded-lg shadow-md p-4 ">
          <label className="block text-green-700 mb-2">Genre:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter Genre"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          />
          <label className="block text-green-700 mb-2">Reads:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter Reads"
            value={selectedReads}
            onChange={(e) => setSelectedReads(e.target.value)}
          />
          <label className="block text-green-700 mb-2">Max-Price:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter Price"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          />
        </div>
      )}
      {deleteBookFromCollectionConfirmatonModal && (
        <div className="fixed inset-0 top-1/2 rounded-lg bg-white/70 border-green-300 text-red-600 border-2 shadow-sm shadow-green-300 h-40 p-4 flex justify-around items-center flex-col w-[80%] ml-[38px] lg:ml-96 lg:w-[50%] backdrop-blur-sm z-30">
          <div
            onClick={() => {
              setDeleteBookFromCollectionConfirmatonModal(false);
            }}
          >
            <RxCross2 className="text-red-500 text-xl top-2 fixed right-4 hover:text-green-300 hover:border-2 hover:border-red-400 hover:rounded-full" />
          </div>
          {bookTODeleteFromCollection ? (
            <div className="text-center text-md font-semibold">
              The{' '}
              <span className="text-green-600">
                {bookTODeleteFromCollection?.name}
              </span>{' '}
              is already in collection do wish to remove it?
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
              handleBookDeletionFormCollections(bookTODeleteFromCollection?._id);
              setDeleteBookFromCollectionConfirmatonModal(false);
            }}
          >
            Yeah!! Delete it
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
