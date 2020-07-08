"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.PoliticiansSchema = new mongoose_1.Schema({
    candidateId: {
        type: String,
        required: true,
        unique: true
    },
    reps: {
        type: mongoose_1.Schema.Types.Array,
        required: true,
    },
}, { timestamps: true });
exports.Politicians = mongoose_1.model("CurrentReps", exports.PoliticiansSchema);
