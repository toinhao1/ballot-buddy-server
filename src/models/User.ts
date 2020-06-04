import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  password: string;
  token: string;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: true
  }
},
  { timestamps: true }
)
const User = mongoose.model<IUser>('User', UserSchema);

export default User