import jwt from 'jsonwebtoken';
import User from '../models/User.js';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    // Primeiro decodifica para pegar o ID do usuário
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Busca o usuário no PostgreSQL pelo ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verifica token com o secret do próprio usuário
    jwt.verify(token, user.secret);

    // Armazena informações do usuário na requisição
    req.userId = user.id;
    req.userName = user.name;
    req.userEmail = user.email;
    req.userAdmin = user.admin;

    return next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default authMiddleware;