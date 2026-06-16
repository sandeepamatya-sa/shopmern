const crypto = require('crypto');
const axios = require('axios');
const { Payment, Order } = require('@/models');

const ESEWA_SECRET = process.env.ESEWA_SECRET || '8gBm/:&EnhH.1/q';
const ESEWA_VERIFY_URL = 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';

function generateSignature(message, secret) {
    return crypto.createHmac('sha256', secret).update(message).digest('base64');
}

const paymentController = {
    // Initiate eSewa payment
    initiate: async (req, res, next) => {
        try {
            const { orderId } = req.body;
            const userId = req.user._id;

            const order = await Order.findById(orderId);
            if (!order) return next({ status: 404, message: 'Order not found' });

            const transaction_uuid = `TXN-${Date.now()}-${orderId}`;
            const amount = order.totalAmount;

            // Create pending payment record
            await Payment.create({ orderId, userId, transaction_uuid, amount, status: 'PENDING' });

            const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
            const signature = generateSignature(message, ESEWA_SECRET);

            res.json({
                success: true,
                paymentData: {
                    amount,
                    tax_amount: 0,
                    total_amount: amount,
                    transaction_uuid,
                    product_code: 'EPAYTEST',
                    product_service_charge: 0,
                    product_delivery_charge: 0,
                    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
                    failure_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`,
                    signed_field_names: 'total_amount,transaction_uuid,product_code',
                    signature,
                }
            });
        } catch (err) { next(err); }
    },

    // Verify eSewa payment after success redirect
    verify: async (req, res, next) => {
        try {
            const { data } = req.query;
            if (!data) return next({ status: 400, message: 'Missing payment data' });

            const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
            const { transaction_uuid, status, total_amount } = decoded;

            const payment = await Payment.findOne({ transaction_uuid });
            if (!payment) return next({ status: 404, message: 'Payment record not found' });

            if (status === 'COMPLETE') {
                payment.status = 'SUCCESS';
                payment.response = decoded;
                await payment.save();

                // Update order status
                await Order.findByIdAndUpdate(payment.orderId, { status: 'Confirmed' });

                return res.json({ success: true, message: 'Payment verified', payment });
            }

            payment.status = 'FAILED';
            payment.response = decoded;
            await payment.save();

            res.json({ success: false, message: 'Payment not completed' });
        } catch (err) { next(err); }
    },
};

module.exports = paymentController;
