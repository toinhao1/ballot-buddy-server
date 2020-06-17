import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getCurrentRepresentatives } from '../controllers/vote-smart'
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
    res.send("Fuck off")
  }
})


export default representativeRouter;