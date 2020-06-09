import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

import { getFullZipCode } from '../controllers/smarty-streets'
import User from '../models/User'

const addressRouter = Router()

addressRouter.post('/address', async (req: Request, res: Response) => {
  console.log(req.body)
  const address = {
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode,
  }
  try {
    const currentAddress = await getFullZipCode(address)
    console.log(currentAddress)
    res.status(200).send("Address has been updated!")
  } catch (err) {
    console.log(err)
  }
})


export default addressRouter;