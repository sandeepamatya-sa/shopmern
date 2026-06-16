const { Router } = require('express');
const profile = require('@/controllers/profile');

const router = Router();

router.get('/', profile.get);
router.put('/', profile.update);
router.put('/change-password', profile.changePassword);
router.get('/orders', profile.orders);
router.post('/reviews', profile.addReview);

module.exports = router;
