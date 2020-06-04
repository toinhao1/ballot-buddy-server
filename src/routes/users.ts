import { Router, Request, Response } from 'express'
import { hash, genSalt, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { authenticate } from 'passport'

import User from '../models/User'

const userRouter = Router()

// route to SignUp a new user
userRouter.post('/sign-up', async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userAlreadyExists = await User.findOne({ email: email })

    if (userAlreadyExists) {
      return res.status(400).send("Email is already in use, please sign in.")
    }
    const newUser = new User({
      email: email,
      name: req.body.name,
      password: password,
    })

    // bcrypt hashing the password
    const getSalt = await genSalt(10)
    const hashedPassword = await hash(password, getSalt)

    newUser.password = hashedPassword

    const user = await newUser.save()

    res.status(201).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

// route to sign in
userRouter.post('/login', async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.send({ status: 400, error: "Email not found." })
    }
    const isMatch = await compare(password, user.password)
    if (isMatch) {
      let token = sign(
        { id: user.id, email: user.email },
        String(process.env.PASSPORT_SECRET),
        { expiresIn: 36000 }
      );
      res.json({ success: true, token: 'Bearer ' + token, userId: user.id })

    } else {
      return res.send({ status: 400, error: "Incorrect password" })
    }

  } catch (err) {
    res.status(500).json(err)
  }
})

export default userRouter