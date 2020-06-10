import { model, Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  street: string;
  secondary?: string;
  city: string;
  state: string;
  zipcode: string;
  plusFourZip: string;
  congressionalDistrict: string;
  county: string;
}

export const AddressSchema: Schema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  secondary: {
    type: String,
    required: false,
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
  plusFourZip: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  county: {
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
export const Address = model<IAddress>("Address", AddressSchema)
