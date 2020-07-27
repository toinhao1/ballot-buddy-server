"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Politicians = exports.PoliticiansSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PoliticiansSchema = new mongoose_1.Schema({
    candidateId: {
        type: String,
        required: true,
        unique: true,
    },
    detailedBio: {
        type: Object,
        required: true,
    },
    contactInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, { timestamps: true });
exports.Politicians = mongoose_1.model('Politicians', exports.PoliticiansSchema);
