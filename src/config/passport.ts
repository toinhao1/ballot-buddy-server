import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { PassportStatic } from 'passport';
import User from '../models/User'


let opts: StrategyOptions = {
  secretOrKey: String(process.env.PASSPORT_SECRET),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
module.exports = (passport: PassportStatic) => {
  passport.use(new Strategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id).then(user => {
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
