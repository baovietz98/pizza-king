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

// Middleware cho guest cart - không yêu cầu authentication
exports.guestAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token không hợp lệ, xử lý như guest
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

// Middleware để lấy guest session ID
exports.guestSession = (req, res, next) => {
  // Lấy session ID từ header hoặc cookie
  const sessionId = req.header('X-Session-ID') || req.cookies?.sessionId;
  if (sessionId) {
    req.guestSessionId = sessionId;
  } else {
    // Tạo session ID mới cho guest
    req.guestSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
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
  requireRole: exports.requireRole,
  guestAuth: exports.guestAuth,
  guestSession: exports.guestSession
}; 