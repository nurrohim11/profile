var express = require('express');
const ApiController = require('../controllers/ApiController');

var router = express.Router();

router.get('/skill',ApiController.skill)
router.get('/portofolio',ApiController.portofolio)
router.get('/contact',ApiController.contact_me)
router.post('/message',ApiController.message)

module.exports = router;