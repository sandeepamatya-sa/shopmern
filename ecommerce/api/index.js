require('module-alias/register');

const express = require('express');
const { config } = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const router = require('./routes');
const checkoutRoutes = require('./routes/checkout.route');
const paymentRoutes = require('./routes/payment.route');

config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use(router);

// Global error handler
app.use((error, req, res, next) => {
    res.status(error.status || 400).send({
        message: error.message || 'Something went wrong',
        validation: error.validation
    });
});

// Connect to MongoDB (shared for both local and Vercel)
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection failed:', err.message));

// Start local dev server only when not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;
