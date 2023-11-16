"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../app/models/userModel"));
const chai_1 = require("chai");
const index_1 = require("../index");
describe('User Model Test Suite', () => {
    before(async () => (0, index_1.dbConnect)());
    after(async () => (0, index_1.dbDisconnect)());
    it('should validate saving a new student user successfully', async () => {
        const validUser = new userModel_1.default({
            email: 'test@email.com',
            firstName: 'First',
            lastName: 'Last',
            dateOfBirth: '2000-01-01',
            password: '123456',
        });
        const savedUser = await validUser.save();
        (0, chai_1.expect)(savedUser).to.not.be.null;
    });
    it('should validate MongoError duplicate error with code 11000', async () => {
        const validUser = new userModel_1.default({
            email: 'test@email.com',
            firstName: 'First',
            lastName: 'Last',
            dateOfBirth: '2000-01-01',
            password: '123456',
        });
        try {
            await validUser.save();
        }
        catch (error) {
            const { name, code } = error;
            (0, chai_1.expect)(name).to.equal('MongoServerError');
            (0, chai_1.expect)(code).to.equal(11000);
        }
    });
});
