const express = require('express');

const appController = require('../controllers/userApp');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/', appController.getIndex);
router.get('/home', isAuth, appController.getDashboard);
router.get('/network', isAuth, appController.getNetwork);
router.post('/post', isAuth, appController.postPost);

module.exports = router;