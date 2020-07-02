import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getCurrentRepresentatives, getRepOfficeData, getRepDetailedBio, getRepsForBallot } from '../controllers/vote-smart'
import { getNewsForRepresentative } from '../controllers/news-api'
import User from '../models/User'


const representativeRouter = Router()

representativeRouter.get('/current-representatives', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    // get the user
    const user = await User.findById(req.user.id)
    // extract zipcode
    const { zipcode, plusFourZip } = user?.address
    // get the current reps from votesmart
    const data = await getCurrentRepresentatives(zipcode, plusFourZip)

    res.status(200).send({ message: "Here are your reps!", data })

  } else {
    res.send("You must sign in to request this.")
  }
})

representativeRouter.post('/current-representative/office-data', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    // get specific rep office address, phone number, and website.
    const addressData = await getRepOfficeData(req.body.candidateId)
    const additionalData = await getRepDetailedBio(req.body.candidateId)
    const newsArticles = await getNewsForRepresentative((addressData.webaddress.candidate.nickName || addressData.webaddress.candidate.firstName), addressData.webaddress.candidate.lastName)

    res.status(200).send({ message: "Here is your reps contact info!", addressData, additionalData, newsArticles })

  } else {
    res.send("You must sign in to request this.")
  }
})

representativeRouter.get('/current-representatives/ballot', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  if (req.user) {
    // get the user
    const user = await User.findById(req.user.id)
    // extract zipcode
    const { zipcode, plusFourZip } = user?.address
    // get the current reps from votesmart
    const data = await getRepsForBallot(zipcode, plusFourZip)

    res.status(200).send({ message: "Here are your reps!", data })

  } else {
    res.send("You must sign in to request this.")
  }
})

export default representativeRouter;