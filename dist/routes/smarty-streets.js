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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.getFullZipCode = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`https://us-street.api.smartystreets.com/street-address?
	auth-id=${String(process.env.SMARTY_STREETS_AUTH_ID)}&
	auth-token=${String(process.env.SMARTY_STREETS_AUTH_TOKEN)}&
  street=${address.street}&
  street2=${address.street2}&
  city=${address.city}&
  state=${address.state}&
  zipcode=${address.zipcode}&
  candidates=10`);
    return response;
});
