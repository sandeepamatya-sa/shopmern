const { Category, Brand, Product, User, Order, Review, Detail } = require('@/models');

// ─── Categories ──────────────────────────────────────────────────────────────
const categories = {
    list: async (req, res, next) => {
        try {
            const data = await Category.find().sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    create: async (req, res, next) => {
        try {
            const item = await Category.create(req.body);
            res.status(201).json(item);
        } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const item = await Category.findById(req.params.id);
            if (!item) return next({ status: 404, message: 'Category not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
        try {
            const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!item) return next({ status: 404, message: 'Category not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (e) { next(e); }
    },
};

// ─── Brands ──────────────────────────────────────────────────────────────────
const brands = {
    list: async (req, res, next) => {
        try {
            const data = await Brand.find().sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    create: async (req, res, next) => {
        try {
            const item = await Brand.create(req.body);
            res.status(201).json(item);
        } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const item = await Brand.findById(req.params.id);
            if (!item) return next({ status: 404, message: 'Brand not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
        try {
            const item = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!item) return next({ status: 404, message: 'Brand not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            await Brand.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (e) { next(e); }
    },
};

// ─── Products ─────────────────────────────────────────────────────────────────
const products = {
    list: async (req, res, next) => {
        try {
            const data = await Product.find()
                .populate('categoryId', 'name')
                .populate('brandId', 'name')
                .sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    create: async (req, res, next) => {
        try {
            const images = req.files ? req.files.map(f => `uploads/${f.filename}`) : [];
            const item = await Product.create({ ...req.body, images });
            res.status(201).json(item);
        } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const item = await Product.findById(req.params.id)
                .populate('categoryId', 'name')
                .populate('brandId', 'name');
            if (!item) return next({ status: 404, message: 'Product not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
        try {
            const update = { ...req.body };
            if (req.files && req.files.length > 0) {
                update.images = req.files.map(f => `uploads/${f.filename}`);
            }
            const item = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
            if (!item) return next({ status: 404, message: 'Product not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (e) { next(e); }
    },
};

// ─── Customers ───────────────────────────────────────────────────────────────
const customers = {
    list: async (req, res, next) => {
        try {
            const data = await User.find({ role: 'Customer' }).sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const item = await User.findById(req.params.id);
            if (!item) return next({ status: 404, message: 'Customer not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
        try {
            const item = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(item);
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (e) { next(e); }
    },
};

// ─── Staffs ──────────────────────────────────────────────────────────────────
const staffs = {
    list: async (req, res, next) => {
        try {
            const data = await User.find({ role: { $in: ['Admin', 'Staff'] } }).sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    create: async (req, res, next) => {
        try {
            const bcrypt = require('bcryptjs');
            const hashed = await bcrypt.hash(req.body.password || 'Staff@123', 10);
            const item = await User.create({ ...req.body, password: hashed, role: req.body.role || 'Staff' });
            res.status(201).json(item);
        } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const item = await User.findById(req.params.id);
            if (!item) return next({ status: 404, message: 'Staff not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
        try {
            const item = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(item);
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (e) { next(e); }
    },
};

// ─── Orders ──────────────────────────────────────────────────────────────────
const orders = {
    list: async (req, res, next) => {
        try {
            const data = await Order.find()
                .populate('userId', 'name email')
                .populate('cart.productId', 'name price')
                .sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const item = await Order.findById(req.params.id)
                .populate('userId', 'name email address phone')
                .populate('cart.productId', 'name price images');
            if (!item) return next({ status: 404, message: 'Order not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
    updateStatus: async (req, res, next) => {
        try {
            const item = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
            if (!item) return next({ status: 404, message: 'Order not found' });
            res.json(item);
        } catch (e) { next(e); }
    },
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
const reviews = {
    list: async (req, res, next) => {
        try {
            const data = await Review.find()
                .populate('productId', 'name')
                .populate('userId', 'name')
                .sort({ createdAt: -1 });
            res.json(data);
        } catch (e) { next(e); }
    },
    updateStatus: async (req, res, next) => {
        try {
            const item = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
            res.json(item);
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            await Review.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted' });
        } catch (e) { next(e); }
    },
};

module.exports = { categories, brands, products, customers, staffs, orders, reviews };
