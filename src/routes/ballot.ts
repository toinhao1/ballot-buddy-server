import { Router, Request, Response } from 'express';
import { authenticate } from 'passport';

import { Ballot } from '../models';
import {
	getRepsForBallot,
	getBallotMeasures,
	getSpecificBallotMeasure,
} from '../controllers/vote-smart';
import { statesToIgnore } from '../utils/statesToIgnore';

const ballotRouter = Router();

ballotRouter.get(
	'/current-ballot',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		if (req.user) {
			try {
				const lastBallot = await Ballot.findOne({ user: req.user.id });
				if (lastBallot) {
					const { ballot } = lastBallot;
					res.status(200).send({ message: 'Here is your current ballot!', ballot });
				} else {
					// extract zipcode
					const { zipcode, plusFourZip } = req.user.address;
					// get the current reps from votesmart
					const races = await getRepsForBallot(zipcode, plusFourZip);

					// get ballot measures for ballot if users state allows for it
					let ballotMeasures;
					if (!statesToIgnore.hasOwnProperty(req.user.address.state)) {
						// then we get the ballot measures
						ballotMeasures = await getBallotMeasures(req.user.address.state);
					}
					const ballotWithMeasure = { races, ballotMeasures };
					const ballotWithoutMeasures = { races };

					const ballot = statesToIgnore.hasOwnProperty(req.user.address.state)
						? ballotWithoutMeasures
						: ballotWithMeasure;
					const saveBallot = new Ballot({
						user: req.user.id,
						ballot: ballot,
					});

					await saveBallot.save();
					res.status(200).send({ message: 'Here is your current ballot!', ballot });
				}
			} catch (err) {
				console.log(err);
				res.status(400).send({ message: 'There was an error!' });
			}
		} else {
			res.send({ message: 'You must sign in to request this.' });
		}
	}
);

ballotRouter.post(
	'/selected-measure',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const specificMeasure = await getSpecificBallotMeasure(req.body.measureId);
			res.status(200).send({ message: 'Here is the measure data!', specificMeasure });
		} catch (err) {
			res.status(400).send({ message: 'There was an error!' });
		}
	}
);

export const ballots = ballotRouter;
