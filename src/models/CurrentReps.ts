import { model, Schema, Document } from 'mongoose';

export interface ICurrentReps extends Document {
  user: string;
  reps: Array<object>;
}

export const CurrentRepsSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  reps: {
    type: Array,
    required: true,
  },
},
  { timestamps: true }
)
export const CurrentReps = model<ICurrentReps>("CurrentReps", CurrentRepsSchema)