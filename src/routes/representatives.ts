import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getCurrentRepresentatives, getRepOfficeData, getRepDetailedBio, getRepsForBallot, getCandidateOfficeData } from '../controllers/vote-smart'
import { getNewsForRepresentative } from '../controllers/news-api'
import { CurrentReps } from '../models/CurrentReps'
import { Ballot } from '../models/Ballot'
import { User } from '../models/User'


const representativeRouter = Router()

representativeRouter.get('/current-representatives', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    try {
      // check if user already has their reps in DB
      const arrayOfReps = await CurrentReps.findOne({ user: req.user.id })
      // return this as no need to make an api call
      console.log(arrayOfReps)
      if (arrayOfReps) {
        console.log("In here")
        const { reps } = arrayOfReps
        res.status(200).send({ message: "Here are your reps!", data: reps })
      } else {
        const user = await User.findById(req.user.id)
        const { zipcode, plusFourZip } = user?.address
        // get the current reps from votesmart
        const data = await getCurrentRepresentatives(zipcode, plusFourZip)

        const repsToSave = new CurrentReps({ user: req.user.id, reps: data })
        await repsToSave.save()

        res.status(200).send({ message: "Here are your reps!", data })
      }
    } catch (err) {
      console.log(err)
      res.status(400).send({ message: err })
    }
  } else {
    res.send("You must sign in to request this.")
  }
})

representativeRouter.post('/current-representative/office-data', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    try {
      let addressData;
      const { isForBallot, data } = req.body

      if (!isForBallot) {
        // get specific rep office address, phone number, and website.
        addressData = await getRepOfficeData(data.candidate_id)
      } else {
        addressData = await getCandidateOfficeData(data.candidate_id)
      }
      const additionalData = await getRepDetailedBio(data.candidate_id)

      const { candidate } = addressData.webaddress ? addressData.webaddress : addressData
      const newsArticles = await getNewsForRepresentative(candidate.nickName || candidate.firstName, candidate.lastName, data.office)

      res.status(200).send({ message: "Here is your reps contact info!", addressData, additionalData, newsArticles })
    } catch (err) {
      res.status(400).send({ message: "There was an error!", err })
    }
  } else {
    res.send("You must sign in to request this.")
  }
})

representativeRouter.get('/current-representatives/ballot', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const ballot = await Ballot.findOne({ user: req.user.id })
      if (ballot) {
        res.status(200).send({ message: "Here are your reps!", data: ballot })
      } else {
        // get the user
        const user = await User.findById(req.user.id)
        // extract zipcode
        const { zipcode, plusFourZip } = user?.address
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
    res.send("You must sign in to request this.")
  }
})

export default representativeRouter;