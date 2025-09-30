import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

class SessionController {
    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        const emailOrPasswordIncorrect = () => {
            return response.status(401).json({
                error: 'Make sure your email or password are correct',
            });
        };

        try {
            const isValid = await schema.isValid(request.body);
            if (!isValid) {
                return emailOrPasswordIncorrect();
            }

            const { email, password } = request.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return emailOrPasswordIncorrect();
            }

            const isSamePassword = await user.checkPassword(password); // <-- Isso pode causar erro!
            if (!isSamePassword) {
                return emailOrPasswordIncorrect();
            }

            const token = jwt.sign(
                { id: user.id, name: user.name },
                authConfig.secret,
                {
                    expiresIn: authConfig.expiresIn,
                }
            );

            return response.json({
                id: user.id,
                name: user.name,
                email,
                admin: user.admin,
                token,
            });
        } catch (err) {
            console.error('Erro no login:', err); // Mostra no console
            return response.status(500).json({
                error: 'Erro interno no servidor. Verifique o console.',
            });
        }
    }
}

export default new SessionController();
