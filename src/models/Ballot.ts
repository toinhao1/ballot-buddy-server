import { model, Schema, Document } from 'mongoose';

export interface IBallot extends Document {
  user: string;
  ballot: object
}

export const BallotSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  ballot: {
    type: Object,
    required: true,
  },
},
  { timestamps: true }
)
export const Ballot = model<IBallot>("Ballot", BallotSchema)