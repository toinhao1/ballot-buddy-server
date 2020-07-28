import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';

import userRouter from './routes/users';
import addressRouter from './routes/address';
import representativeRouter from './routes/representatives';
import ballotRouter from './routes/ballot';

const app: express.Application = express();

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Initilize passport
app.use(passport.initialize());
//Passport Config
require('./config/passport')(passport);

//allows for cross site requests. The basis of an open API.
app.use(cors());
//Logs activity to the console.
app.use(logger('combined'));

// routes for all user based functionality
app.use(addressRouter);
app.use(userRouter);
app.use(representativeRouter);
app.use(ballotRouter);

export default app;
