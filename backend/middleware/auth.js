// middleware/auth.js — JWT verification middleware
const jwt = require('jsonwebtoken');

/**
 * Protects routes — verifies Bearer JWT token.
 * Attaches decoded user payload to req.user.
 */
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorised, no token' });
  }
  try {
    const token   = header.split(' ')[1];
    req.user      = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

/**
 * Restricts access to specified roles.
 * Usage: router.delete('/:id', protect, authorise('admin'), handler)
 */
const authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not allowed to access this resource`,
    });
  }
  next();
};

module.exports = { protect, authorise };
