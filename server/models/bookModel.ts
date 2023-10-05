import mongoose, { Schema, Model } from 'mongoose';

interface IBook extends mongoose.Document {
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
}

const bookSchema: Schema<IBook> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    yearRelease: { type: Number, required: true },
    price: { type: Number, required: true },
    reads: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    publishedBy: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true }, 
  },
  {
    timestamps: true,
  }
);

const Book: Model<IBook> = mongoose.model('Book', bookSchema);
export default Book;
