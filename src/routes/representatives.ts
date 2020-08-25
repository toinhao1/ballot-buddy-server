import { Router, Request, Response } from 'express';
import { authenticate } from 'passport';

import {
	getCurrentRepresentatives,
	getRepOfficeData,
	getRepDetailedBio,
	getCandidateOfficeData,
} from '../controllers/vote-smart';
import { getNewsForRepresentative } from '../controllers/news-api';

import { CurrentReps, Politicians } from '../models';

const representativeRouter = Router();

representativeRouter.get(
	'/current-representatives',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		if (req.user) {
			try {
				// check if user already has their reps in DB
				const arrayOfReps = await CurrentReps.findOne({ user: req.user.id });
				// return this as no need to make an api call
				if (arrayOfReps) {
					const { reps } = arrayOfReps;
					res.status(200).send({ message: 'Here are your reps!', data: reps });
				} else {
					const { zipcode, plusFourZip } = req.user.address;
					// get the current reps from votesmart
					const data = await getCurrentRepresentatives(zipcode, plusFourZip);

					const repsToSave = new CurrentReps({ user: req.user.id, reps: data });
					await repsToSave.save();

					res.status(200).send({ message: 'Here are your reps!', data });
				}
			} catch (err) {
				res.status(400).send({ message: err });
			}
		} else {
			res.send({ message: 'You must sign in to request this.' });
		}
	}
);

representativeRouter.post(
	'/current-representative/office-data',
	authenticate('jwt', { session: false }),
	async (req: Request, res: Response): Promise<void> => {
		if (req.user) {
			try {
				const { isForBallot, data } = req.body;

				if (isForBallot) {
					// add a one for candidate type data
					const isForBallotId = data.candidate_id + '1';
					console.log(isForBallotId);

					// check if rep is already in the db
					const requestedRep = await Politicians.findOne({
						candidateId: isForBallotId,
					});

					if (requestedRep) {
						const { contactInfo, detailedBio } = requestedRep;
						const { candidate } = contactInfo.webaddress ? contactInfo.webaddress : contactInfo;

						const dataForGnews = {
							firstName: candidate.nickName || candidate.firstName,
							lastName: candidate.lastName,
							office: data.office,
						};

						const newsArticles = await getNewsForRepresentative(dataForGnews);

						res.status(200).send({
							message: 'Here is your reps contact info!',
							addressData: contactInfo,
							additionalData: detailedBio,
							newsArticles,
						});
					} else {
						const addressData = await getCandidateOfficeData(data.candidate_id);

						const additionalData = await getRepDetailedBio(data.candidate_id);

						const { candidate } = addressData.webaddress ? addressData.webaddress : addressData;

						const dataForGnews = {
							firstName: candidate.nickName || candidate.firstName,
							lastName: candidate.lastName,
							office: data.office,
						};
						const newsArticles = await getNewsForRepresentative(dataForGnews);
						const politicianToSave = new Politicians({
							candidateId: isForBallotId,
							contactInfo: addressData,
							detailedBio: additionalData,
						});
						await politicianToSave.save();
						res.status(201).send({
							message: 'Here is your reps contact info!',
							addressData,
							additionalData,
							newsArticles,
						});
					}
				} else {
					const requestedRep = await Politicians.findOne({
						candidateId: data.candidate_id,
					});
					if (requestedRep) {
						const { contactInfo, detailedBio } = requestedRep;
						const { candidate } = contactInfo.webaddress ? contactInfo.webaddress : contactInfo;

						const dataForGnews = {
							firstName: candidate.nickName || candidate.firstName,
							lastName: candidate.lastName,
							office: data.office,
						};

						const newsArticles = await getNewsForRepresentative(dataForGnews);

						res.status(200).send({
							message: 'Here is your reps contact info!',
							addressData: contactInfo,
							additionalData: detailedBio,
							newsArticles,
						});
					} else {
						const addressData = await getRepOfficeData(data.candidate_id);

						const additionalData = await getRepDetailedBio(data.candidate_id);

						const { candidate } = addressData.webaddress ? addressData.webaddress : addressData;

						const dataForGnews = {
							firstName: candidate.nickName || candidate.firstName,
							lastName: candidate.lastName,
							office: data.office,
						};
						const newsArticles = await getNewsForRepresentative(dataForGnews);
						const politicianToSave = new Politicians({
							candidateId: data.candidate_id,
							contactInfo: addressData,
							detailedBio: additionalData,
						});
						await politicianToSave.save();
						res.status(201).send({
							message: 'Here is your reps contact info!',
							addressData,
							additionalData,
							newsArticles,
						});
					}
				}
			} catch (err) {
				res.status(400).send({ message: 'There was an error!', err });
			}
		} else {
			res.send({ message: 'You must sign in to request this.' });
		}
	}
);

export const reps = representativeRouter;
