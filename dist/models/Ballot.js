"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ballot = exports.BallotSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BallotSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    ballot: {
        type: Object,
        required: true,
    },
}, { timestamps: true });
exports.Ballot = mongoose_1.model('Ballot', exports.BallotSchema);
