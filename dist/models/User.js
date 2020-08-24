"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = require("bcrypt");
const Address_1 = require("./Address");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    address: Address_1.AddressSchema,
}, { timestamps: true });
// Hash plain text password before saving
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            let getSalt = yield bcrypt_1.genSalt(10);
            user.password = yield bcrypt_1.hash(user.password, getSalt);
        }
        next();
    });
});
// Generating auth token for user login.
// UserSchema.methods.generateAuthToken = function () {
//   const user = this as IUser;
//   const token = sign({ id: user.id, email: user.email }, String(process.env.JWT_SECRET), { expiresIn: 36000 });
//   return token;
// };
exports.User = mongoose_1.default.model('User', UserSchema);
