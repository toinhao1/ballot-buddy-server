import { Router, Request, Response } from 'express'
import passport from 'passport'

import { getFullZipCode } from '../controllers/smarty-streets'
import User from '../models/User'

const addressRouter = Router()

interface addressInput {
  street: string;
  secondary?: string;
  city: string;
  state: string;
  zipcode: string;
}

addressRouter.post('/address', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const { street, city, state, zipcode, secondary } = req.body
  const { _id } = req.user
  if (!req.user) {
    res.status(400).send("Please sign in!")
  }
  const address: addressInput = {
    street: street,
    secondary: secondary || '',
    city: city,
    state: state,
    zipcode: zipcode,
  }
  console.log(req.user)
  try {

    const currentAddress = await getFullZipCode(address)
    console.log(currentAddress)

    // const userToSave = await User.findOneAndUpdate(_id, { address: { street } })
    // userToSave.save()
    res.status(200).send("Address has been updated!")
  } catch (err) {
    console.log(err)
  }
})

export default addressRouter;