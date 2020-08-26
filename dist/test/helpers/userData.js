"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("faker");
exports.userEmail = 'tester@testers.com';
exports.userPassword = 'password';
exports.getOldUserToken = (requester) => {
    return requester
        .post('/login')
        .send({
        email: 'test@test.com',
        password: '123456789',
    })
        .then((res) => {
        return `Bearer ${res.body.token}`;
    });
};
exports.getNewUserToken = (requester) => {
    const email = faker_1.internet.email();
    const password = faker_1.internet.password();
    return requester
        .post('/sign-up')
        .send({
        email: email,
        password: password,
    })
        .then((res) => {
        return requester
            .post('/login')
            .send({
            email: email,
            password: password,
        })
            .then((res) => {
            return `Bearer ${res.body.token}`;
        });
    });
};
