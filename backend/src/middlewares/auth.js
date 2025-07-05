const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

exports.role = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Không đủ quyền truy cập' });
  }
  next();
};

// Alias cho đồng bộ với routes
exports.requireAuth = exports.auth;
exports.requireRole = (role) => exports.role([role]);

// Export tất cả để dễ import
module.exports = {
  auth: exports.auth,
  requireAuth: exports.requireAuth,
  role: exports.role,
  requireRole: exports.requireRole
}; 