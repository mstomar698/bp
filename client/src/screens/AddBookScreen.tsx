import React, { useContext, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { Store } from '../store';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddBookScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [formData, setFormData] = useState({
    name: 'Other Book Title',
    author: 'Mary Doe',
    genre: 'History',
    yearRelease: '2012',
    price: '10.99',
    description: 'This is a other sample book description.',
    coverImage: 'https://placehold.co/600x400/png', // Replace with a real cover image URL
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare the JSON data to send
      const requestData = {
        name: formData.name,
        author: formData.author,
        genre: formData.genre,
        yearRelease: formData.yearRelease,
        price: formData.price,
        description: formData.description,
        coverImage: formData.coverImage,
      };

      const response = await axios.post(
        'http://localhost:5000/api/books/addbook',
        requestData,
        {
          headers: { Authorization: `${userInfo!.token}` },
        }
      );

      if (response.status === 201) {
        const responseData = response.data;
        console.log(responseData); // Handle the response data as needed
        // Reset the form or redirect to another page upon success
      } else {
        console.error('Failed to add book:', response.data.message);
        // Handle the error appropriately
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white/10 p-8 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3">
        <Link to={'/'} className="text-center text-3xl underline text-white/50">
          BookPedia
        </Link>
        <h2 className="text-2xl text-green-500 mb-4">
          <FaBook className="inline-block mr-2" />
          Add a Book
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-green-500 mb-1">
              Book Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="author" className="block text-green-500 mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="genre" className="block text-green-500 mb-1">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="yearRelease" className="block text-green-500 mb-1">
              Year of Release
            </label>
            <input
              type="number"
              id="yearRelease"
              name="yearRelease"
              value={formData.yearRelease}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-green-500 mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-green-500 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={() => handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-green-500 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              required
            />
          </div>
          <div className="mb-4 items-center justify-center flex flex-col">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookScreen;
