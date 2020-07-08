"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const User_1 = require("../models/User");
let opts = {
    secretOrKey: String(process.env.PASSPORT_SECRET),
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
};
module.exports = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
        User_1.User.findById(jwt_payload.id).then(currentUser => {
            if (currentUser) {
                return done(null, currentUser);
            }
            else {
                return done(null, false);
            }
        }).catch(err => {
            return done(err, false);
        });
    }));
};
