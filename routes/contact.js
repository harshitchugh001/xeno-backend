const express = require('express');
const router = express.Router();
const {
  getuserContact,
  addContact,
  
} = require('../controllers/contact');

router.get('/allcontact', getuserContact);
router.post('/contact', addContact);
// router.put('/contactupdate/:id', updateContact);
// router.delete('/contact/:id', deleteContact);

module.exports = router;