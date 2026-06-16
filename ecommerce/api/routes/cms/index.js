const { Router } = require('express');
const { categories, brands, products, customers, staffs, orders, reviews } = require('@/controllers/cms');
const { upload, adminOnly } = require('@/library/middlewares');

const router = Router();

// Categories
router.get('/categories', categories.list);
router.post('/categories', categories.create);
router.get('/categories/:id', categories.get);
router.put('/categories/:id', categories.update);
router.delete('/categories/:id', adminOnly, categories.remove);

// Brands
router.get('/brands', brands.list);
router.post('/brands', brands.create);
router.get('/brands/:id', brands.get);
router.put('/brands/:id', brands.update);
router.delete('/brands/:id', adminOnly, brands.remove);

// Products
router.get('/products', products.list);
router.post('/products', upload().array('images', 5), products.create);
router.get('/products/:id', products.get);
router.put('/products/:id', upload().array('images', 5), products.update);
router.delete('/products/:id', adminOnly, products.remove);

// Customers
router.get('/customers', customers.list);
router.get('/customers/:id', customers.get);
router.put('/customers/:id', customers.update);
router.delete('/customers/:id', adminOnly, customers.remove);

// Staffs (admin only)
router.get('/staffs', adminOnly, staffs.list);
router.post('/staffs', adminOnly, staffs.create);
router.get('/staffs/:id', adminOnly, staffs.get);
router.put('/staffs/:id', adminOnly, staffs.update);
router.delete('/staffs/:id', adminOnly, staffs.remove);

// Orders
router.get('/orders', orders.list);
router.get('/orders/:id', orders.get);
router.put('/orders/:id/status', orders.updateStatus);

// Reviews
router.get('/reviews', reviews.list);
router.put('/reviews/:id', reviews.updateStatus);
router.delete('/reviews/:id', adminOnly, reviews.remove);

module.exports = router;
