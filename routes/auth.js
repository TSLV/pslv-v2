const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/details/:userId', authController.getDetails);
router.get('/role/:userId', authController.getRole);
router.post('/role', authController.postRole);

module.exports = router;