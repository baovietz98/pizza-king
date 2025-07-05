const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);

module.exports = router; 