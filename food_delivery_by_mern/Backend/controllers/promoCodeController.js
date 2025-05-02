const PromoCode = require('../models/PromoCode');

// Controller to handle the validation of promo codes
const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    // Find the promo code in the database
    const promoCode = await PromoCode.findOne({ code: code, active: true });

    if (!promoCode) {
      return res.status(400).json({ valid: false, message: 'Invalid promo code' });
    }

    // Check if the promo code has expired
    if (promoCode.expiryDate < new Date()) {
      return res.status(400).json({ valid: false, message: 'Promo code has expired' });
    }

    // Return the discount percentage if the code is valid
    return res.status(200).json({ valid: true, discount: promoCode.discount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ valid: false, message: 'Server error' });
  }
};

module.exports = { validatePromoCode };
