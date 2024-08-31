import Router from 'express';
import * as userManager from './user.manager.js';

class UserController {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/createUser', this.createUser);
        this.router.get('/getUser/:id', this.getUser);
        this.router.put('/updateUser/:id', this.updateUser);
    }
    createUser(req, res) {
        return userManager.createUser(req.body, res)
    }

    getUser(req, res) {
        const { id } = req.params;
        res.status(200).json({ id, name: 'John Doe', email: 'john@example.com' });
    }

    // Handle updating a user
    updateUser(req, res) {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ message: 'At least one field (name or email) is required to update' });
        }

        // Here you would normally update the user in the database
        res.status(200).json({ message: 'User updated successfully', user: { id, name, email } });
    }
}

// Export an instance of UserController
export default new UserController();
