import express, { Request, Response } from 'express';
import UserCollection from '../models/collectionSchema';
import { isAuth } from '../utils';
import { Collection } from 'mongoose';

const collectionsRouter = express.Router();


collectionsRouter.post('/add_to_collection',isAuth,  async (req: Request, res: Response) => {
  try {
    const { email, bookId } = req.body;
    if (!bookId) {
        return res.status(400).json({ error: 'Book id not provided' });
    }
    let userCollection = await UserCollection.findOne({ email });
    
    if (!userCollection) {
      userCollection = new UserCollection({ email, books: [] });
    }
    
    userCollection.books.push(bookId);
    
    await userCollection.save();

    res.status(200).json({ message: 'Book added to collection successfully' });
  } catch (error) {
    console.error('Error adding book to collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


collectionsRouter.post('/get_collections', isAuth, async (req, res) => {
    try {
      const { email } = req.body; 
      const collections = await UserCollection.findOne({ email }).populate('books');
      if (!collections) {
        return res.status(404).json({ message: 'No collections found for the user' });
      }
  
      res.status(200).json(collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  collectionsRouter.post('/delete/book_from_collection', isAuth, async (req: Request, res: Response) => {
    try {
      const { email, bookId } = req.body;
      if (!bookId) {
        return res.status(400).json({ error: 'Book id not provided' });
      }
  
      let userCollection = await UserCollection.findOne({ email });
  
      if (!userCollection) {
        return res.status(404).json({ message: 'User collection not found' });
      }
  
      userCollection.books = userCollection.books.filter((book) => book.toString() !== bookId);
      
      await userCollection.save();
  
      res.status(200).json({ message: 'Book removed from collection successfully' });
    } catch (error) {
      console.error('Error removing book from collection:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default collectionsRouter;
