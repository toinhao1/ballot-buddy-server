import mongoose, { Schema, Document } from 'mongoose';
import { hash, genSalt, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import Address from './Address'

export interface IUser extends Document {
  email: string;
  name?: string;
  password: string;
  address?: mongoose.Schema;
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
  address: Address
},
  { timestamps: true }
)

// Hash plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this as IUser

  if (user.isModified('password')) {
    let getSalt = await genSalt(10)
    user.password = await hash(user.password, getSalt);
  }
  next();
});

// Generqting auth token for user login.
// UserSchema.methods.generateAuthToken = function () {
//   const user = this as IUser;
//   const token = sign({ id: user.id, email: user.email }, String(process.env.JWT_SECRET), { expiresIn: 36000 });
//   return token;
// };

const User = mongoose.model<IUser>('User', UserSchema);

export default User