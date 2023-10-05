import React from 'react';
import { FaShoppingCart, FaBookOpen, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Book {
  author: string;
  coverImage: string;
  description: string;
  genre: string;
  name: string;
  price: number;
  publishedBy: string;
  purchases: number;
  reads: number;
  yearRelease: number;
  _id: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md max-w-[300px] h-min">
      <img
        src={book.coverImage}
        alt={book.name}
        className="w-full h-48 object-cover mb-4 rounded-lg"
      />
      {/* Heart icons from react icons */}

      <h2 className="text-xl text-center font-semibold my-2 text-green-300">
        {book.name}
      </h2>
      <div className="flex flex-row flex-wrap items-center justify-between">
        <p className="text-green-200">
          By: {book.author}
          <span className="px-2 text-green-300">({book.yearRelease})</span>
        </p>
        <p className="text-green-200">Genre: {book.genre}</p>
      </div>
      <p className="my-2 text-left text-xs text-green-100">
        {book.description}
      </p>
      <div className="text-xl text-right flex flex-row justify-between px-2">
        <span className='flex flex-row flex-grow max-w-[20%] justify-between mt-0.5'>
          {book.reads}{' '}
          <Link to={'/'} className="mt-1.5">
            <FaHeart className="" />
          </Link>{' '}
        </span>
        $ {book.price}*
      </div>
      <div className="flex justify-between mt-4">
        <button
          title="buy"
          className="bg-green-300 hover:bg-green-500 hover:border-red-300 hover:border active:bg-green-500  text-black font-semibold py-2 px-4 rounded-l-lg rounde-r-none w-full flex flex-row items-center text-xl justify-around"
        >
          <FaShoppingCart className="pt-0.5" /> Buy
        </button>
        <button
          title="read"
          className="bg-blue-300 hover:bg-blue-500 active:bg-blue-500 hover:border-red-300 hover:border text-black font-semibold py-2 px-4 rounded-r-lg rounded-l-none w-full flex flex-row items-center text-xl justify-around"
        >
          <FaBookOpen className="pt-0.5" /> Read
        </button>
      </div>
    </div>
  );
};

export default BookCard;
