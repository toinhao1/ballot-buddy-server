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
const passport_2 = require("./config/passport");
const app = express_1.default();
// Initilize passport
app.use(passport_1.default.initialize());
passport_2.PassportConfig();
//Body parser middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//allows for cross site requests. The basis of an open API.
app.use(cors_1.default());
//Logs activity to the console.
app.use(morgan_1.default('combined'));
// routes for all user based functionality
app.use('/user', users_1.default);
app.use('/', (req, res) => {
    res.json("This is the BallotBuddy server endpoint!");
});
exports.default = app;
