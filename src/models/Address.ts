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
  },
  secondary: {
    type: String,
    required: false,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipcode: {
    type: String,
    required: true,
    trim: true,
  },
  plusFourZip: {
    type: String,
    required: true,
    trim: true,
  },
  county: {
    type: String,
    required: true,
  },
  congressionalDistrict: {
    type: String,
    required: true
  }
},
  { timestamps: true }
)
export const Address = model<IAddress>("Address", AddressSchema)
