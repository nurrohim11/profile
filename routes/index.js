var express = require('express');
const pool = require('../config/db');
const MainController = require('../controllers/MainController');
const MessageController = require('../controllers/MessageController');
const PortofolioController = require('../controllers/PortofolioController');
const SkillController = require('../controllers/SkillController');
const { uploadSkill, uploadProfile, uploadPortofolio } = require('../middlewares/multer');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.redirect('/main')
})
router.get('/main',MainController.dashboard)

// module contact
router.get('/main/contact',MainController.contact)
router.get('/main/view_contact',MainController.viewContact)
router.post('/contact/update_contact',uploadProfile, MainController.updateContact)

// module portofolio
router.get('/portofolio',PortofolioController.portofolio)
router.get('/portofolio/data_portofolio',PortofolioController.dataPortofolio)
router.post('/portofolio/process_portofolio',PortofolioController.procesPortofolio)
router.post('/portofolio/id_portofolio',PortofolioController.idPortofolio)
router.post('/portofolio/delete_portofolio',PortofolioController.deletePortofolio)
router.post('/portofolio/upload_image_portofolio',uploadPortofolio, PortofolioController.uploadImagePortofolio)
router.get('/portofolio/image_portofolio/:token',PortofolioController.imagePortofolio)
router.post('/portofolio/delete_image_portofolio',PortofolioController.deleteImagePortofolio)

// module skill
router.get('/skill/index',SkillController.skill)
router.get('/skill/data_skill',SkillController.dataSkill)
router.post('/skill/process_skill',uploadSkill, SkillController.processSkill)
router.post('/skill/delete_skill',SkillController.deleteSkill)
router.post('/skill/idSkill',SkillController.idSkill)

// module message
router.get('/message',MessageController.message)
router.get('/message/data_message',MessageController.dataMessage)

module.exports = router;