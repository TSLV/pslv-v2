const express = require('express');

const authController = require('../controllers/auth');
const adminController = require('../controllers/admin')

const router = express.Router("/auth");

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/details/:userId', authController.getDetails);
router.post('/details', authController.postDetails);
router.get('/role/:userId', authController.getRole);
router.post('/role', authController.postRole);
router.get('/admin', authController.getAdmin);
router.get('/admin-login', authController.getAdminLogin);
router.post('/admin-login', authController.postAdminLogin);
router.post('/news', adminController.postNews);
router.get('/searchMail', authController.searchMail)

module.exports = router;