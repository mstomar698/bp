import express, { Request, Response } from 'express';
import { isAdmin, isAuth } from '../utils';
import Book from '../models/bookModel';


const bookRouter = express.Router();

bookRouter.get('/', isAuth, async (req: Request, res: Response) => {
  const books = await Book.find({});
  res.send(books);
});

// 2. Purchase a book (Requires authentication but not admin)
bookRouter.post('/purchase/:id', isAuth, async (req: Request, res: Response) => {
  const bookId: string = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Implement your purchase logic here
    // For example, update the 'purchases' field in the book model

    // Save the updated book
    await book.save();

    res.json({ message: 'Book purchased successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Read a book (Requires authentication but not admin)
bookRouter.post('/read/:id', isAuth, async (req: Request, res: Response) => {
  const bookId: string = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Implement your read logic here
    // For example, update the 'reads' field in the book model

    // Save the updated book
    await book.save();

    res.json({ message: 'Book marked as read' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Edit book details (Requires authentication, admin, or the user who published the book)
// 4. Edit book details (Requires authentication, admin, or the user who published the book)
bookRouter.patch('/edit/:id', isAuth, async (req: Request, res: Response) => {
  const bookId: string = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Implement authorization logic here
    // Check if the user is an admin or the one who published the book

    // Example authorization check:
    if (req.user._id !== book.publishedBy) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update book details here based on the request body
    // You can update description, cover image, and other fields as needed

    // Example: book.description = req.body.description;

    // Save the updated book
    await book.save();

    res.json({ message: 'Book details updated successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

bookRouter.get('/:id', isAuth, async (req: Request, res: Response) => {
  const bookId = req.params.id;
  console.log(`Fetching book with ID: ${bookId}`);
  const book = await Book.findById(bookId);
  if (book) {
    console.log(`Found book: ${book}`);
    res.send(book);
  } else {
    console.log(`Book Not Found with ID: ${bookId}`);
    res.status(404).send({ message: 'Book Not Found' });
  }
});



// 5. Delete a book (Requires authentication, admin, or the user who published the book)
bookRouter.delete('/delete/:id', isAuth, async (req: Request, res: Response) => {
  const bookId: string = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (req.user.id !== book.publishedBy) {
      return res.status(403).json({ message: 'Unauthorized' });
    }


    await Book.deleteOne({ _id: req.params.id });

    res.json({ message: 'Book deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

bookRouter.post('/addbook', isAuth, async (req: Request, res: Response) => {
  try {
    // Create a new book based on the request body
    const newBook = new Book({
      name: req.body.name,
      author: req.body.author,
      genre: req.body.genre,
      yearRelease: req.body.yearRelease,
      price: req.body.price,
      publishedBy: req.user._id, // Set the publisher as the authenticated user
      description: req.body.description,
      coverImage: req.body.coverImage,
    });

    // Save the new book to the database
    await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default bookRouter;
