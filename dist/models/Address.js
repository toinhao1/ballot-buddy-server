"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    street: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    street2: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    state: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    zipcode: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    plus4Zip: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
}, { timestamps: true });
exports.default = AddressSchema;
