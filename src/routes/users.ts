import { Router, Request, Response } from 'express';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { authenticate } from 'passport';

import { User, IUser } from '../models';

const userRouter = Router();

// route to SignUp a new user
userRouter.post(
	'/sign-up',
	async (req: Request, res: Response): Promise<any> => {
		const { email, password } = req.body;
		try {
			const userAlreadyExists = await User.findOne({ email: email });

			if (userAlreadyExists) {
				return res.status(400).send({ message: 'Email is already in use, please sign in.' });
			}
			const newUser = new User({
				email: email,
				name: req.body.name,
				password: password,
			});
			const user = await newUser.save();

			res.status(201).json(user);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

// route to sign in
userRouter.post(
	'/login',
	async (req: Request, res: Response): Promise<any> => {
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email: email });
			if (!user) {
				return res.status(400).send({ error: 'Email not found.' });
			}
			const isMatch = await compare(password, user.password);
			if (isMatch) {
				let token = sign({ id: user.id, email: user.email }, String(process.env.PASSPORT_SECRET), {
					expiresIn: '7d',
				});
				res.json({
					success: true,
					token: token,
					userId: user._id,
					address: user.address,
				});
			} else {
				res.status(400).send({ error: 'Incorrect password' });
			}
		} catch (err) {
			res.status(500).send({ message: err });
		}
	}
);

// update the user email
userRouter.put(
	'/update',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		if (req.user) {
			const updates = {
				email: req.body.email,
			};
			try {
				let updatedUser: IUser | null = await User.findOneAndUpdate(
					{ _id: req.user._id },
					{ $set: updates },
					{ new: true }
				);
				await updatedUser?.save();
				res.json(updatedUser);
			} catch (err) {
				res.send(err);
			}
		} else {
			res.status(400).send({ message: 'Please sign in to update your email' });
		}
	}
);

userRouter.get(
	'/user-profile',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		if (req.user) {
			try {
				const user = await User.findOne({ _id: req.user._id });
				res.status(200).send({ message: 'Here is your profile', user });
			} catch (err) {
				res.status(400).send(err);
			}
		} else {
			res.send('Please login!');
		}
	}
);

userRouter.put(
	'/edit-user',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		if (req.user) {
			const updates = {
				email: req.body.email,
			};
			try {
				const user: IUser | null = await User.findOneAndUpdate(
					{ _id: req.user._id },
					{ $set: updates },
					{ new: true }
				);
				res.status(200).send({ message: 'Your profile has been updated.', user });
			} catch (err) {
				res.status(400).send(err);
			}
		} else {
			res.send('Please login!');
		}
	}
);

export const users = userRouter;
