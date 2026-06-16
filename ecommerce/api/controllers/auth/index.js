const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('@/models');

const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return next({ status: 409, message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, phone, address });

        res.status(201).json({ message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) return next({ status: 401, message: 'Invalid credentials' });
        if (!user.status) return next({ status: 403, message: 'Account is deactivated' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return next({ status: 401, message: 'Invalid credentials' });

        const token = jwt.sign({ uid: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
