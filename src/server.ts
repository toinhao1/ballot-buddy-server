import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

import app from './app';

const dbURL: string = `${String(process.env.MONGODB_URL)}`;

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

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server is listening on ${port}`));
