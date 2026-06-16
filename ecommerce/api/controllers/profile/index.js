const bcrypt = require('bcryptjs');
const { User, Order, Review } = require('@/models');

const profile = {
    get: async (req, res) => {
        res.json(req.user);
    },
    update: async (req, res, next) => {
        try {
            const { name, phone, address } = req.body;
            const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true });
            res.json(user);
        } catch (e) { next(e); }
    },
    changePassword: async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findById(req.user._id).select('+password');
            const match = await bcrypt.compare(oldPassword, user.password);
            if (!match) return next({ status: 400, message: 'Current password is incorrect' });

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.json({ message: 'Password changed successfully' });
        } catch (e) { next(e); }
    },
    orders: async (req, res, next) => {
        try {
            const orders = await Order.find({ userId: req.user._id })
                .populate('cart.productId', 'name price images')
                .sort({ createdAt: -1 });
            res.json(orders);
        } catch (e) { next(e); }
    },
    addReview: async (req, res, next) => {
        try {
            const review = await Review.create({ ...req.body, userId: req.user._id });
            res.status(201).json(review);
        } catch (e) { next(e); }
    },
};

module.exports = profile;
