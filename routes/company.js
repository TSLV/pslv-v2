const express = require('express');

const companyController = require('../controllers/company');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/about', isAuth, companyController.getAbout)
router.get('/accessibility', isAuth, companyController.getAccessibility)
router.get('/privacy', isAuth, companyController.getPrivacy)
router.get('/faq', isAuth, companyController.getFaq)

module.exports = router;