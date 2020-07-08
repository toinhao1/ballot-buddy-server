import { model, Schema, Document } from 'mongoose';

export interface IPoliticians extends Document {
  candidateId: string;
  reps: Array<object>
}

export const PoliticiansSchema: Schema = new Schema({
  candidateId: {
    type: String,
    required: true,
    unique: true

  },
  reps: {
    type: Schema.Types.Array,
    required: true,
  },
},
  { timestamps: true }
)
export const Politicians = model<IPoliticians>("CurrentReps", PoliticiansSchema)