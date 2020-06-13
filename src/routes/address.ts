import { Router, Request, Response } from 'express'
import { authenticate } from 'passport'

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

addressRouter.post('/set-address', authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
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
    // make request to get full address
    const smartyStreetsData = await getFullZipCode(address)
    // combine user provided data with data from smartysteets
    const combinedAddress = { ...address, ...smartyStreetsData }
    // create the new address
    const currentAddress = new Address(
      combinedAddress
    )

    const userToSave = await User.findOne({ _id })
    if (!userToSave) {
      throw new Error("User not found")
    }
    // set address to user and save.
    userToSave.address = currentAddress
    const user = await userToSave.save()
    res.status(200).send({ message: "Address has been updated!", user })
  } catch (err) {
    res.status(400).send('There was an error please try again later.')
  }
})

export default addressRouter;