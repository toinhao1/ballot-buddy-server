import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { use } from 'passport';
import User from '../models/User'

export const PassportConfig = () => {
  let opts: StrategyOptions = {
    secretOrKey: String(process.env.PASSPORT_SECRET),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }
  use(new Strategy(opts, (jwt_payload, done) => {
    User.findOne({
      where: {
        id: jwt_payload.id
      },
    }).then(user => {
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    }).catch(err => {
      return done(err, false)
    });
  }))
}
