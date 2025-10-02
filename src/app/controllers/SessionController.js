import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

class SessionController {
    async store(req, res) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        const emailOrPasswordIncorrect = () =>
            res.status(401).json({ error: 'Verifique seu email e senha' });

        try {
            const isValid = await schema.isValid(req.body);
            if (!isValid) return emailOrPasswordIncorrect();

            const { email, password } = req.body;

            // 🔹 Para Mongoose:
            const user = await User.findOne({ email });
            if (!user) return emailOrPasswordIncorrect();

            // 🔹 Checa senha (precisa estar implementado no schema do User)
            const isSamePassword = await user.checkPassword(password);
            if (!isSamePassword) return emailOrPasswordIncorrect();

            // 🔹 Cria token sem expiração automática
            const token = jwt.sign(
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    admin: user.admin,
                },
                authConfig.secret
            );

            return res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                token,
            });
        } catch (err) {
            console.error('Erro no login:', err);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}

export default new SessionController();
