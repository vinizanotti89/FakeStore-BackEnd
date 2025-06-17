import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

function authMiddleware(req, res, next) {
  // Check if the user is authenticated
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authToken.split(' ')[1]; //Elimina Bearer e pega somente o token
  
  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error ();
      }
      req.userId = decoded.id; // Guarda o ID do usuário no objeto da requisição
      req.userName = decoded.name; // Guarda o nome do usuário no objeto da requisição

    });
  } catch {
    return res.status(401).json({ error: 'Token invalid' });
  }
  
    return next(); 
}

export default authMiddleware;