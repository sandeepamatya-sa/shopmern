const { Router } = require('express');
const paymentController = require('@/controllers/payment.controller');
const { auth } = require('@/library/middlewares');

const router = Router();
router.post('/initiate', auth, paymentController.initiate);
router.get('/verify', paymentController.verify);

module.exports = router;
