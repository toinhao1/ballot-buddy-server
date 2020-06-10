import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  street: string;
  secondary?: string;
  city: string;
  state: string;
  zipcode: string;
  plus4Zip: string;
  congressionalDistrict: string;
}

const AddressSchema: Schema<IAddress> = new Schema({
  street: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  secondary: {
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
  congressionalDistrict: {
    type: String,
    required: true
  }
},
  { timestamps: true }
)

export default AddressSchema