import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getCurrentRepresentatives, getRepOfficeData, getRepDetailedBio, getRepsForBallot, getCandidateOfficeData } from '../controllers/vote-smart'
import { getNewsForRepresentative } from '../controllers/news-api'
import { CurrentReps } from '../models/CurrentReps'
import { Ballot } from '../models/Ballot'
import { Politicians } from '../models/Politicians'


const representativeRouter = Router()

representativeRouter.get('/current-representatives', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    try {
      // check if user already has their reps in DB
      const arrayOfReps = await CurrentReps.findOne({ user: req.user.id })
      // return this as no need to make an api call
      if (arrayOfReps) {
        const { reps } = arrayOfReps
        res.status(200).send({ message: "Here are your reps!", data: reps })
      } else {
        const { zipcode, plusFourZip } = req.user.address
        // get the current reps from votesmart
        const data = await getCurrentRepresentatives(zipcode, plusFourZip)

        const repsToSave = new CurrentReps({ user: req.user.id, reps: data })
        await repsToSave.save()

        res.status(200).send({ message: "Here are your reps!", data })
      }
    } catch (err) {
      res.status(400).send({ message: err })
    }
  } else {
    res.send({ message: "You must sign in to request this." })
  }
})

representativeRouter.post('/current-representative/office-data', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const { isForBallot, data } = req.body

      const requestedRep = await Politicians.findOne({ candidateId: data.candidate_id })
      if (requestedRep) {
        const { contactInfo, detailedBio } = requestedRep
        const { candidate } = contactInfo.webaddress ? contactInfo.webaddress : contactInfo

        const newsArticles = await getNewsForRepresentative(candidate.nickName || candidate.firstName, candidate.lastName, data.office)

        res.status(200).send({ message: "Here is your reps contact info!", addressData: contactInfo, additionalData: detailedBio, newsArticles })

      } else {
        let addressData;
        if (!isForBallot) {
          // get specific rep office address, phone number, and website.
          addressData = await getRepOfficeData(data.candidate_id)
        } else {
          addressData = await getCandidateOfficeData(data.candidate_id)
        }
        const additionalData = await getRepDetailedBio(data.candidate_id)

        const { candidate } = addressData.webaddress ? addressData.webaddress : addressData
        const newsArticles = await getNewsForRepresentative(candidate.nickName || candidate.firstName, candidate.lastName, data.office)
        const politicianToSave = new Politicians({
          candidateId: data.candidate_id,
          contactInfo: addressData,
          detailedBio: additionalData
        })
        await politicianToSave.save()
        res.status(200).send({ message: "Here is your reps contact info!", addressData, additionalData, newsArticles })
      }
    } catch (err) {
      res.status(400).send({ message: "There was an error!", err })
    }
  } else {
    res.send({ message: "You must sign in to request this." })
  }
})

representativeRouter.get('/current-representatives/ballot', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const lastBallot = await Ballot.findOne({ user: req.user.id })
      if (lastBallot) {
        const { ballot } = lastBallot
        res.status(200).send({ message: "Here are your reps!", data: ballot })
      } else {
        // extract zipcode
        const { zipcode, plusFourZip } = req.user.address
        // get the current reps from votesmart
        const data = await getRepsForBallot(zipcode, plusFourZip)

        const saveBallot = new Ballot({ user: req.user.id, ballot: data })

        await saveBallot.save()
        res.status(200).send({ message: "Here are your reps!", data })
      }
    } catch (err) {
      console.log(err)
      res.status(400).send({ message: "There was an error!" })
    }

  } else {
    res.send({ message: "You must sign in to request this." })
  }
})

export default representativeRouter;