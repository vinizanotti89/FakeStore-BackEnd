import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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

            // Busca usuário no PostgreSQL
            const user = await User.findOne({ where: { email } });
            if (!user) return emailOrPasswordIncorrect();

            // Checa senha
            const isSamePassword = await user.checkPassword(password);
            if (!isSamePassword) return emailOrPasswordIncorrect();

            // Cria token sem expiração automática usando o secret do usuário
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    admin: user.admin,
                },
                user.secret
            );

            return res.json({
                id: user.id,
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
