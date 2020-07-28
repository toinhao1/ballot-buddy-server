import { Router, Request, Response } from 'express';
import { authenticate } from 'passport';

import { Ballot } from '../models/Ballot';
import { getRepsForBallot, getBallotMeasures } from '../controllers/vote-smart';
import { statesToIgnore } from '../utils/statesToIgnore';

const ballotRouter = Router();

ballotRouter.get(
	'/current-ballot',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response) => {
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
					console.log(ballotMeasures);
					const saveBallot = new Ballot({
						user: req.user.id,
						ballot: { races, ballotMeasures },
					});

					await saveBallot.save();
					res.status(200).send({ message: 'Here is your current ballot!', races, ballotMeasures });
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

export default ballotRouter;
