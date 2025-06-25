import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';

class ForgotPasswordController {
    async createToken(request, response) {
        const { email } = request.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        const resetToken = uuidv4();
        user.resetToken = resetToken;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        return response.json({
            message: 'Em um app real você receberia esse link por e-mail. Mas aqui vai direto. Porque somos devs e sabemos o que importa. 😎',
            resetLink: `${frontendUrl}/resetar-senha/${resetToken}`
        });
    }

    async resetPassword(request, response) {
        const { token } = request.params;
        const { newPassword } = request.body;

        const user = await User.findOne({ where: { resetToken: token } });

        if (!user) {
            return response.status(400).json({ error: 'Token inválido' });
        }

        user.password = newPassword;
        user.resetToken = null;
        await user.save();

        return response.json({ message: 'Senha redefinida com sucesso!' });
    }
}

export default new ForgotPasswordController();
