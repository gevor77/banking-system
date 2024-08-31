import Router from 'express';
import * as accountManager from './account.manager.js';

class AccountController {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/createAccount', this.createAccount);
        this.router.post('/transaction', this.transaction);
        this.router.post('/transferRate', this.createTransferRate);
        this.router.get('/getTransferByUserId/:id', this.getTransferByUserId);
        this.router.get('/getAccounts/:id', this.getAccountByUserId);
        this.router.get('/getAccount/:id', this.getAccount);
        this.router.put('/updateAccount/:id', this.updateAccount);
    }

    createAccount (req, res) {
        return accountManager.createAccount(req.body, res)
    }
    transaction (req, res) {
        return accountManager.transaction(req.body, res)
    }
    getAccountByUserId(req, res) {
        const { id } = req.params;
        // res.status(200).json({ id, name: 'John Doe', email: 'john@example.com' });
        return accountManager.getAccountsByUserId(id, res)
    }
    getAccount(req, res) {
        const { id } = req.params;
        // res.status(200).json({ id, name: 'John Doe', email: 'john@example.com' });
        return accountManager.getAccount(id, res)
    }
    getTransferByUserId(req, res) {
        const { id } = req.params;
        // res.status(200).json({ id, name: 'John Doe', email: 'john@example.com' });
        return accountManager.getTransferByUserId(id, res)
    }
    updateAccount(req, res) {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ message: 'At least one field (name or email) is required to update' });
        }
        res.status(200).json({ message: 'User updated successfully', user: { id, name, email } });
    }
    createTransferRate (req, res) {
        return accountManager.createTransferRate(req.body,res)
    }
}

export default new AccountController();
