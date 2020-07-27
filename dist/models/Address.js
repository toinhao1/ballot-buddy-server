"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = exports.AddressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AddressSchema = new mongoose_1.Schema({
    street: {
        type: String,
        required: true,
        trim: true,
    },
    secondary: {
        type: String,
        required: false,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    zipcode: {
        type: String,
        required: true,
        trim: true,
    },
    plusFourZip: {
        type: String,
        required: true,
        trim: true,
    },
    county: {
        type: String,
        required: true,
    },
    congressionalDistrict: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.Address = mongoose_1.model('Address', exports.AddressSchema);
