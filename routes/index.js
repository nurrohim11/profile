var express = require('express');
const MainController = require('../controllers/MainController');
const MessageController = require('../controllers/MessageController');
const PortofolioController = require('../controllers/PortofolioController');
const SkillController = require('../controllers/SkillController');
const { uploadSkill, uploadProfile, uploadPortofolio } = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const EducationController = require('../controllers/EducationController');

var router = express.Router();

router.get('/', function (req, res) {
  console.log(req.session.user)
  if(req.session.islogin != undefined && req.session.islogin === true){
    res.redirect('/main')
  }
  else{
    res.redirect('/login')
  }
})
// login
router.get('/login',MainController.login)
router.get('/login/authentication',MainController.authentication)
// router.use(auth)

// main
router.get('/main',MainController.dashboard)
router.get('/login/logout',MainController.logout)

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

// module education
router.get('/education',EducationController.education)
router.get('/education/data_education',EducationController.dataEducation)
router.post('/education/process_education', EducationController.processEducation)
router.post('/education/delete_education',EducationController.deleteEducation)
router.post('/education/id_education',EducationController.id_education)

module.exports = router;