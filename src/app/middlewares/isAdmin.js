import User from '../models/User.js';

export function hasRole(requiredRole) {
  return async (req, res, next) => {
    const user = await User.findByPk(req.userId);
    if (!user || user.role !== requiredRole) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    return next();
  };
}