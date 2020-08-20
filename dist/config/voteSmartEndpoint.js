"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const voteSmartEndpoint = axios_1.default.create({
    baseURL: 'http://api.votesmart.org',
});
voteSmartEndpoint.interceptors.request.use((config) => {
    config.params = Object.assign({ 
        // add default params
        key: String(process.env.VOTE_SMART_API_KEY), o: 'JSON' }, config.params);
    return config;
});
exports.default = voteSmartEndpoint;
