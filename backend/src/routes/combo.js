const express = require('express');
const router = express.Router();
const comboController = require('../controllers/comboController');
const auth = require('../middlewares/auth');
const upload = require('../config/multer');

// Public routes
router.get('/', comboController.getAllCombos);
router.get('/:id', comboController.getComboById);
router.get('/:comboId/steps', comboController.getComboSteps);
router.post('/:comboId/validate', comboController.validateComboSelection);
router.get('/discount/:minDiscount', comboController.getCombosByDiscount);

// Admin routes
router.post('/', auth.requireAuth, auth.requireRole('admin'), upload.single('image'), comboController.createCombo);
router.put('/:id', auth.requireAuth, auth.requireRole('admin'), upload.single('image'), comboController.updateCombo);
router.delete('/:id', auth.requireAuth, auth.requireRole('admin'), comboController.deleteCombo);

module.exports = router; 