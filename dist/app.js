"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const users_1 = __importDefault(require("./routes/users"));
const address_1 = __importDefault(require("./routes/address"));
const representatives_1 = __importDefault(require("./routes/representatives"));
const ballot_1 = __importDefault(require("./routes/ballot"));
const app = express_1.default();
//Body parser middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Initilize passport
app.use(passport_1.default.initialize());
//Passport Config
require('./config/passport')(passport_1.default);
//allows for cross site requests. The basis of an open API.
app.use(cors_1.default());
//Logs activity to the console.
app.use(morgan_1.default('combined'));
// routes for all user based functionality
app.use(address_1.default);
app.use(users_1.default);
app.use(representatives_1.default);
app.use(ballot_1.default);
exports.default = app;
