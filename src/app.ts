import express from 'express';
import bodyParser from 'body-parser'
import logger from 'morgan'
import cors from 'cors'
import passport from 'passport'

import userRouter from './routes/users'

import { PassportConfig } from './config/passport'

const app = express();

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

export default app;