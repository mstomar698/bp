import mongoose, { Schema, Model } from 'mongoose';

interface IUserCollection extends mongoose.Document {
  email: string;
  books: string[]; 
}

const userCollectionSchema: Schema<IUserCollection> = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], 
  },
  {
    timestamps: true,
  }
);

const UserCollection: Model<IUserCollection> = mongoose.model('UserCollection', userCollectionSchema);
export default UserCollection;
