const User = require('../models/User');
const Staff = require('../models/Staff');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng ký chỉ cho user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng nhập cho user, staff, admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Ưu tiên tìm admin, rồi staff, rồi user
    let account = await Admin.findOne({ email });
    let role = 'admin';
    if (!account) {
      account = await Staff.findOne({ email });
      role = 'staff';
    }
    if (!account) {
      account = await User.findOne({ email });
      role = 'user';
    }
    if (!account) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    const token = jwt.sign({ userId: account._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: account._id, name: account.name, email: account.email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng ký admin (tạm thời để test)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Email đã tồn tại' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Đăng ký admin thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 