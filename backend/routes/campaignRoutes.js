const express = require('express');
const router = express.Router();
const multer = require('multer');
const campaignController = require('../controllers/campaignController');

const upload = multer({ dest: 'uploads/' });

router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);
<<<<<<< HEAD
=======
router.put('/:id', campaignController.updateCampaign);
>>>>>>> master
router.post('/:id/upload-contacts', upload.single('file'), campaignController.uploadContacts);
router.post('/:id/send', campaignController.sendCampaign);
router.post('/:id/duplicate', campaignController.duplicateCampaign);

module.exports = router;
