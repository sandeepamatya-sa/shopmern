const { Order } = require('@/models');

const checkoutController = {
    createOrder: async (req, res, next) => {
        try {
            const { cart } = req.body;
            const userId = req.user._id;

            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            let totalAmount = 0;
            const orderCart = cart.map(item => {
                const price = item.product.discountedPrice > 0
                    ? item.product.discountedPrice
                    : item.product.price;
                totalAmount += price * item.qty;
                return { productId: item.productId, qty: item.qty };
            });

            const order = await Order.create({ userId, cart: orderCart, totalAmount, status: 'Processing' });

            res.json({ success: true, message: 'Order created successfully', orderId: order._id, totalAmount });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = checkoutController;
