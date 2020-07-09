import { model, Schema, Document, SchemaTypes } from 'mongoose';

export interface IPoliticians extends Document {
  candidateId: string;
  detailedBio: object;
  contactInfo: any;
}

export interface IContactInfo {
  webaddress: object;
}

export const PoliticiansSchema: Schema = new Schema({
  candidateId: {
    type: String,
    required: true,
    unique: true
  },
  detailedBio: {
    type: Object,
    required: true,
  },
  contactInfo: {
    type: Schema.Types.Mixed,
    required: true,
  }
},
  { timestamps: true }
)
export const Politicians = model<IPoliticians>("Politicians", PoliticiansSchema)