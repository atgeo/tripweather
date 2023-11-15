"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
app.use(express_1.default.json());
// @ts-ignore
mongoose_1.default.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const tripRoutes = require('./app/routes/tripRoutes');
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/trip', tripRoutes);
const port = parseInt(process.env.PORT || '8080');
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => console.log('Server Started'));
module.exports = app;
