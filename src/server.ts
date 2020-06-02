import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import logger from 'morgan'
import cors from 'cors'
import passport from 'passport'

import userRouter from './routes/users'

import { PassportConfig } from './config/passport'

const app = express();
const dbURL = `${String(process.env.MONGODB_URL)}`

// Connect to DB
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log(err);
  });

// Initilize passport
app.use(passport.initialize())
PassportConfig()

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//allows for cross site requests. The basis of an open API.
app.use(cors());
//Logs activity to the console.
app.use(logger('combined'));

// routes for all user based functionality
app.use('/user', userRouter)

app.use('/', (req, res) => {
  res.json("This is the BallotBuddy server endpoint!")
})

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`server is listening on ${port}`));