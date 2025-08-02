import { v4 as uuidv4 } from 'uuid';

import User from '../models/User';

import * as Yup from 'yup';


class UserController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            role: Yup.string().oneOf(['user', 'admin']).default('user'),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { name, email, password, role } = request.body;



        const userExists = await User.findOne({
            where: {
                email
            }
        });
        if (userExists) {
            return response.status(400).json({ error: 'Usuário ja cadastrado' });
        }

        const user = await User.create({
            id: uuidv4(),
            name,
            email,
            password,
            role,
        });

        const resetToken = uuidv4();
        user.resetToken = resetToken;
        await user.save();

        return response.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.admin,
            resetToken: user.resetToken, 
        });
    }


}

export default new UserController();