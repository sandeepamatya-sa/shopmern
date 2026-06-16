const { Router } = require('express');
const checkoutController = require('@/controllers/checkout.controller');
const { auth } = require('@/library/middlewares');

const router = Router();
router.post('/', auth, checkoutController.createOrder);

module.exports = router;
