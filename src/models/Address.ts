import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipcode: string;
  plus4Zip: string;

}

const AddressSchema: Schema<IAddress> = new Schema({
  street: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  street2: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  zipcode: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  plus4Zip: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
},
  { timestamps: true }
)

export default AddressSchema