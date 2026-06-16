const { Router } = require('express');
const { mix, frontProducts } = require('@/controllers/front');

const router = Router();

// Mix (categories, brands for navbar/filters)
router.get('/mix/categories', mix.categories);
router.get('/mix/brands', mix.brands);

// Products
router.get('/products/featured', frontProducts.featured);
router.get('/products/latest', frontProducts.latest);
router.get('/products/top-selling', frontProducts.topSelling);
router.get('/products', frontProducts.list);
router.get('/products/:id', frontProducts.detail);
router.get('/products/category/:id', frontProducts.byCategory);
router.get('/products/brand/:id', frontProducts.byBrand);

module.exports = router;
