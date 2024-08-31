import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import UserController from './user/user.controller.js';
import AccountController from './account/account.controller.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/users', UserController.router);
app.use('/api/accounts', AccountController.router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
