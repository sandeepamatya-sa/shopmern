const { Schema, model } = require('mongoose');
const { stringRequired, numberRequired, booleanTrue, modelConfig } = require('../library/constants');

// ─── User ────────────────────────────────────────────────────────────────────
const User = model('User', new Schema({
    name: stringRequired,
    email: { ...stringRequired, unique: true },
    password: { ...stringRequired, select: false },
    phone: { ...stringRequired, maxLength: [20, 'Phone must be ≤20 chars'] },
    address: stringRequired,
    role: { type: String, enum: ['Admin', 'Staff', 'Customer'], default: 'Customer' },
    status: booleanTrue,
}, modelConfig));

// ─── Category ────────────────────────────────────────────────────────────────
const Category = model('Category', new Schema({
    name: stringRequired,
    status: booleanTrue,
}, modelConfig));

// ─── Brand ───────────────────────────────────────────────────────────────────
const Brand = model('Brand', new Schema({
    name: stringRequired,
    status: booleanTrue,
}, modelConfig));

// ─── Product ─────────────────────────────────────────────────────────────────
const Product = model('Product', new Schema({
    name: stringRequired,
    description: stringRequired,
    shortDescription: stringRequired,
    price: numberRequired,
    discountedPrice: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    images: [String],
    status: booleanTrue,
    featured: { type: Boolean, default: false },
}, modelConfig));

// ─── ProductDetail ───────────────────────────────────────────────────────────
const Detail = model('Detail', new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    specs: { type: Object, default: {} },
}, modelConfig));

// ─── Review ──────────────────────────────────────────────────────────────────
const Review = model('Review', new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: stringRequired,
    status: booleanTrue,
}, modelConfig));

// ─── Order ───────────────────────────────────────────────────────────────────
const Order = model('Order', new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cart: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        qty: { type: Number, default: 1 },
    }],
    totalAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
}, modelConfig));

// ─── Payment ─────────────────────────────────────────────────────────────────
const Payment = model('Payment', new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transaction_uuid: { type: String, required: true, unique: true },
    amount: numberRequired,
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    method: { type: String, default: 'eSewa' },
    response: { type: Object },
}, modelConfig));

// ─── Transaction (log) ───────────────────────────────────────────────────────
const Transaction = model('Transaction', new Schema({
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    data: { type: Object },
}, modelConfig));

module.exports = { User, Category, Brand, Product, Detail, Review, Order, Payment, Transaction };
