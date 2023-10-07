import React, { useState, useEffect } from 'react';
import { Store } from '../store';
import { useContext, useMemo } from 'react';
import Navbar from '../components/navbar';
import ReactPaginate from 'react-paginate';
import BookCard from '../components/bookCard';
import Footer from '../components/footer';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const { state } = useContext(Store);
  const { userInfo, books } = state;
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  // console.log(userInfo);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedReads, setSelectedReads] = useState('');
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

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
        onClick={() => setIsFilterVisible(false)}
      >
        {currentItems.map((book: any) => (
          <Link to={`/book/${book._id}`} key={book._id}>
            <BookCard book={book} />
          </Link>
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
    </div>
  );
};

export default HomeScreen;
