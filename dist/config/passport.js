"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("passport");
const User_1 = __importDefault(require("../models/User"));
exports.PassportConfig = () => {
    let opts = {
        secretOrKey: String(process.env.PASSPORT_SECRET),
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
    };
    passport_1.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
        User_1.default.findOne({
            where: {
                id: jwt_payload.id
            },
        }).then(user => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }).catch(err => {
            return done(err, false);
        });
    }));
};
