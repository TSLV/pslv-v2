const express = require('express');

const appController = require('../controllers/userApp');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/', appController.getIndex);
router.get('/home', isAuth, appController.getDashboard);
router.get('/network', isAuth, appController.getNetwork);
router.get('/profile/:userId', isAuth, appController.getProfile);
router.get('/profile', isAuth, appController.getProfile);
router.get('/edit-details', isAuth, appController.getEditProfile);
router.get('/edit-posts', isAuth, appController.getEditPost);
router.get('/notifications', isAuth, appController.getNotification);
router.get('/jobs', isAuth, appController.getJobs);
router.get('/messages', isAuth, appController.getMessages);
router.post('/edit-details', isAuth, appController.postEditProfile);
router.post('/edit-posts', isAuth, appController.postEditPost);
router.post('/add-skill', isAuth, appController.postSkill);
router.post('/add-interest', isAuth, appController.postInterest);
router.post('/add-about', isAuth, appController.postAbout);
router.post('/post', isAuth, appController.postPost);
router.post('/comment', isAuth, appController.postComments);
router.post('/like', isAuth, appController.postLikes);
router.post('/post-job', isAuth, appController.postJobs);

module.exports = router;