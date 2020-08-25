import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';

import { users, address, reps, ballots } from './routes';

const dbURL: string =
	process.env.NODE_ENV === 'test'
		? String(process.env.MONGODB_LOCAL_URL)
		: `${String(process.env.MONGODB_URL)}`;

// Connect to DB
mongoose
	.connect(dbURL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('MongoDB Connected');
	})
	.catch((err) => {
		console.log(err);
	});

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
app.use(address);
app.use(users);
app.use(reps);
app.use(ballots);

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server is listening on ${port}`));

export default app;
