const jwt = require('jsonwebtoken');
const { User } = require('@/models');
const multer = require('multer');
const path = require('path');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next({ status: 401, message: 'Authentication token missing' });

        const token = authHeader.split(' ').pop();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.uid);

        if (!user) return next({ status: 401, message: 'Invalid token' });
        if (!user.status) return next({ status: 403, message: 'Account is deactivated' });

        req.user = user;
        next();
    } catch (error) {
        next({ status: 401, message: 'Invalid or expired token' });
    }
};

const cmsUsers = (req, res, next) => {
    if (req.user.role !== 'Customer') {
        next();
    } else {
        next({ status: 403, message: 'Access denied' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role === 'Admin') {
        next();
    } else {
        next({ status: 403, message: 'Access denied - Admins only' });
    }
};

const customerOnly = (req, res, next) => {
    if (req.user.role === 'Customer') {
        next();
    } else {
        next({ status: 403, message: 'Access denied - Customers only' });
    }
};

const upload = () => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

module.exports = { auth, cmsUsers, adminOnly, customerOnly, upload };
