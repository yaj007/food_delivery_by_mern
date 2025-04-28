const express = require('express');
const router = express.Router();
const { validatePromoCode } = require('../controllers/promoCodeController');

// Route to validate the promo code
router.post('/validate', validatePromoCode);

module.exports = router;
