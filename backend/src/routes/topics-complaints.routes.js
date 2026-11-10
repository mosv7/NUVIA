const express = require('express');
const router = express.Router();
const topicsController = require('../controllers/topics-complaints.controller');
const overviewAuth = require('../middlewares/overviewAuth.middleware');

router.use(overviewAuth);

router.get('/', topicsController.getTopicsAndComplaints);
router.get('/details', topicsController.getSelectedTopicDetails);

module.exports = router;