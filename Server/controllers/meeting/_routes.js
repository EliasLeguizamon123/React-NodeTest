const express = require('express');
// add mettings controllers
const MeetingController = require('./meeting')
// add auth middleware
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/', auth, MeetingController.add);
router.get('/', MeetingController.index);
router.get('/:id', auth, MeetingController.view);
router.delete('/:id', auth, MeetingController.deleteData);
router.post('/deleteMany', auth, MeetingController.deleteMany);

module.exports = router