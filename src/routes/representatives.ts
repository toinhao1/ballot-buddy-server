import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getCurrentRepresentatives, getRepOfficeData, getRepDetailedBio } from '../controllers/vote-smart'
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
    const data = await getRepOfficeData(req.body.candidateId)
    const additionalData = await getRepDetailedBio(req.body.candidateId)
    const newsArticles = await getNewsForRepresentative((data.webaddress.candidate.nickName || data.webaddress.candidate.firstName), data.webaddress.candidate.lastName)

    res.status(200).send({ message: "Here is your reps contact info!", data, additionalData, newsArticles })

  } else {
    res.send("You must sign in to request this.")
  }
})

export default representativeRouter;