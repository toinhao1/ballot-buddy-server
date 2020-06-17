import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getCurrentRepresentatives } from '../controllers/vote-smart'


const representativeRouter = Router()

representativeRouter.get('/current-representatives', async (req: Request, res: Response) => {
  const { zipcode, zipcode4 } = req.body

  const data = await getCurrentRepresentatives(zipcode, zipcode4)

  res.send({ message: "Here are your reps!", data })
})


export default representativeRouter;