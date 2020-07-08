"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.CurrentRepsSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    reps: {
        type: mongoose_1.Schema.Types.Array,
        required: true,
    },
}, { timestamps: true });
exports.CurrentReps = mongoose_1.model("CurrentReps", exports.CurrentRepsSchema);
