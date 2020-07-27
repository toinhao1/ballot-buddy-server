"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const dbURL = `${String(process.env.MONGODB_URL)}`;
// Connect to DB
mongoose_1.default
    .connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('MongoDB Connected');
})
    .catch((err) => {
    console.log(err);
});
const port = Number(process.env.PORT) || 5000;
app_1.default.listen(port, () => console.log(`Server is listening on ${port}`));
