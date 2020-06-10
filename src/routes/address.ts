import { Router, Request, Response } from 'express'
import passport from 'passport'

import { getFullZipCode } from '../controllers/smarty-streets'

import { Address } from '../models/Address'
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

  const address: addressInput = {
    street: street,
    secondary: secondary || '',
    city: city,
    state: state,
    zipcode: zipcode,
  }
  try {

    const smartyStreetsData = await getFullZipCode(address)
    const combinedAddress = { ...address, ...smartyStreetsData }
    console.log(combinedAddress)
    const currentAddress = new Address(
      combinedAddress
    )

    const userToSave = await User.findOne({ _id })
    if (!userToSave) {
      throw new Error("User not found")
    }
    userToSave.address = currentAddress
    console.log(userToSave)
    await userToSave.save()
    res.status(200).send("Address has been updated!")
  } catch (err) {
    console.log(err)
  }
})

export default addressRouter;