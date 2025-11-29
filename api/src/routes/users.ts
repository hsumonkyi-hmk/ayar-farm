import { Router } from 'express';
import { UsersController } from '../controllers/users';
import { authenticate } from '../middlewares';

const users = Router();
const usersController = new UsersController();

users.get('/', authenticate, (req, res) => usersController.getAll(req, res));

export default users;
