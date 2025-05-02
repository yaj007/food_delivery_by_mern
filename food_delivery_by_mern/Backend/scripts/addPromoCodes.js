const mongoose = require('mongoose');
const PromoCode = require('../models/promoCode');  // Adjust path if necessary

// Connect to the database
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
    
    // Insert promo codes into the database
    PromoCode.create([
      {
        code: 'SAVE10',           // Promo code string
        discount: 10,             // Discount percentage
        expiryDate: new Date('2025-12-31'), // Expiry date
        active: true,             // Active status (set to true to make it active)
      },
      {
        code: 'SUMMER20',
        discount: 20,
        expiryDate: new Date('2025-06-30'),
        active: true,
      },
      {
        code: 'WELCOME5',
        discount: 5,
        expiryDate: new Date('2025-12-31'),
        active: true,
      }
    ])
      .then(() => {
        console.log('Promo codes added successfully');
        mongoose.connection.close(); // Close the connection after the operation
      })
      .catch((err) => {
        console.error('Error adding promo codes:', err);
        mongoose.connection.close();
      });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
