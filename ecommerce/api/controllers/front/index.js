const { Product, Category, Brand, Review } = require('@/models');

const mix = {
    categories: async (req, res, next) => {
        try {
            const data = await Category.find({ status: true });
            res.json(data);
        } catch (e) { next(e); }
    },
    brands: async (req, res, next) => {
        try {
            const data = await Brand.find({ status: true });
            res.json(data);
        } catch (e) { next(e); }
    },
};

const frontProducts = {
    featured: async (req, res, next) => {
        try {
            const featured = await Product.find({ status: true, featured: true }).limit(8)
                .populate('categoryId', 'name').populate('brandId', 'name');
            res.json({ featured });
        } catch (e) { next(e); }
    },
    latest: async (req, res, next) => {
        try {
            const latest = await Product.find({ status: true }).sort({ createdAt: -1 }).limit(8)
                .populate('categoryId', 'name').populate('brandId', 'name');
            res.json({ latest });
        } catch (e) { next(e); }
    },
    topSelling: async (req, res, next) => {
        try {
            // For simplicity, return discounted products as top selling
            const topSelling = await Product.find({ status: true, discountedPrice: { $gt: 0 } }).limit(8)
                .populate('categoryId', 'name').populate('brandId', 'name');
            res.json({ topSelling });
        } catch (e) { next(e); }
    },
    list: async (req, res, next) => {
        try {
            const { categoryId, brandId, search, page = 1, limit = 12 } = req.query;
            const filter = { status: true };
            if (categoryId) filter.categoryId = categoryId;
            if (brandId) filter.brandId = brandId;
            if (search) filter.name = { $regex: search, $options: 'i' };

            const skip = (page - 1) * limit;
            const [products, total] = await Promise.all([
                Product.find(filter).skip(skip).limit(parseInt(limit))
                    .populate('categoryId', 'name').populate('brandId', 'name'),
                Product.countDocuments(filter),
            ]);
            res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
        } catch (e) { next(e); }
    },
    detail: async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id)
                .populate('categoryId', 'name').populate('brandId', 'name');
            if (!product) return next({ status: 404, message: 'Product not found' });

            const reviews = await Review.find({ productId: req.params.id, status: true })
                .populate('userId', 'name');

            res.json({ product, reviews });
        } catch (e) { next(e); }
    },
    byCategory: async (req, res, next) => {
        try {
            const products = await Product.find({ categoryId: req.params.id, status: true })
                .populate('brandId', 'name');
            res.json(products);
        } catch (e) { next(e); }
    },
    byBrand: async (req, res, next) => {
        try {
            const products = await Product.find({ brandId: req.params.id, status: true })
                .populate('categoryId', 'name');
            res.json(products);
        } catch (e) { next(e); }
    },
};

module.exports = { mix, frontProducts };
